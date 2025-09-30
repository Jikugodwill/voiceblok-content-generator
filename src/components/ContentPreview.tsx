import React, { useState } from 'react';

interface ContentPreviewProps {
    content: string;
    originalPrompt?: string;
    contentType?: string;
    onEdit: (newContent: string) => void;
    onRegenerate?: () => void;
}

export default function ContentPreview({
    content,
    originalPrompt,
    contentType,
    onEdit,
    onRegenerate,
}: ContentPreviewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);


    const handleSave = () => {
        onEdit(editedContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    if (!content) {
        return (
            <div className="vb-empty-state">
                Generated content will appear here...
            </div>
        );
    }

    return (
        <div className="vb-section vb-stack-sm">
            {/* Content Type Badge */}
            {contentType && (
                <div className="vb-row-between">
                    <span className="vb-badge">
                        {contentType}
                    </span>
                    <div className="vb-actions">
                        {onRegenerate && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    onRegenerate()
                                }}
                                className="vb-button vb-button-secondary vb-button-sm"
                            >
                                🔄 Regenerate
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                setIsEditing(true)
                            }}
                            className="vb-button vb-button-secondary vb-button-sm"
                        >
                            ✏️ Edit
                        </button>
                    </div>
                </div>
            )}

            {/* Content Display/Edit */}
            {isEditing ? (
                <div className="vb-stack-sm">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="vb-textarea"
                        rows={Math.min(Math.max(editedContent.split('\n').length, 3), 8)}
                        placeholder="Edit your content..."
                    />
                    <div className="vb-actions">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSave()
                            }}
                            className="vb-button vb-button-primary"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                handleCancel()
                            }}
                            className="vb-button vb-button-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="vb-card">
                    <div className="content-preview">
                        {content.split('\n').map((line, index) => (
                            <p key={index} className={line.trim() ? 'vb-paragraph' : 'vb-paragraph-empty'}>
                                {line || '\u00A0'}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Original Prompt Display */}
            {originalPrompt && (
                <div className="vb-info-card">
                    <strong>Original command:</strong> {originalPrompt}
                </div>
            )}
        </div>
    );
}
