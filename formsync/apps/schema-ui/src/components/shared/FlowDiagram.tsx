import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';

interface PipelineStage {
  name: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

interface FlowDiagramProps {
  stages: PipelineStage[];
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ stages }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.name}>
          <StageNode stage={stage} index={index} />
          {index < stages.length - 1 && <Connector isActive={stage.status === 'complete'} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const StageNode: React.FC<{ stage: PipelineStage; index: number }> = ({ stage, index }) => {
  const getBackgroundColor = () => {
    switch (stage.status) {
      case 'complete':
        return 'bg-green-500';
      case 'loading':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-neutral-300 dark:bg-neutral-700';
    }
  };

  const getIcon = () => {
    switch (stage.status) {
      case 'complete':
        return <Check className="h-4 w-4 text-white" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-white animate-spin" />;
      default:
        return <Circle className="h-4 w-4 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`w-10 h-10 rounded-full ${getBackgroundColor()} flex items-center justify-center shadow-md transition-colors`}>
        {getIcon()}
      </div>
      <span className="text-xs font-medium text-center whitespace-nowrap">
        {stage.name}
      </span>
    </motion.div>
  );
};

const Connector: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
      className={`h-0.5 w-8 ${isActive ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'} transition-colors`}
    />
  );
};
