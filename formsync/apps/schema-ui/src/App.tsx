/**
 * Main App Component with Routing
 * 
 * Premium UI with landing page and editor navigation
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { TechnicalEditor } from './components/TechnicalEditor';
import { TemplateBuilder } from './components/TemplateBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Code2, Wand2, FileJson } from 'lucide-react';

// Editor Page Component
const EditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <FileJson className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">FormSync</h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Schema Editor
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-neutral-600 dark:text-neutral-400">
              <div>AI-Powered</div>
              <div className="text-xs">JSON Schema Draft-7</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 h-[calc(100vh-120px)]">
        <Tabs defaultValue="technical" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 glass">
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Technical Editor
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Template Builder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="flex-1 fade-in-up data-[state=active]:flex data-[state=inactive]:hidden">
            <TechnicalEditor />
          </TabsContent>

          <TabsContent value="builder" className="flex-1 fade-in-up data-[state=active]:flex data-[state=inactive]:hidden">
            <TemplateBuilder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </>
  );
}

export default App;
