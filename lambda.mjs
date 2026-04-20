import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const handler = async event => {
  const body = JSON.parse(event.body || '{}')
  const { messages } = body

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `Du bist ein hilfreicher Assistent für Senior React Engineers. 
Du hilfst bei React, TypeScript, AWS, GraphQL und modernen Frontend-Architekturen.
Antworte präzise und mit konkreten Code-Beispielen wenn möglich.
Antworte immer auf Deutsch.`,
      messages
    })

    console.log('Response:', response.content[0].text)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: response.content[0].text
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    }
  }
}
