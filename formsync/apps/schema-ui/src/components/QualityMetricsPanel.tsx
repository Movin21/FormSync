/**
 * Quality Metrics Panel Component
 * 
 * Displays AI enhancement quality metrics including:
 * - Overall quality score (0-100)
 * - Accessibility coverage percentage
 * - Detailed explanations of changes
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface QualityMetrics {
  qualityScore: number;
  explanations: Array<{
    path: string;
    action: string;
    reason: string;
  }>;
  metrics: {
    totalChanges: number;
    accessibilityCoverage: number;
  };
}

interface QualityMetricsPanelProps {
  metrics: QualityMetrics;
  onClose: () => void;
}

export const QualityMetricsPanel: React.FC<QualityMetricsPanelProps> = ({ metrics, onClose }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'High Quality', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (score >= 50) return { label: 'Medium Quality', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
  };

  const badge = getScoreBadge(metrics.qualityScore);
  const accessibilityPercent = Math.round(metrics.metrics.accessibilityCoverage * 100);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-white dark:bg-neutral-900 shadow-2xl">
          <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <span>Quality Metrics</span>
                  <Badge className={badge.color}>
                    {badge.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  AI enhancement quality analysis
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Quality Score */}
            <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Overall Quality Score
              </div>
              <div className={`text-6xl font-bold ${getScoreColor(metrics.qualityScore)}`}>
                {metrics.qualityScore}
              </div>
              <div className="text-sm text-neutral-500 mt-1">out of 100</div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Total Changes
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {metrics.metrics.totalChanges}
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Accessibility Coverage
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {accessibilityPercent}%
                </div>
              </div>
            </div>

            {/* Explanations */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                What Changed
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {metrics.explanations.map((explanation, index) => (
                  <div
                    key={index}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {explanation.action}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {explanation.path}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {explanation.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Info */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                💡 <strong>Score Breakdown:</strong> Structure completeness (30 pts) + AI improvements (20 pts) + Accessibility coverage (15 pts)
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
