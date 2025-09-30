import React, { useState, useEffect } from 'react'
import { CONTENT_TYPES } from '../lib/constants'

interface PromptInputProps {
    onGenerate: (prompt: string) => void
    disabled: boolean
    placeholder?: string
    value?: string
    contentType?: string
    onChangeContentType?: (type: string) => void
}

const PromptInput: React.FC<PromptInputProps> = ({
    onGenerate,
    disabled,
    placeholder = "Enter your prompt...",
    value = '',
    contentType = 'text',
    onChangeContentType,
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
            <div className="vb-header">
                <div className="vb-title">Prompt</div>
                <div className="vb-subtitle">Craft a clear, outcome-focused request</div>
            </div>
            <div className="vb-input-wrap">
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
                    <span className="vb-kbd">⌘ Enter</span> to generate
                </div>
                {/* Bottom-left content type dropdown */}
                <div className="vb-type-dropdown">
                    <select
                        aria-label="Content type"
                        className="vb-select"
                        value={contentType}
                        disabled={disabled}
                        onChange={(e) => onChangeContentType?.(e.target.value)}
                    >
                        {CONTENT_TYPES.map((t) => (
                            <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                        ))}
                    </select>
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