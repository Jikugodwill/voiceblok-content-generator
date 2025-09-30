import React, { useState, useEffect } from 'react'

interface PromptInputProps {
    onGenerate: (prompt: string) => void
    disabled: boolean
    placeholder?: string
    value?: string
}

const PromptInput: React.FC<PromptInputProps> = ({
    onGenerate,
    disabled,
    placeholder = "Enter your prompt...",
    value = ''
}) => {
    const [prompt, setPrompt] = useState(value)

    useEffect(() => {
        setPrompt(value)
    }, [value])

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault()
        if (prompt.trim()) {
            onGenerate(prompt.trim())
            setPrompt('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.metaKey) {
            e.preventDefault()
            if (prompt.trim()) {
                onGenerate(prompt.trim())
                setPrompt('')
            }
        }
    }

    return (
        <div className="vb-section">
            <label className="vb-label">
                AI Prompt
            </label>
            <div className="relative">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={3}
                    className="vb-textarea"
                />
                <div className="vb-helper">
                    Cmd+Enter to generate
                </div>
            </div>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || !prompt.trim()}
                className="vb-button vb-button-primary vb-button-block"
            >
                {disabled ? '✨ Generating...' : '✨ Generate Content'}
            </button>
        </div>
    )
}

export default PromptInput