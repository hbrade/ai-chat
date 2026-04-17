import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')

  const stream = client.messages.stream({
    // model: 'claude-sonnet-4-20250514',
    model: 'claude-haiku-4-5-20251001', // simple model for test purposes
    max_tokens: 1024,
    messages
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
    }
  }
  res.write('data: [DONE]\n\n')
  res.end()
})

app.listen(3001, () => console.log('Proxy running on :3001'))
