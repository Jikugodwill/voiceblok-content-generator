import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

export interface ContentResult {
    content: string
    error: string | null
}

export const generateContent = async (
    contentType: string,
    prompt: string
): Promise<ContentResult> => {
    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            throw new Error('Gemini API key missing')
        }

        const systemPrompt = getSystemPrompt(contentType)
        const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate the content:`

        const result = await model.generateContent(fullPrompt)
        const content = result.response.text()

        if (!content?.trim()) {
            return { content: '', error: 'Generated content was empty' }
        }

        return { content: content.trim(), error: null }

    } catch (err: unknown) {
        console.error('Content generation error:', err)
        return {
            content: '',
            error: (err as Error)?.message || 'Failed to generate content'
        }
    }
}

const getSystemPrompt = (contentType: string): string => {
    const prompts = {
        headline: "You are a professional copywriter. Generate a compelling, benefit-focused headline that captures attention and communicates value. Keep it under 60 characters, avoid jargon, and make it actionable.",
        description: "You are a professional copywriter. Write a clear, engaging description that explains the value proposition and benefits. Use a conversational tone that builds trust and interest.",
        bullets: "You are a professional copywriter. Create 3-5 concise bullet points that focus on outcomes and benefits, not just features. Start each bullet with an action verb and keep under 9 words each.",
        cta: "You are a professional copywriter. Generate a compelling call-to-action that reduces anxiety and sets clear expectations. Keep it 2-5 words, action-oriented, and include trust signals like 'Free' or 'No card' when appropriate.",
        'alt-text': "You are an accessibility expert. Create descriptive alt text that helps screen readers understand the image content. Keep it under 125 characters, be specific about what's shown, and avoid redundant phrases like 'image of'.",
        tagline: "You are a professional copywriter. Create a memorable tagline (3-5 words) that reinforces the value proposition. Avoid clichés and make it unique to the brand.",
        subject: "You are an email marketing expert. Generate a high-open-rate subject line that creates curiosity without being clickbait. Keep it around 45 characters, action-oriented, and benefit-focused.",
        text: "You are a professional copywriter. Generate clear, engaging text content that provides value to the reader. Use a conversational tone and focus on benefits over features."
    }
    return prompts[contentType as keyof typeof prompts] || prompts.text
}
