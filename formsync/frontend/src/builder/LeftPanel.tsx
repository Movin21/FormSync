import React, { useState } from 'react';
import { useBuilder, createField } from '../context/BuilderContext';
import { FieldModel, FieldType } from '../types';
import { LucideIcon, Type, Mail, Lock, Hash, AlignLeft, Calendar, ChevronDown, CheckSquare, List, Upload, FileText, PenLine, Search, Calculator, Folder } from 'lucide-react';

// ─── Palette Config ───────────────────────────────────────────────────────────

type PaletteEntry = { type: FieldType; label: string; Icon: LucideIcon };
type PaletteGroup = { title: string; fields: PaletteEntry[] };

const PALETTE_GROUPS: PaletteGroup[] = [
    {
        title: 'Basic',
        fields: [
            { type: 'text', label: 'Text', Icon: Type },
            { type: 'email', label: 'Email', Icon: Mail },
            { type: 'password', label: 'Password', Icon: Lock },
            { type: 'number', label: 'Number', Icon: Hash },
            { type: 'textarea', label: 'Text Area', Icon: AlignLeft },
            { type: 'date', label: 'Date', Icon: Calendar },
        ],
    },
    {
        title: 'Choice',
        fields: [
            { type: 'select', label: 'Dropdown', Icon: ChevronDown },
            { type: 'checkbox', label: 'Checkbox', Icon: CheckSquare },
        ],
    },
    {
        title: 'Structure',
        fields: [
            { type: 'group', label: 'Group', Icon: Folder },
            { type: 'repeater', label: 'Repeater', Icon: List },
        ],
    },
    {
        title: 'Advanced',
        fields: [
            { type: 'file', label: 'File Upload', Icon: Upload },
            { type: 'richtext', label: 'Rich Text', Icon: FileText },
            { type: 'signature', label: 'Signature', Icon: PenLine },
            { type: 'typeahead', label: 'Typeahead', Icon: Search },
            { type: 'calculated', label: 'Calculated', Icon: Calculator },
        ],
    },
];

// ─── Palette Button ───────────────────────────────────────────────────────────

const PaletteButton: React.FC<{
    label: string;
    Icon: PaletteEntry['Icon'];
    onClick: () => void;
}> = ({ label, Icon, onClick }) => (
    <button
        onClick={onClick}
        title={`Add ${label}`}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.6rem',
            border: '1px solid #e5e7eb',
            borderRadius: 5,
            background: '#fff',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 500,
            color: '#374151',
            transition: 'border-color 0.1s, background 0.1s',
            textAlign: 'left',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6366f1';
            e.currentTarget.style.background = '#f5f3ff';
            e.currentTarget.style.color = '#4338ca';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#374151';
        }}
    >
        <Icon size={13} strokeWidth={2} />
        <span>{label}</span>
    </button>
);

// ─── Field Tree Item ──────────────────────────────────────────────────────────

const FieldTreeItem: React.FC<{
    field: FieldModel;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    indent?: number;
}> = ({ field, isSelected, onSelect, onRemove, indent = 0 }) => (
    <div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.5rem',
                paddingLeft: `${0.5 + indent * 1}rem`,
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.8rem',
                background: isSelected ? '#f5f3ff' : 'transparent',
                border: `1px solid ${isSelected ? '#c4b5fd' : 'transparent'}`,
                marginBottom: 2,
            }}
            onClick={onSelect}
        >
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isSelected ? 600 : 400, color: '#1e293b' }}>
                {field.label}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', flexShrink: 0, fontFamily: 'monospace' }}>{field.type}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                title="Remove"
                style={{
                    padding: '0 4px', lineHeight: '16px', fontSize: '0.85rem',
                    border: 'none', background: 'transparent', color: '#94a3b8',
                    cursor: 'pointer', flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
                ×
            </button>
        </div>
        {field.children?.map((child) => (
            <FieldTreeItem key={child.id} field={child} isSelected={false} onSelect={() => { }} onRemove={() => { }} indent={indent + 1} />
        ))}
    </div>
);

// ─── Left Panel ───────────────────────────────────────────────────────────────

export const LeftPanel: React.FC = () => {
    const { state, dispatch, isWizardMode } = useBuilder();
    const [tab, setTab] = useState<'palette' | 'tree'>('palette');

    const orderedFields = state.form.layout.order
        .map((id) => state.form.fields.find((f) => f.id === id))
        .filter((f): f is FieldModel => !!f);
    const unlistedFields = state.form.fields.filter((f) => !state.form.layout.order.includes(f.id));
    const displayFields = [...orderedFields, ...unlistedFields];

    const handleAdd = (type: FieldType) => {
        const stepIndex = isWizardMode ? state.activeStep : undefined;
        dispatch({ type: 'ADD_FIELD', payload: createField(type, stepIndex) });
    };

    const handleRemove = (id: string) => {
        if (window.confirm('Remove this field?')) dispatch({ type: 'REMOVE_FIELD', payload: id });
    };

    const tabBtn = (active: boolean): React.CSSProperties => ({
        flex: 1, padding: '0.4rem', border: 'none', borderBottom: `2px solid ${active ? '#6366f1' : 'transparent'}`,
        background: 'none', cursor: 'pointer', fontWeight: active ? 600 : 400,
        color: active ? '#4338ca' : '#64748b', fontSize: '0.8rem',
    });

    return (
        <div className="panel">
            <div className="panel-header" style={{ paddingBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Fields</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    <button style={tabBtn(tab === 'palette')} onClick={() => setTab('palette')}>Palette</button>
                    <button style={tabBtn(tab === 'tree')} onClick={() => setTab('tree')}>
                        Added ({displayFields.length})
                    </button>
                </div>
            </div>

            <div className="panel-content" style={{ paddingTop: '0.75rem' }}>
                {tab === 'palette' && (
                    <div>
                        {PALETTE_GROUPS.map((group) => (
                            <div key={group.title} style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                                    {group.title}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                                    {group.fields.map(({ type, label, Icon }) => (
                                        <PaletteButton key={type} label={label} Icon={Icon} onClick={() => handleAdd(type)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                        {isWizardMode && (
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.6rem', background: '#f5f3ff', borderRadius: 5, border: '1px solid #ddd6fe', fontSize: '0.75rem', color: '#5b21b6' }}>
                                Adding to Step {state.activeStep + 1}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'tree' && (
                    <div>
                        {displayFields.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                                No fields yet.<br />Use the Palette tab.
                            </div>
                        ) : (
                            displayFields.map((field) => (
                                <FieldTreeItem
                                    key={field.id}
                                    field={field}
                                    isSelected={state.selectedFieldId === field.id}
                                    onSelect={() => dispatch({ type: 'SELECT_FIELD', payload: field.id })}
                                    onRemove={() => handleRemove(field.id)}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
