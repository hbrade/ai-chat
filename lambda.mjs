import Anthropic from '@anthropic-ai/sdk'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'eu-central-1' }))

export const handler = awslambda.streamifyResponse(async (event, responseStream) => {
  console.log('Event:', JSON.stringify(event))

  const body = JSON.parse(event.body || '{}')
  const { messages, sessionId } = body

  responseStream.setContentType('text/event-stream')

  try {
    // Nachrichten in DynamoDB speichern
    await dynamo.send(
      new PutCommand({
        TableName: 'ai-chat-sessions',
        Item: {
          sessionId,
          timestamp: Date.now(),
          messages: JSON.stringify(messages)
        }
      })
    )

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `Du bist ein hilfreicher Assistent für Senior React Engineers.
Du hilfst bei React, TypeScript, AWS, GraphQL und modernen Frontend-Architekturen.
Antworte präzise und mit konkreten Code-Beispielen wenn möglich.
Antworte immer auf Deutsch.`,
      messages
    })

    let fullResponse = ''

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        fullResponse += chunk.delta.text
        responseStream.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }

    // Komplette Antwort auch speichern
    await dynamo.send(
      new PutCommand({
        TableName: 'ai-chat-sessions',
        Item: {
          sessionId,
          timestamp: Date.now() + 1,
          messages: JSON.stringify([...messages, { role: 'assistant', content: fullResponse }])
        }
      })
    )

    responseStream.write('data: [DONE]\n\n')
  } catch (error) {
    console.error('Error:', error)
    responseStream.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
  } finally {
    responseStream.end()
  }
})
