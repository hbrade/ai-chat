import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const handler = awslambda.streamifyResponse(async (event, responseStream) => {
  console.log('Event:', JSON.stringify(event))

  const body = JSON.parse(event.body || '{}')
  const { messages } = body

  responseStream.setContentType('text/event-stream')

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `Du bist ein hilfreicher Assistent für Senior React Engineers.
Du hilfst bei React, TypeScript, AWS, GraphQL und modernen Frontend-Architekturen.
Antworte präzise und mit konkreten Code-Beispielen wenn möglich.
Antworte immer auf Deutsch.`,
      messages
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        responseStream.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }

    responseStream.write('data: [DONE]\n\n')
  } catch (error) {
    console.error('Error:', error)
    responseStream.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
  } finally {
    responseStream.end()
  }
})
