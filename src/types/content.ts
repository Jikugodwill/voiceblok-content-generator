export interface PromptBlokContent {
    generatedText: string
    originalPrompt: string
    contentType: string
    timestamp: number
}

export interface QuickPrompt {
    id: string
    label: string
    prompt: string
    contentType: string
    icon: string
}
