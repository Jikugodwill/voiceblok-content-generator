import type { QuickPrompt } from '../types/content';

interface ContentTypeSelectorProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
    onQuickPrompt: (prompt: QuickPrompt) => void;
}

const QUICK_PROMPTS: QuickPrompt[] = [
    {
        id: 'headline-value',
        label: 'Magnetic Value Headline',
        prompt: 'Craft a 7-10 word headline that states the core value prop with urgency and clarity. Avoid jargon. End without punctuation.',
        contentType: 'headline',
        icon: '✨',
    },
    {
        id: 'description-benefit',
        label: 'Benefit-First Description',
        prompt: 'Explain what this does in 2 crisp sentences. Lead with the main benefit, then how it works. Keep it friendly, confident, approachable.',
        contentType: 'description',
        icon: '🤖',
    },
    {
        id: 'bullets-outcomes',
        label: 'Outcome Bullets',
        prompt: 'List 4 bullets focused on outcomes, not features. Each bullet should start with an action verb and be <9 words.',
        contentType: 'bullets',
        icon: '✅',
    },
    {
        id: 'cta-primary',
        label: 'Primary CTA',
        prompt: 'Write a concise CTA (2-4 words) that sets clear expectations and reduces anxiety (e.g., Free, No card, 30s).',
        contentType: 'cta',
        icon: '➡️',
    },
    {
        id: 'alt-text-accessible',
        label: 'Accessible Alt Text',
        prompt: 'Describe the image for screen readers: mention role, key objects, color or mood if relevant, avoid redundancy like “image of”. Max 120 chars.',
        contentType: 'alt-text',
        icon: '🖼️',
    },
    {
        id: 'tagline',
        label: 'Smart Tagline',
        prompt: 'Create a short, memorable tagline (3-5 words) that reinforces the value proposition. Avoid clichés.',
        contentType: 'tagline',
        icon: '💡',
    },
    {
        id: 'email-subject',
        label: 'Email Subject',
        prompt: 'Generate a high-open-rate subject line with curiosity, ~45 chars, no clickbait, action-oriented.',
        contentType: 'subject',
        icon: '✉️',
    },
];

const CONTENT_TYPES = [
    { id: 'text', label: 'General Text', icon: '📄' },
    { id: 'headline', label: 'Headline', icon: '✨' },
    { id: 'description', label: 'Description', icon: '🤖' },
    { id: 'bullets', label: 'Bullet Points', icon: '✅' },
    { id: 'cta', label: 'Call to Action', icon: '➡️' },
    { id: 'alt-text', label: 'Alt Text', icon: '🖼️' },
    { id: 'tagline', label: 'Tagline', icon: '💡' },
    { id: 'subject', label: 'Email Subject', icon: '✉️' },
];

export default function ContentTypeSelector({
    selectedType,
    onTypeChange,
    onQuickPrompt
}: ContentTypeSelectorProps) {
    return (
        <div className="vb-stack">
            {/* Content Type Selector */}
            <div>
                <label className="vb-label">
                    Content Type
                </label>
                <div className="content-type-grid">
                    {CONTENT_TYPES.map((type) => (
                        <button
                            type="button"
                            key={type.id}
                            onClick={(e) => {
                                e.preventDefault()
                                onTypeChange(type.id)
                            }}
                            className={`vb-type-button ${selectedType === type.id ? 'is-selected' : ''}`}
                        >
                            <div className="vb-center">
                                <div className="vb-type-icon">{type.icon}</div>
                                <div>{type.label}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Prompts */}
            <div>
                <label className="vb-label">
                    Quick Prompts
                </label>
                <div className="vb-stack-sm">
                    {QUICK_PROMPTS.map((prompt) => (
                        <button
                            type="button"
                            key={prompt.id}
                            onClick={(e) => {
                                e.preventDefault()
                                onQuickPrompt(prompt)
                            }}
                            className="vb-list-button"
                        >
                            <span className="vb-list-icon">{prompt.icon}</span>
                            <span>{prompt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
