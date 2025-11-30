import React, { useEffect } from 'react';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { BuilderLayout } from './components/BuilderLayout';
import { parseJsonSchemaToFormModel } from '@formsync/formgen-core';
import './index.css';

// Schema Loader - Checks for schema from Schema UI (localStorage handoff)
const SchemaLoader: React.FC = () => {
    const { dispatch } = useBuilder();

    useEffect(() => {
        // Check for schema handoff from Schema UI
        const handoffSchema = localStorage.getItem('formsync:schema-handoff');

        if (handoffSchema) {
            try {
                // Parse the JSON schema
                const jsonSchema = JSON.parse(handoffSchema);

                // Convert JSON Schema to FormModel using the adapter
                const formModel = parseJsonSchemaToFormModel(jsonSchema);

                // Dispatch to context
                dispatch({
                    type: 'UPDATE_FORM',
                    payload: formModel
                });

                // Clear localStorage after successful load (one-time handoff)
                localStorage.removeItem('formsync:schema-handoff');

                // Show success message (using a simple approach without toast library)
                console.log('✅ Schema loaded from Schema UI successfully');

                // Optional: Add a visual indicator in the UI
                const notification = document.createElement('div');
                notification.textContent = '✅ Schema loaded from Schema UI';
                notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; font-family: Inter, sans-serif; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);

            } catch (error) {
                console.error('Failed to load schema from Schema UI:', error);

                // Clear bad data
                localStorage.removeItem('formsync:schema-handoff');

                // Show error and load demo form
                const notification = document.createElement('div');
                notification.textContent = `❌ Failed to load schema: ${error instanceof Error ? error.message : 'Invalid JSON'}`;
                notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; font-family: Inter, sans-serif; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 4000);

                // Load demo form as fallback
                loadDemoForm(dispatch);
            }
        } else {
            // No schema from Schema UI - load demo form for development
            console.log('ℹ️ No schema found from Schema UI, loading demo form');
            loadDemoForm(dispatch);
        }
    }, [dispatch]);

    return null; // Headless component
};

// Demo form for development (fallback when no schema is provided)
function loadDemoForm(dispatch: ReturnType<typeof useBuilder>['dispatch']) {
    setTimeout(() => {
        dispatch({
            type: 'UPDATE_FORM',
            payload: {
                id: 'sample-form',
                name: 'Employee Onboarding',
                version: '1.0',
                meta: {
                    title: 'Employee Onboarding Form',
                    description: 'Please fill out your details below.'
                },
                theme: {
                    mode: 'light',
                    density: 'normal',
                    radius: 6,
                    colors: {
                        primary: '#3b82f6',
                        background: '#ffffff',
                        surface: '#ffffff',
                        text: '#111827',
                        muted: '#6b7280',
                        border: '#e5e7eb',
                        error: '#ef4444',
                        inputBackground: '#f9fafb',
                    },
                    typography: {
                        fontFamily: 'Inter, sans-serif',
                        baseFontSize: 16,
                    }
                },
                layout: { order: ['f1', 'f2', 'f3'] },
                fields: [
                    { id: 'f1', key: 'fullName', type: 'text', label: 'Full Name', required: true },
                    { id: 'f2', key: 'email', type: 'email', label: 'Email Address', required: true },
                    { id: 'f3', key: 'role', type: 'select', label: 'Role', required: false, constraints: { enum: ['Dev', 'Design', 'Product'] } }
                ],
                submit: { text: 'Register Now' }
            }
        });
    }, 500);
}


function App() {
    return (
        <BuilderProvider>
            <SchemaLoader />
            <BuilderLayout />
        </BuilderProvider>
    );
}

export default App;
