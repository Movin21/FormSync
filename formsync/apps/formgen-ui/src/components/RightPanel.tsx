import React from 'react';
import { useBuilder } from '../context/BuilderContext';

export const RightPanel: React.FC = () => {
    const { state } = useBuilder();
    const selectedField = state.form.fields.find((f) => f.id === state.selectedFieldId);

    if (!selectedField) {
        return (
            <div className="panel">
                <div className="panel-header">Properties</div>
                <div className="panel-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="text-muted">Select a field to view properties</span>
                </div>
            </div>
        );
    }

    return (
        <div className="panel">
            <div className="panel-header">Properties: {selectedField.key}</div>
            <div className="panel-content">
                <div style={{ marginBottom: '1rem' }}>
                    <label className="field-label">Label</label>
                    <div className="field-input-mock" style={{ padding: '0.5rem' }}>
                        {selectedField.label}
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label className="field-label">Type</label>
                    <div className="field-input-mock" style={{ padding: '0.5rem' }}>
                        {selectedField.type}
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label className="field-label">Constraints</label>
                    <pre className="code-block">
                        {JSON.stringify(selectedField.constraints, null, 2) || 'None'}
                    </pre>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <small className="text-muted">Debug ID: {selectedField.id}</small>
                </div>
            </div>
        </div>
    );
};
