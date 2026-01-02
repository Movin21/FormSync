/**
 * Documentation Component
 * 
 * Displays the comprehensive user guide for FormSync
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Users, Sparkles, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FormSync User Guide
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Complete documentation for creating, validating, and optimizing forms
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <a href="#getting-started" className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Getting Started</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Access the app and understand the interface</div>
              </a>
              <a href="#creating-forms" className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Creating Forms</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Step-by-step form creation guide</div>
              </a>
              <a href="#quality-scores" className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Quality Scores</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Understanding the 0-100 scoring system</div>
              </a>
              <a href="#ai-suggestions" className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                <div className="font-semibold text-blue-600 dark:text-blue-400">AI Suggestions</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Working with AI recommendations</div>
              </a>
              <a href="#templates" className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Templates</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Pre-built forms to get started quickly</div>
              </a>
              <a href="#troubleshooting" className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Troubleshooting</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Common issues and solutions</div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          
          {/* Section 1: Overview */}
          <Card className="mb-8">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl">1. Overview of FormSync</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  What is FormSync?
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  FormSync is a web-based tool that helps you create, validate, and optimize forms with confidence. 
                  Whether you're building a simple contact form or a complex data collection system, FormSync ensures 
                  your forms are well-structured, accessible, and ready to use.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">What Does FormSync Do?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Creates Form Schemas:</strong> Build the structure and rules for your forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Validates Your Work:</strong> Checks for errors and ensures everything works correctly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Improves Quality:</strong> Uses AI to suggest enhancements like validation rules and accessibility features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Scores Your Forms:</strong> Gives you a quality score (0-100) showing how good your form is</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Supports Multiple Formats:</strong> Works with JSON, YAML, and XML</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How FormSync Helps You</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>For Non-Technical Users:</strong> Start with pre-built templates and let AI guide you through improvements. No coding required!</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span><strong>For Technical Users:</strong> Build schemas from scratch, get intelligent validation suggestions, and export to any format you need.</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Getting Started */}
          <Card className="mb-8" id="getting-started">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl">2. Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">Understanding the Dashboard</h3>
                <p className="mb-4 text-neutral-700 dark:text-neutral-300">
                  The FormSync interface has several key areas designed to make form creation intuitive:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Left Panel - Input</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Templates Button (📚)</li>
                      <li>• Format Selector (JSON/YAML/XML)</li>
                      <li>• Schema Editor</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Right Panel - Output</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Enhanced Schema</li>
                      <li>• Quality Score (0-100)</li>
                      <li>• Quality Breakdown</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Top Toolbar</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Validate Button</li>
                      <li>• Convert Button</li>
                      <li>• AI Enhance Button (✨)</li>
                      <li>• Tree View (🌲)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Navigation Tabs</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Editor Tab (main workspace)</li>
                      <li>• Documentation Tab (you're here!)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: User Roles */}
          <Card className="mb-8">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl">3. User Roles and Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Non-Technical Users</h3>
                  <p className="text-sm mb-3 text-blue-800 dark:text-blue- 200">Perfect for designers, business users, and students</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Start with ready-made templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Use AI to improve forms automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Apply suggestions with one click</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>No coding knowledge required</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">Technical Users</h3>
                  <p className="text-sm mb-3 text-purple-800 dark:text-purple-200">Perfect for developers and engineers</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span>Write schemas from scratch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span>Get advanced validation suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span>See detailed quality metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span>Export optimized schemas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Creating Forms */}
          <Card className="mb-8" id="creating-forms">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl">4. Creating Your First Form</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-green-50 dark:bg-green-950/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">
                  Option A: Using a Template (10 minutes)
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200 mb-4">Recommended for beginners</p>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <strong>Select a Template:</strong> Click the Templates button (📚) and choose "Contact Form"
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <strong>Enhance with AI:</strong> Click the AI Enhance button (✨) and wait a few seconds
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <strong>Review Suggestions:</strong> A panel appears showing all AI recommendations
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <strong>Apply Improvements:</strong> Click "Apply All" to accept everything
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <div>
                      <strong>Done!</strong> Copy the enhanced schema from the right panel. Quality score: 80+
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">
                  Option B: Building from Scratch (30 minutes)
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">For technical users</p>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <strong>Enter Your Schema:</strong> Type or paste your schema in the left editor
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <strong>Validate:</strong> Click Validate to check for errors
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <strong>Convert:</strong> Click Convert to transform it to standard format
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <strong>Get AI Suggestions:</strong> Click AI Enhance and review recommendations
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <div>
                      <strong>Apply & Export:</strong> Apply suggestions and copy the final schema
                    </div>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Quality Scores */}
          <Card className="mb-8" id="quality-scores">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl">5. Understanding Quality Scores</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-neutral-700 dark:text-neutral-300">
                The quality score is a number from <strong>0 to 100</strong> that shows how good your form is. 
                Higher scores mean better forms!
              </p>

              <div className="grid grid-cols-4 gap-3 my-6">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800 text-center">
                  <div className="text-2xl font-bold text-red-600">0-40</div>
                  <div className="text-xs text-red-700 dark:text-red-300">Needs Work</div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 text-center">
                  <div className="text-2xl font-bold text-yellow-600">41-70</div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">Good</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 text-center">
                  <div className="text-2xl font-bold text-blue-600">71-85</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Very Good</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800 text-center">
                  <div className="text-2xl font-bold text-green-600">86-100</div>
                  <div className="text-xs text-green-700 dark:text-green-300">Excellent!</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-4">Five Quality Dimensions</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">1. Structure (25 points)</h4>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">25%</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Is your form properly organized and valid?
                  </p>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <strong>How to improve:</strong> Use templates or let AI fix structural issues automatically
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">2. Validation (25 points)</h4>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">25%</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Do fields have validation rules like email format and password requirements?
                  </p>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <strong>How to improve:</strong> Apply AI suggestions for validation patterns
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">3. Accessibility (20 points)</h4>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">20%</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Does every field have labels and hints for screen readers?
                  </p>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <strong>How to improve:</strong> AI automatically adds accessibility features
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">4. Consistency (20 points)</h4>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">20%</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Are naming styles and field types consistent?
                  </p>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <strong>How to improve:</strong> AI suggests consistent naming conventions
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">5. AI Improvement (10 points)</h4>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">10%</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    How much has AI enhanced your form?
                  </p>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    <strong>How to improve:</strong> Apply AI enhancement suggestions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: AI Suggestions */}
          <Card className="mb-8" id="ai-suggestions">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                6. Working with AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-neutral-700 dark:text-neutral-300">
                AI suggestions are smart recommendations that improve your form. They're <strong>optional</strong> – 
                you choose which ones to apply.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Types of Suggestions</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Validation Rules</h4>
                  <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Email format checking</li>
                    <li>• Password requirements</li>
                    <li>• Number ranges</li>
                    <li>• Required fields</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Accessibility</h4>
                  <ul className="text-sm space-y-1 text-green-800 dark:text-green-200">
                    <li>• Field labels</li>
                    <li>• Helpful descriptions</li>
                    <li>• User hints</li>
                    <li>• Screen reader support</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Consistency</h4>
                  <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                    <li>• Standardized naming</li>
                    <li>• Proper field types</li>
                    <li>• Clear descriptions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-5 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-6">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">How to Use Suggestions</h4>
                <ol className="space-y-2 text-sm text-yellow-900 dark:text-yellow-100">
                  <li><strong>1. View All:</strong> Click AI Enhance after converting your schema</li>
                  <li><strong>2. Apply Individual:</strong> Click "Apply" on suggestions you want</li>
                  <li><strong>3. Apply All:</strong> Click "Apply All" for maximum quality boost</li>
                  <li><strong>4. Undo Anytime:</strong> Click "Undo" to reverse changes</li>
                  <li><strong>5. Watch Score:</strong> Quality score updates in real-time</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Templates */}
          <Card className="mb-8" id="templates">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl">7. Using Templates</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Templates are pre-built form schemas that you can use as starting points. They're fully functional 
                and ready to enhance with AI.
              </p>

              <h3 className="text-xl font-semibold mb-4">Available Templates</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📧 Contact Form</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    Perfect for website contact pages and support requests
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Fields: Name, Email, Message
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">👤 User Registration</h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    Perfect for account creation and sign-ups
                  </p>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    Fields: Username, Email, Password, Confirm Password
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">📊 Survey Form</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                    Perfect for feedback collection and research
                  </p>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    Fields: Rating scales, Multiple choice, Comments
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">⭐ Feedback Form</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                    Perfect for product reviews and service feedback
                  </p>
                  <div className="text-xs text-orange-700 dark:text-orange-300">
                    Fields: Rating, Comments, Contact info (optional)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Troubleshooting */}
          <Card className="mb-8" id="troubleshooting">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                8. Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Issue: "My quality score is low"
                  </h4>
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p className="mb-2"><strong>Target:</strong> Aim for 80+ score</p>
                    <p><strong>Solutions:</strong></p>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Run AI Enhance if you haven't</li>
                      <li>• Apply validation suggestions</li>
                      <li>• Add labels to all fields</li>
                      <li>• Check naming consistency</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Issue: "AI Enhance button doesn't work"
                  </h4>
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p><strong>Solutions:</strong></p>
                    <ol className="ml-4 mt-1 space-y-1 list-decimal">
                      <li>First click Validate</li>
                      <li>Then click Convert</li>
                      <li>Now click AI Enhance</li>
                      <li>Wait for suggestions to load</li>
                    </ol>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Issue: "Validation failed"
                  </h4>
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p className="mb-2"><strong>Common Problems:</strong> Syntax errors, missing fields, incorrect types</p>
                    <p><strong>Solutions:</strong></p>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Check the error message</li>
                      <li>• Fix the specific issue mentioned</li>
                      <li>• Use a format validator online</li>
                      <li>• Start with a template instead</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Help Section */}
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Info className="h-6 w-6" />
                Need More Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                <p>
                  <strong>For Questions:</strong> Check this user guide first, then contact your system administrator
                </p>
                <p>
                  <strong>For Bugs:</strong> Note what you were doing, take a screenshot, and report to your administrator
                </p>
                <p>
                  <strong>Quick Fixes:</strong> Refresh the page or try a different browser if you have issues
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            <strong>Thank you for using FormSync!</strong>
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
            We're here to make form creation easier, faster, and better. 🚀
          </p>
        </div>
      </div>
    </div>
  );
};
