/**
 * Enhancement Suggestions Panel Component
 * 
 * Displays AI suggestions with accept/reject functionality
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, X, Plus, Edit, Trash2, Sparkles, Undo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchemaEnhancement {
  path: string;
  originalValue: any;
  newValue: any;
  changeType: 'added' | 'modified' | 'removed';
  reason: string;
}

interface EnhancementsPanelProps {
  enhancements: SchemaEnhancement[];
  onApplySuggestion: (index: number) => void;
  onUndoSuggestion?: (index: number) => void;
  appliedSuggestions: Set<number>;
  onApplyAll?: () => void;
  onUndoAll?: () => void;
  onClose?: () => void;
}

const getChangeIcon = (changeType: string) => {
  switch (changeType) {
    case 'added':
      return <Plus className="h-4 w-4" />;
    case 'modified':
      return <Edit className="h-4 w-4" />;
    case 'removed':
      return <Trash2 className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

const getChangeBadgeVariant = (changeType: string) => {
  switch (changeType) {
    case 'added':
      return 'success';
    case 'modified':
      return 'default';
    case 'removed':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const EnhancementsPanel: React.FC<EnhancementsPanelProps> = ({
  enhancements,
  onApplySuggestion,
  onUndoSuggestion,
  appliedSuggestions,
  onApplyAll,
  onUndoAll,
  onClose,
}) => {
  if (enhancements.length === 0) {
    return null;
  }

  const appliedCount = appliedSuggestions.size;

  return (
    <Card className="glass border-2 border-primary-300 dark:border-primary-700">
      <CardHeader className="border-b border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <div>
              <CardTitle className="text-lg">AI Enhancement Suggestions ({enhancements.length})</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {appliedCount > 0 ? `${appliedCount} applied • ` : ''}
                Review and apply suggestions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onApplyAll && (
              <Button
                onClick={onApplyAll}
                size="sm"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                disabled={appliedCount === enhancements.length}
              >
                <Check className="h-4 w-4" />
                Apply All
              </Button>
            )}
            {onUndoAll && appliedCount > 0 && (
              <Button
                onClick={onUndoAll}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Undo All
              </Button>
            )}
            {onClose && (
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="hover:bg-red-100 dark:hover:bg-red-950/30"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          <div className="space-y-3">
            {enhancements.map((enhancement, index) => {
              const isApplied = appliedSuggestions.has(index);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0,x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isApplied
                      ? 'bg-success-50 dark:bg-success-950/20 border-success-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-primary-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getChangeBadgeVariant(enhancement.changeType)}>
                          {getChangeIcon(enhancement.changeType)}
                          <span className="ml-1 capitalize">{enhancement.changeType}</span>
                        </Badge>
                        <code className="text-xs bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">
                          {enhancement.path}
                        </code>
                      </div>

                      {/* Reason */}
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                        {enhancement.reason}
                      </p>

                      {/* Value Changes */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {enhancement.originalValue !== undefined && (
                          <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
                            <div className="font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1">
                              <X className="h-3 w-3" />
                              Original
                            </div>
                            <code className="text-red-600 dark:text-red-300">
                              {JSON.stringify(enhancement.originalValue, null, 2)}
                            </code>
                          </div>
                        )}
                        {enhancement.newValue !== undefined && (
                          <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800">
                            <div className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              New
                            </div>
                            <code className="text-green-600 dark:text-green-300">
                              {JSON.stringify(enhancement.newValue, null, 2)}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2">
                      {isApplied ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="gap-2 bg-success-100 dark:bg-success-900/30 border-success-400"
                          >
                            <Check className="h-4 w-4" />
                            Applied
                          </Button>
                          {onUndoSuggestion && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onUndoSuggestion(index)}
                              className="gap-2 hover:bg-orange-100 dark:hover:bg-orange-950/30 text-orange-600 dark:text-orange-400"
                            >
                              <Undo className="h-4 w-4" />
                              Undo
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onApplySuggestion(index)}
                          className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 border-0"
                        >
                          <Check className="h-4 w-4" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
