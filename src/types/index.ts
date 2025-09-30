import { PromptBlokContent } from './content';

export * from './content';

// Field plugin specific types
export interface PromptBlokFieldPlugin {
    content: PromptBlokContent;
    isDisabled?: boolean;
    placeholder?: string;
    maxLength?: number;
    allowedContentTypes?: string[];
}

export interface PluginMessage {
    action: 'heightChange' | 'contentUpdate' | 'error';
    data?: unknown;
}
