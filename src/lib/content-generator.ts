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

        const sanitized = sanitizeOutput(contentType, content.trim())
        if (!sanitized) {
            return { content: '', error: 'Generated content was empty after sanitization' }
        }
        return { content: sanitized, error: null }

    } catch (err: unknown) {
        console.error('Content generation error:', err)
        return {
            content: '',
            error: (err as Error)?.message || 'Failed to generate content'
        }
    }
}

// Chat mode removed

const getSystemPrompt = (contentType: string): string => {
    const prompts = {
        headline: [
            'You are a professional copywriter. Generate a compelling, benefit-focused headline that captures attention and communicates value.',
            'Constraints: under 60 characters, avoid jargon, actionable, no ending punctuation.',
            'Output one single-line headline ONLY. No options, no prefixes, no headings, no quotes, no markdown.'
        ].join(' '),
        description: [
            'You are a professional copywriter. Write a clear, engaging description that explains the value proposition and benefits.',
            'Constraints: 1-2 sentences, conversational tone, builds trust.',
            'Output the description text ONLY. No options, no prefixes, no headings, no quotes, no markdown.'
        ].join(' '),
        bullets: [
            'You are a professional copywriter. Create 3-5 concise bullet points that focus on outcomes and benefits, not just features.',
            'Constraints: start with action verbs, keep each <9 words.',
            'Output ONLY the bullet lines, one per line. No bullet symbols, no numbering, no headings, no extra text.'
        ].join(' '),
        cta: [
            'You are a professional copywriter. Generate a compelling call-to-action that reduces anxiety and sets clear expectations.',
            'Constraints: 2-5 words, action-oriented; include trust signals where relevant (e.g., Free, No card).',
            'Output one CTA ONLY as plain text. No options, no prefixes, no quotes, no markdown.'
        ].join(' '),
        'alt-text': [
            'You are an accessibility expert. Create descriptive alt text that helps screen readers understand the image content.',
            'Constraints: <125 characters, specific about what is shown, avoid "image of".',
            'Output ONLY the alt text sentence. No prefixes or extra formatting.'
        ].join(' '),
        tagline: [
            'You are a professional copywriter. Create a memorable tagline (3-5 words) that reinforces the value proposition.',
            'Constraints: Avoid clichés.',
            'Output one tagline ONLY as plain text. No options, no prefixes, no quotes, no markdown.'
        ].join(' '),
        subject: [
            'You are an email marketing expert. Generate a high-open-rate subject line that creates curiosity without being clickbait.',
            'Constraints: ~45 characters, action-oriented.',
            'Output one subject line ONLY as plain text. No options, no prefixes, no quotes, no markdown.'
        ].join(' '),
        text: [
            'You are a professional copywriter. Generate clear, engaging text content that provides value to the reader.',
            'Constraints: Focus on benefits over features.',
            'Output ONLY the requested text. No prefixes, no headings, no markdown.'
        ].join(' '),
    }
    return prompts[contentType as keyof typeof prompts] || prompts.text
}

// --- Output Sanitizer to enforce single direct answer ---
const sanitizeOutput = (contentType: string, raw: string): string => {
    const text = raw.replace(/\r/g, '').trim()
    if (!text) return ''

    const stripMarkdown = (s: string) => {
        let t = s
        // remove leading markdown symbols and list markers
        t = t.replace(/^\s*[#>*\-•–—]+\s+/g, '')
        t = t.replace(/^\s*\d+[.)]\s+/g, '')
        // remove bold/italic markers
        t = t.replace(/\*\*|__|\*|_/g, '')
        // remove backticks
        t = t.replace(/`/g, '')
        // remove surrounding straight or curly quotes
        t = t.replace(/^['"“”](.*)['"“”]$/g, '$1')
        // remove Option X labels
    t = t.replace(/^Option\s*\d+[:-]?\s*/i, '')
        return t.trim()
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

    if (contentType === 'bullets') {
        const cleaned = lines
            .map(stripMarkdown)
            .filter(l => l && !/^option\s*\d+/i.test(l))
        // Keep up to 5 lines
        return cleaned.slice(0, 5).join('\n')
    }

    // For single-line outputs: pick the first strong candidate
    const candidates = lines
        .map(stripMarkdown)
        .filter(l => l && !/^option\s*\d+/i.test(l))

    if (candidates.length === 0) return ''

    let out = candidates[0]
    // Headline: ensure no ending punctuation
    if (contentType === 'headline') {
        out = out.replace(/[.!?;:]+$/g, '')
    }
    // Collapse multiple spaces
    out = out.replace(/\s{2,}/g, ' ').trim()
    return out
}

// Chat system instruction removed
