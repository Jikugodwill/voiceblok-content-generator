import type { QuickPrompt } from '../types/content';
import { QUICK_PROMPTS } from '../lib/constants';

interface ContentTypeSelectorProps {
    selectedType: string; // kept for compatibility, not used now
    onTypeChange: (type: string) => void; // kept for compatibility, not used now
    onQuickPrompt: (prompt: QuickPrompt) => void;
}


export default function ContentTypeSelector({
    selectedType: _selectedType,
    onTypeChange: _onTypeChange,
    onQuickPrompt
}: ContentTypeSelectorProps) {
    return (
        <div className="vb-stack">
            {/* Quick Tips */}
            <div className="vb-tips-section">
                <div className="vb-tips-heading vb-stack-sm">
                    <div className="vb-title">Quick tips</div>
                    <div className="vb-subtitle">Jumpstart great prompts with one tap</div>
                </div>
                <div className="vb-chip-list">
                    {QUICK_PROMPTS.map((prompt) => (
                        <button
                            type="button"
                            key={prompt.id}
                            onClick={(e) => {
                                e.preventDefault()
                                onQuickPrompt(prompt)
                            }}
                            className="vb-chip"
                        >
                            <span className="vb-chip-icon">{prompt.icon}</span>
                            <span className="vb-chip-label">{prompt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
