/**
 * Landing Page Component
 * 
 * Premium landing page with animated hero, features, and CTA sections
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Zap, Shield, FileJson, Rocket } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const LandingPage: React.FC = () => {
  const scrollToEditor = () => {
    // Navigate to editor (will be implemented with routing)
    window.location.href = '/editor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 py-6"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FileJson className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">FormSync</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#templates" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition-colors">
              Templates
            </a>
            <a href="#docs" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition-colors">
              Docs
            </a>
          </div>

          <Button onClick={scrollToEditor} className="bg-gradient-primary hover:shadow-glow transition-all">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 pt-20 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-200 dark:border-primary-700">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                AI-Powered Schema Intelligence
              </span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Transform Your Data
            <br />
            <span className="text-gradient">with AI-Powered Schemas</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto"
          >
            Convert JSON, YAML, and XML to production-ready JSON Schemas in seconds.
            Enhanced with AI for better validation, accessibility, and developer experience.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={scrollToEditor}
              className="bg-gradient-primary hover:shadow-glow text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
            >
              Start Building <Rocket className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900 transition-all"
            >
              View Templates <Code2 className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Animated Preview Card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
            <Card className="relative glass border-2 border-white/20 dark:border-white/10 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-primary-500 to-accent-500 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <CardContent className="pt-16 pb-8 px-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2">INPUT</div>
                    <pre className="text-sm bg-neutral-900 text-green-400 p-4 rounded-lg overflow-auto">
{`<Form>
  <Field name="email"
         type="email"
         required="true">
    <Label>Email</Label>
  </Field>
</Form>`}
                    </pre>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-accent-600 dark:text-accent-400 mb-2">OUTPUT</div>
                    <pre className="text-sm bg-neutral-900 text-blue-400 p-4 rounded-lg overflow-auto">
{`{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["email"]
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for
              <span className="text-gradient"> Modern Development</span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Everything you need to create, validate, and enhance your schemas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full glass hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-700">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 float">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Schemas?
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
                Join developers building better data structures with AI-powered tools
              </p>
              <Button
                size="lg"
                onClick={scrollToEditor}
                className="bg-gradient-primary hover:shadow-glow-accent text-white px-10 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto text-center text-neutral-600 dark:text-neutral-400">
          <p className="mb-2">
            Built with ❤️ using React, TypeScript, and AI
          </p>
          <p className="text-sm">
            © 2025 FormSync. Open Source Project.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Features Data
const features = [
  {
    icon: <Zap className="w-7 h-7 text-white" />,
    title: 'Instant Conversion',
    description: 'Convert JSON, YAML, and XML to JSON Schema Draft-7 in milliseconds with intelligent parsing.',
  },
  {
    icon: <Sparkles className="w-7 h-7 text-white" />,
    title: 'AI Enhancement',
    description: 'Leverage AI to automatically improve schemas with better validation, descriptions, and accessibility.',
  },
  {
    icon: <Code2 className="w-7 h-7 text-white" />,
    title: 'Template Library',
    description: '7+ production-ready templates for forms, APIs, and databases to kickstart your project.',
  },
  {
    icon: <Shield className="w-7 h-7 text-white" />,
    title: 'Validation',
    description: 'Built-in validators ensure your schemas are correct, accessible, and follow best practices.',
  },
  {
    icon: <FileJson className="w-7 h-7 text-white" />,
    title: 'Multi-Format',
    description: 'Import from files, URLs, or templates. Export as JSON, YAML, or TypeScript interfaces.',
  },
  {
    icon: <Rocket className="w-7 h-7 text-white" />,
    title: 'Developer UX',
    description: 'Intuitive editor with tree view, search, undo/redo, and keyboard shortcuts for power users.',
  },
];

// Stats Data
const stats = [
  { value: '7+', label: 'Templates' },
  { value: '3', label: 'Format Support' },
  { value: 'AI', label: 'Powered' },
  { value: '100%', label: 'Open Source' },
];

// Add blob animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform: translate(50px, 50px) scale(1.05); }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
document.head.appendChild(style);
