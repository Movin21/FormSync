/**
 * Template Builder Component - Enhanced Non-Technical Version
 * 
 * Visual schema builder for non-technical users with:
 * - Field-by-field schema creation
 * - "Use Schema" button to transfer to Technical Editor
 * - Improved UX and button styling
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, FileJson, Trash2, ArrowRight, Check, GripVertical, Mail, Phone, Link, Calendar, Lock, AlignLeft, Hash, ToggleLeft, Wand2, Loader2, Pencil, Type, ToggleRight, List, Braces } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from './ui/alert-dialog';
import { schemaApi } from '../api/schemaApi';

interface SchemaField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  // Validation options
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  // Default values
  default?: any;
  placeholder?: string;
  example?: any;
}

interface TemplateBuilderProps {
  onUseSchema?: (schemaJson: string) => void; // Callback to send schema to Technical Editor
}

// Pre-built field templates for quick adding
interface FieldTemplate {
  name: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FIELD_TEMPLATES: FieldTemplate[] = [
  {
    name: 'email',
    type: 'string',
    description: 'Email address with validation',
    icon: <Mail className="h-4 w-4" />,
    color: 'blue'
  },
  {
    name: 'phone',
    type: 'string',
    description: 'Phone number',
    icon: <Phone className="h-4 w-4" />,
    color: 'green'
  },
  {
    name: 'website',
    type: 'string',
    description: 'URL/Website address',
    icon: <Link className="h-4 w-4" />,
    color: 'purple'
  },
  {
    name: 'date',
    type: 'string',
    description: 'Date picker',
    icon: <Calendar className="h-4 w-4" />,
    color: 'orange'
  },
  {
    name: 'password',
    type: 'string',
    description: 'Password field',
    icon: <Lock className="h-4 w-4" />,
    color: 'red'
  },
  {
    name: 'description',
    type: 'string',
    description: 'Long text area',
    icon: <AlignLeft className="h-4 w-4" />,
    color: 'gray'
  },
  {
    name: 'age',
    type: 'number',
    description: 'Numeric value',
    icon: <Hash className="h-4 w-4" />,
    color: 'indigo'
  },
  {
    name: 'accept_terms',
    type: 'boolean',
    description: 'Checkbox/Toggle',
    icon: <ToggleLeft className="h-4 w-4" />,
    color: 'teal'
  }
];

// Pre-built schema templates
interface SchemaTemplate {
  name: string;
  description: string;
  fields: Omit<SchemaField, 'id'>[];
}

const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    name: 'Contact Form',
    description: 'Basic contact information',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Full name', minLength: 2, maxLength: 100 },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'phone', type: 'string', required: false, description: 'Phone number' },
      { name: 'message', type: 'string', required: true, description: 'Message content', minLength: 10, maxLength: 1000 }
    ]
  },
  {
    name: 'Newsletter Signup',
    description: 'Email subscription',
    fields: [
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'first_name', type: 'string', required: true, description: 'First name' },
      { name: 'last_name', type: 'string', required: false, description: 'Last name' },
      { name: 'consent', type: 'boolean', required: true, description: 'Marketing consent' }
    ]
  },
  {
    name: 'Login Form',
    description: 'User authentication',
    fields: [
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'password', type: 'string', required: true, description: 'Password', minLength: 8 },
      { name: 'remember_me', type: 'boolean', required: false, description: 'Remember me' }
    ]
  },
  {
    name: 'Registration Form',
    description: 'New user signup',
    fields: [
      { name: 'username', type: 'string', required: true, description: 'Unique username', minLength: 3, maxLength: 20 },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'password', type: 'string', required: true, description: 'Password', minLength: 8 },
      { name: 'confirm_password', type: 'string', required: true, description: 'Confirm password', minLength: 8 },
      { name: 'terms_accepted', type: 'boolean', required: true, description: 'Accept terms and conditions' }
    ]
  },
  {
    name: 'Feedback Form',
    description: 'Customer feedback',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Your name' },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'rating', type: 'number', required: true, description: 'Rating (1-5)', minimum: 1, maximum: 5 },
      { name: 'comments', type: 'string', required: false, description: 'Additional comments', maxLength: 500 },
      { name: 'would_recommend', type: 'boolean', required: true, description: 'Would you recommend us?' }
    ]
  },
  {
    name: 'Booking Form',
    description: 'Appointment booking',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Full name' },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'phone', type: 'string', required: true, description: 'Phone number' },
      { name: 'date', type: 'string', required: true, description: 'Booking date', format: 'date' },
      { name: 'time', type: 'string', required: true, description: 'Preferred time' },
      { name: 'service', type: 'string', required: true, description: 'Service type' }
    ]
  },
  {
    name: 'Job Application',
    description: 'Employment application',
    fields: [
      { name: 'full_name', type: 'string', required: true, description: 'Full name' },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'phone', type: 'string', required: true, description: 'Phone number' },
      { name: 'resume', type: 'string', required: true, description: 'Resume/CV' },
      { name: 'cover_letter', type: 'string', required: false, description: 'Cover letter' },
      { name: 'position', type: 'string', required: true, description: 'Position applied for' }
    ]
  },
  {
    name: 'Support Ticket',
    description: 'Help desk request',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Your name' },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'subject', type: 'string', required: true, description: 'Issue subject' },
      { name: 'priority', type: 'string', required: true, description: 'Priority level' },
      { name: 'description', type: 'string', required: true, description: 'Issue description', minLength: 20 },
      { name: 'attachments', type: 'string', required: false, description: 'File attachments' }
    ]
  },
  {
    name: 'Order Form',
    description: 'Purchase order',
    fields: [
      { name: 'customer_name', type: 'string', required: true, description: 'Customer name' },
      { name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' },
      { name: 'product', type: 'string', required: true, description: 'Product name' },
      { name: 'quantity', type: 'number', required: true, description: 'Quantity', minimum: 1 },
      { name: 'shipping_address', type: 'string', required: true, description: 'Shipping address' },
      { name: 'payment_method', type: 'string', required: true, description: 'Payment method' }
    ]
  }
];

// Sortable Field Item Component
interface SortableFieldItemProps {
  field: SchemaField;
  index: number;
  onToggleRequired: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  isDragOverlay?: boolean;
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  string:  { color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800', icon: <Type className="h-3 w-3" /> },
  number:  { color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-blue-200 dark:border-blue-800',   icon: <Hash className="h-3 w-3" /> },
  integer: { color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-blue-200 dark:border-blue-800',   icon: <Hash className="h-3 w-3" /> },
  boolean: { color: 'text-emerald-600',bg: 'bg-emerald-50 dark:bg-emerald-950/30',border: 'border-emerald-200 dark:border-emerald-800',icon: <ToggleRight className="h-3 w-3" /> },
  array:   { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', icon: <List className="h-3 w-3" /> },
  object:  { color: 'text-pink-600',   bg: 'bg-pink-50 dark:bg-pink-950/30',     border: 'border-pink-200 dark:border-pink-800',   icon: <Braces className="h-3 w-3" /> },
};

const getTypeConfig = (type: string) => TYPE_CONFIG[type] || TYPE_CONFIG.string;

const FieldCard: React.FC<SortableFieldItemProps & { dragHandleProps?: any }> = ({
  field,
  index,
  onToggleRequired,
  onRemove,
  onEdit,
  isDragOverlay = false,
  dragHandleProps,
}) => {
  const tc = getTypeConfig(field.type);
  return (
    <div
      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border bg-white dark:bg-neutral-900 transition-all ${
        isDragOverlay
          ? 'border-purple-400 shadow-2xl shadow-purple-200/60 dark:shadow-purple-900/40 ring-2 ring-purple-300/50'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md'
      }`}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors" />
      </div>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
        tc.bg
      } ${tc.color}`}>
        {field.name[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 truncate">{field.name}</span>
          {field.required && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex-shrink-0">required</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
            tc.bg
          } ${tc.color} ${tc.border}`}>
            {tc.icon}
            {field.type}
          </span>
          {field.description && (
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{field.description}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleRequired(field.id)}
          title={field.required ? 'Mark optional' : 'Mark required'}
          className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
            field.required
              ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/60'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onEdit(field.id)}
          title="Edit field"
          className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onRemove(field.id)}
          title="Remove field"
          className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

const SortableFieldItem: React.FC<SortableFieldItemProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isDragging ? 0.3 : 1,
        scale: isDragging ? 0.98 : 1,
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <FieldCard
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </motion.div>
  );
};

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ onUseSchema }) => {
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');
  const [newFieldDescription, setNewFieldDescription] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Schema name state
  const [schemaName, setSchemaName] = useState('');
  const [nameSuggestionLoading, setNameSuggestionLoading] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = () => {
    if (!newFieldName.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    const newField: SchemaField = {
      id: Date.now().toString(),
      name: newFieldName,
      type: newFieldType,
      required: false,
      description: newFieldDescription || undefined,
    };

    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldDescription('');
    toast.success('Field added successfully');
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    toast.success('Field removed');
  };

  const toggleRequired = (id: string) => {
    setFields(fields.map(f => 
      f.id === id ? { ...f, required: !f.required } : f
    ));
  };

  // Add field from template
  const addFieldTemplate = (template: FieldTemplate) => {
    const newField: SchemaField = {
      id: `field-${Date.now()}`,
      name: template.name,
      type: template.type,
      required: template.name === 'email' || template.name === 'password', // Email and password required by default
      description: template.description
    };
    setFields([...fields, newField]);
    toast.success(`${template.name} field added!`);
  };

  // Update field properties (for validation editing)
  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(fields.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  // Handle drag end for reordering
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const activeField = fields.find(f => f.id === activeId);

  // Load schema template
  const loadSchemaTemplate = (templateName: string) => {
    const template = SCHEMA_TEMPLATES.find(t => t.name === templateName);
    if (template) {
      const newFields = template.fields.map(field => ({
        ...field,
        id: `field-${Date.now()}-${Math.random()}`
      }));
      setFields(newFields);
      // Auto-fill schema name from template
      setSchemaName(template.name);
      toast.success(`Loaded ${template.name} template!`);
    }
  };

  const generateSchema = (schemaTitle?: string) => {
    const properties: any = {};
    const required: string[] = [];

    fields.forEach(field => {
      const fieldSchema: any = {
        type: field.type,
        ...(field.description && { description: field.description }),
        // Add validation properties
        ...(field.minLength && { minLength: field.minLength }),
        ...(field.maxLength && { maxLength: field.maxLength }),
        ...(field.pattern && { pattern: field.pattern }),
        ...(field.format && { format: field.format }),
        ...(field.minimum !== undefined && { minimum: field.minimum }),
        ...(field.maximum !== undefined && { maximum: field.maximum }),
        ...(field.multipleOf && { multipleOf: field.multipleOf }),
        // Add default values
        ...(field.default !== undefined && { default: field.default }),
        ...(field.placeholder && { 'x-placeholder': field.placeholder }),
        ...(field.example !== undefined && { examples: [field.example] }),
      };
      properties[field.name] = fieldSchema;
      if (field.required) {
        required.push(field.name);
      }
    });

    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      ...(schemaTitle && { title: schemaTitle }),
      properties,
      ...(required.length > 0 && { required }),
    };

    return schema;
  };

  // AI Suggest Name Handler
  const handleSuggestName = async () => {
    if (fields.length === 0) {
      toast.error('Please add at least one field first');
      return;
    }

    setNameSuggestionLoading(true);
    try {
      const fieldNames = fields.map(f => f.name);
      const response = await schemaApi.suggestName({ fields: fieldNames });
      const suggestedName = response.data.suggestedName;
      setSchemaName(suggestedName);
      toast.success('AI suggested a schema name!', {
        description: `"${suggestedName}"`,
      });
    } catch (error: any) {
      toast.error('Failed to suggest name', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setNameSuggestionLoading(false);
    }
  };

  const handleUseSchema = async () => {
    if (fields.length === 0) {
      toast.error('Please add at least one field before using the schema');
      return;
    }

    // Ensure schema has a name (use AI if not provided)
    let finalName = schemaName.trim();
    if (!finalName) {
      try {
        const fieldNames = fields.map(f => f.name);
        const response = await schemaApi.suggestName({ fields: fieldNames });
        finalName = response.data.suggestedName;
        setSchemaName(finalName);
      } catch (error) {
        // Fallback to generic name
        finalName = `Schema ${new Date().getTime()}`;
        setSchemaName(finalName);
      }
    }

    const schema = generateSchema(finalName);
    const schemaJson = JSON.stringify(schema, null, 2);
    
    // Send to Technical Editor via callback
    if (onUseSchema) {
      onUseSchema(schemaJson);
    }
    
    toast.success('Schema transferred to Technical Editor! Switch to Technical Editor tab to continue.');
  };

  return (
    <div className="h-full flex gap-4">
      {/* Left Panel - Field Creation */}
      <Card className="w-80 border-2 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-neutral-900 shadow-lg">
        <CardHeader className="border-b border-indigo-200 dark:border-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Plus className="h-5 w-5" />
            Create Your Schema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Schema Name Input */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-neutral-700 dark:text-neutral-300">
              Schema Name *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Contact Form, User Registration"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4" />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
              Field Name *
            </label>
            <input
              type="text"
              placeholder="e.g., email, username"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addField()}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
              Field Type *
            </label>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all shadow-sm"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="array">Array</option>
              <option value="object">Object</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1.5">
              Description <span className="normal-case font-normal text-neutral-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., User's email address"
              value={newFieldDescription}
              onChange={(e) => setNewFieldDescription(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addField()}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 dark:focus:border-purple-500 transition-all shadow-sm"
            />
          </div>

          <Button
            onClick={addField}
            size="lg"
            variant="outline"
            className="w-full gap-2 py-6 text-base font-semibold border-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all"
          >
            <Plus className="h-5 w-5 text-indigo-600" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              Add Field to Schema
            </span>
          </Button>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
              Quick Add Fields
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {FIELD_TEMPLATES.map((template) => (
                <Button
                  key={template.name}
                  onClick={() => addFieldTemplate(template)}
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  title={template.description}
                >
                  {template.icon}
                  <span className="text-xs capitalize">{template.name}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-4">
              Press <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-600 dark:text-neutral-300 text-[11px] font-mono">Enter</kbd> to quickly add
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Center Panel - Field List */}
      <Card className="flex-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <CardTitle className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Schema Fields <span className="text-neutral-400 dark:text-neutral-500 font-normal">({fields.length})</span>
              </CardTitle>
            </div>
            <Button
              onClick={handleUseSchema}
              disabled={fields.length === 0}
              size="sm"
              className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-3.5 w-3.5" />
              Use in Editor
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          {/* Template Button - Opens Modal */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
            <Button
              onClick={() => setShowTemplateModal(true)}
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <FileJson className="h-3.5 w-3.5 text-purple-500" />
              Quick Start Templates
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {fields.length === 0 ? (
            <div className="text-center py-20">
             
              <p className="text-xl font-bold text-neutral-700 dark:text-neutral-200 mb-2">No Fields Yet</p>
              <p className="text-sm text-neutral-500 mb-4">Add fields from the left panel to build your schema</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                <span className="text-sm text-indigo-700 dark:text-indigo-300">← Start by adding your first field</span>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        index={index}
                        onToggleRequired={toggleRequired}
                        onRemove={removeField}
                        onEdit={() => setExpandedFieldId(field.id)}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </SortableContext>
              <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}>
                {activeField ? (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.03, rotate: 0.8 }}
                    className="cursor-grabbing"
                  >
                    <FieldCard
                      field={activeField}
                      index={0}
                      onToggleRequired={() => {}}
                      onRemove={() => {}}
                      onEdit={() => {}}
                      isDragOverlay
                      dragHandleProps={{}}
                    />
                  </motion.div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Right Panel - Live Preview */}
      <Card className="w-96 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <CardTitle className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Live Preview</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <pre className="text-xs bg-neutral-950 text-green-400 p-4 rounded-b-xl overflow-auto max-h-[600px] font-mono leading-relaxed">
            {JSON.stringify(generateSchema(schemaName || undefined), null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Template Selection Modal */}
      <AlertDialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Quick Start Templates</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a pre-built template to get started quickly
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-3 gap-3 my-4 max-h-[500px] overflow-y-auto pr-2">
            {SCHEMA_TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => {
                  loadSchemaTemplate(template.name);
                  setShowTemplateModal(false);
                }}
                className="text-left p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group"
              >
                <div className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {template.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                  {template.description}
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 font-mono">
                  {template.fields.length} fields
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Field Edit Modal */}
      {expandedFieldId && (() => {
        const editField = fields.find(f => f.id === expandedFieldId);
        if (!editField) return null;
        
        return (
          <AlertDialog open={true} onOpenChange={() => setExpandedFieldId(null)}>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Field: {editField.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  Modify field properties and validation rules
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4 my-4">
                {/* Basic Info Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Field Name</label>
                      <input
                        type="text"
                        value={editField.name}
                        onChange={(e) => updateField(editField.id, { name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Type</label>
                      <select
                        value={editField.type}
                        onChange={(e) => updateField(editField.id, { type: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="integer">Integer</option>
                        <option value="boolean">Boolean</option>
                        <option value="array">Array</option>
                        <option value="object">Object</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Description</label>
                      <input
                        type="text"
                        value={editField.description || ''}
                        onChange={(e) => updateField(editField.id, { description: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                </div>

                {/* Validation Rules Section */}
                {editField.type === 'string' && (
                  <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Validation Rules</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Min Length</label>
                        <input
                          type="number"
                          value={editField.minLength || ''}
                          onChange={(e) => updateField(editField.id, { minLength: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                          placeholder="Minimum"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Max Length</label>
                        <input
                          type="number"
                          value={editField.maxLength || ''}
                          onChange={(e) => updateField(editField.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                          placeholder="Maximum"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Pattern (Regex)</label>
                        <input
                          type="text"
                          value={editField.pattern || ''}
                          onChange={(e) => updateField(editField.id, { pattern: e.target.value || undefined })}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 font-mono"
                          placeholder="e.g., ^[A-Z][a-z]+$"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Format</label>
                        <select
                          value={editField.format || ''}
                          onChange={(e) => updateField(editField.id, { format: e.target.value || undefined })}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                        >
                          <option value="">None</option>
                          <option value="email">Email</option>
                          <option value="uri">URL</option>
                          <option value="date">Date</option>
                          <option value="time">Time</option>
                          <option value="date-time">DateTime</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {(editField.type === 'number' || editField.type === 'integer') && (
                  <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Validation Rules</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Minimum</label>
                        <input
                          type="number"
                          value={editField.minimum !== undefined ? editField.minimum : ''}
                          onChange={(e) => updateField(editField.id, { minimum: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                          placeholder="Min value"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Maximum</label>
                        <input
                          type="number"
                          value={editField.maximum !== undefined ? editField.maximum : ''}
                          onChange={(e) => updateField(editField.id, { maximum: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800"
                          placeholder="Max value"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <AlertDialogCancel className="mt-0" onClick={() => setExpandedFieldId(null)}>Done</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        );
      })()}
    </div>
  );
};
