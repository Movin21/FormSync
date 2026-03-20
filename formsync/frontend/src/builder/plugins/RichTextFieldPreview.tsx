import React from 'react';
import { Link2, List, ListOrdered } from 'lucide-react';
import { FieldPluginProps, registerPlugin } from './FieldPlugin';

const toolbarBtn: React.CSSProperties = {
    fontSize: '0.78rem',
    padding: '2px 6px',
    border: '1px solid #d1d5db',
    borderRadius: 3,
    background: '#fff',
    color: '#374151',
    fontFamily: 'inherit',
    fontWeight: 600,
    cursor: 'default',
    lineHeight: 1.2,
};

const RichTextFieldPreview: React.FC<FieldPluginProps> = ({ field }) => (
    <div
        style={{
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: 6,
            overflow: 'hidden',
            pointerEvents: 'none',
        }}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.75rem',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
            }}
        >
            <span style={toolbarBtn}>B</span>
            <span style={toolbarBtn}>I</span>
            <span style={toolbarBtn}>U</span>
            <span
                style={{
                    width: 1,
                    alignSelf: 'stretch',
                    minHeight: 14,
                    background: '#e5e7eb',
                    margin: '0 2px',
                    flexShrink: 0,
                }}
                aria-hidden
            />
            <span style={{ ...toolbarBtn, display: 'inline-flex', alignItems: 'center', padding: '2px 5px' }} aria-hidden>
                <List size={12} strokeWidth={2} />
            </span>
            <span style={{ ...toolbarBtn, display: 'inline-flex', alignItems: 'center', padding: '2px 5px' }} aria-hidden>
                <ListOrdered size={12} strokeWidth={2} />
            </span>
            <span style={{ ...toolbarBtn, display: 'inline-flex', alignItems: 'center', padding: '2px 5px' }} aria-hidden>
                <Link2 size={12} strokeWidth={2} />
            </span>
        </div>
        <div
            style={{
                padding: '0.75rem',
                minHeight: '80px',
                color: '#9ca3af',
                fontStyle: 'italic',
                fontSize: '0.875rem',
            }}
        >
            {field.ui?.placeholder ?? 'Start typing rich content here…'}
        </div>
    </div>
);

registerPlugin('richtext', RichTextFieldPreview);
export { RichTextFieldPreview };
