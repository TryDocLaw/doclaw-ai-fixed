import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { documentType, details, userId } = await request.json()

    // Check user's document quota
    const { data: profile } = await supabase
      .from('profiles')
      .select('documents_remaining, subscription_type')
      .eq('id', userId)
      .single()

    if (!profile || profile.documents_remaining <= 0) {
      return NextResponse.json(
        { error: 'No documents remaining. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Generate document with OpenAI
    const prompt = `Generate a professional ${documentType} with the following requirements:

${details}

Please create a complete, legally-formatted document that includes:
- Proper legal language and structure
- Standard clauses appropriate for this document type
- Placeholder fields for parties to fill in (use [PARTY_NAME], [DATE], etc.)
- Professional formatting

Make it comprehensive but readable.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal document AI assistant. Generate professional, well-structured legal documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })

    const document = completion.choices[0]?.message?.content || 'Error generating document'

    // Decrement user's document count
    await supabase
      .from('profiles')
      .update({ documents_remaining: profile.documents_remaining - 1 })
      .eq('id', userId)

    // Log the generation
    await supabase
      .from('documents')
      .insert({
        user_id: userId,
        document_type: documentType,
        content: document,
        generated_at: new Date().toISOString()
      })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error generating document:', error)
    return NextResponse.json(
      { error: 'Error generating document' },
      { status: 500 }
    )
  }
}