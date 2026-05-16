import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {

    const body = await req.json()

    const {
      projectType,
      visualStyle,
      lighting,
      camera,
      emotion,
      aspectRatio,
      duration,
      audio,
    } = body

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
You are a cinematic AI video director.

Generate:
1. Creative Direction
2. Final Prompt
3. Negative Prompt
4. Why This Works

Keep responses cinematic, concise, and production-ready.
`
        },

        {
          role: "user",
          content: `
Project Type: ${projectType}
Visual Style: ${visualStyle}
Lighting: ${lighting}
Camera: ${camera}
Emotion: ${emotion}
Aspect Ratio: ${aspectRatio}
Duration: ${duration}
Audio: ${audio}
`
        }
      ]
    })

    return Response.json({
      result: completion.choices[0].message.content
    })

  } catch (error) {

    console.error(error)

    return Response.json({
      error: "Generation failed"
    }, {
      status: 500
    })
  }
}