/**
 * Schema Quality Engine
 * 
 * Deterministic, rule-based quality scoring system for AI-generated JSON Schemas.
 * 
 * Evaluates schemas across 5 dimensions:
 * 1. Structural Completeness (25 points)
 * 2. Validation Strength (25 points)
 * 3. Accessibility & Metadata (20 points)
 * 4. Consistency & Safety (20 points)
 * 5. AI Improvement Depth (10 points)
 * 
 * Total: 100 points
 * 
 * Design Decision:
 * Scoring is deterministic and independent of AI generation logic,
 * ensuring reproducibility and explainability for academic evaluation.
 */

import { Injectable } from '@nestjs/common';
import { QualityResult, QualityBreakdown, SchemaProperty } from './schema-quality.types';

@Injectable()
export class SchemaQualityEngine {
  /**
   * Main evaluation method
   * @param schema - The enhanced JSON Schema to evaluate
   * @param aiChanges - Array of AI-generated changes
   * @returns Quality score, breakdown, and issues
   */
  evaluate(schema: any, aiChanges: any[] = []): QualityResult {
    const issues: string[] = [];

    // Dimension 1: Structural Completeness (25 points)
    const structureScore = this.evaluateStructure(schema, issues);

    // Dimension 2: Validation Strength (25 points)
    const validationScore = this.evaluateValidation(schema, issues);

    // Dimension 3: Accessibility & Metadata (20 points)
    const accessibilityScore = this.evaluateAccessibility(schema, issues);

    // Dimension 4: Consistency & Safety (20 points)
    const consistencyScore = this.evaluateConsistency(schema, issues);

    // Dimension 5: AI Improvement Depth (10 points)
    const improvementScore = this.evaluateImprovement(aiChanges, issues);

    const totalScore = Math.round(
      structureScore + validationScore + accessibilityScore + consistencyScore + improvementScore
    );

    return {
      score: totalScore,
      breakdown: {
        structure: Math.round(structureScore),
        validation: Math.round(validationScore),
        accessibility: Math.round(accessibilityScore),
        consistency: Math.round(consistencyScore),
        improvement: Math.round(improvementScore),
      },
      issues,
    };
  }

  // ========================================
  // Dimension 1: Structural Completeness (25 points)
  // ========================================

  /**
   * Evaluates structural integrity of the schema
   * 
   * Rules:
   * - Root schema must be type "object" → 5 pts
   * - "properties" exists and non-empty → 5 pts
   * - All nested objects define properties → 10 pts (proportional)
   * - All arrays define items → 5 pts (proportional)
   */
  private evaluateStructure(schema: any, issues: string[]): number {
    let score = 0;

    // Rule 1: Root must be object type (5 pts)
    if (schema.type === 'object') {
      score += 5;
    } else {
      issues.push('Root schema should be of type "object"');
    }

    // Rule 2: Properties exist and non-empty (5 pts)
    if (schema.properties && Object.keys(schema.properties).length > 0) {
      score += 5;
    } else {
      issues.push('Schema should define properties');
    }

    // Rule 3: Nested objects have properties (10 pts proportional)
    const { total: totalObjects, valid: validObjects } = this.countNestedObjects(schema);
    if (totalObjects > 0) {
      score += (validObjects / totalObjects) * 10;
      if (validObjects < totalObjects) {
        issues.push(`${totalObjects - validObjects} nested object(s) missing properties definition`);
      }
    } else {
      score += 10; // No nested objects = full score
    }

    // Rule 4: Arrays have items (5 pts proportional)
    const { total: totalArrays, valid: validArrays } = this.countArrays(schema);
    if (totalArrays > 0) {
      score += (validArrays / totalArrays) * 5;
      if (validArrays < totalArrays) {
        issues.push(`${totalArrays - validArrays} array(s) missing items definition`);
      }
    } else {
      score += 5; // No arrays = full score
    }

    return score;
  }

  /**
   * Count nested objects and how many properly define properties
   */
  private countNestedObjects(schema: any, path = ''): { total: number; valid: number } {
    let total = 0;
    let valid = 0;

    if (!schema.properties) return { total, valid };

    for (const [key, prop] of Object.entries(schema.properties)) {
      const property = prop as SchemaProperty;
      
      if (property.type === 'object') {
        total++;
        if (property.properties && Object.keys(property.properties).length > 0) {
          valid++;
        }
        // Recurse into nested objects
        const nested = this.countNestedObjects(property, `${path}.${key}`);
        total += nested.total;
        valid += nested.valid;
      }
    }

    return { total, valid };
  }

  /**
   * Count arrays and how many properly define items
   */
  private countArrays(schema: any): { total: number; valid: number } {
    let total = 0;
    let valid = 0;

    if (!schema.properties) return { total, valid };

    for (const prop of Object.values(schema.properties)) {
      const property = prop as SchemaProperty;
      
      if (property.type === 'array') {
        total++;
        if (property.items) {
          valid++;
        }
      }

      // Recurse into nested objects
      if (property.type === 'object' && property.properties) {
        const nested = this.countArrays(property);
        total += nested.total;
        valid += nested.valid;
      }
    }

    return { total, valid };
  }

  // ========================================
  // Dimension 2: Validation Strength (25 points)
  // ========================================

  /**
   * Evaluates validation rules coverage
   * 
   * Rules by type:
   * - string: minLength, maxLength, format, or pattern
   * - number: minimum or maximum
   * - array: minItems
   * - enum: non-empty enum list
   * 
   * Score = (fieldsWithValidation / totalFields) * 25
   */
  private evaluateValidation(schema: any, issues: string[]): number {
    const { total, validated, missing } = this.countValidationCoverage(schema);

    if (total === 0) return 25; // No fields = full score

    const score = (validated / total) * 25;

    // Report missing validations
    missing.forEach((fieldPath) => {
      issues.push(`${fieldPath} missing validation rules`);
    });

    return score;
  }

  /**
   * Count fields with and without validation rules
   */
  private countValidationCoverage(
    schema: any,
    path = ''
  ): { total: number; validated: number; missing: string[] } {
    let total = 0;
    let validated = 0;
    const missing: string[] = [];

    if (!schema.properties) return { total, validated, missing };

    for (const [key, prop] of Object.entries(schema.properties)) {
      const property = prop as SchemaProperty;
      const fieldPath = path ? `${path}.${key}` : key;

      total++;

      // Check validation based on type
      const hasValidation = this.hasValidationRules(property);
      
      if (hasValidation) {
        validated++;
      } else {
        missing.push(fieldPath);
      }

      // Recurse into nested objects
      if (property.type === 'object' && property.properties) {
        const nested = this.countValidationCoverage(property, fieldPath);
        total += nested.total;
        validated += nested.validated;
        missing.push(...nested.missing);
      }
    }

    return { total, validated, missing };
  }

  /**
   * Check if a property has validation rules based on its type
   */
  private hasValidationRules(property: SchemaProperty): boolean {
    const type = Array.isArray(property.type) ? property.type[0] : property.type;

    switch (type) {
      case 'string':
        return !!(
          property.minLength ||
          property.maxLength ||
          property.format ||
          property.pattern
        );
      
      case 'number':
      case 'integer':
        return !!(property.minimum !== undefined || property.maximum !== undefined);
      
      case 'array':
        return !!(property.minItems !== undefined);
      
      default:
        // Enum is considered validated
        if (property.enum && property.enum.length > 0) {
          return true;
        }
        return false;
    }
  }

  // ========================================
  // Dimension 3: Accessibility & Metadata (20 points)
  // ========================================

  /**
   * Evaluates accessibility and metadata coverage
   * 
   * Rules:
   * - description: 10 pts (proportional)
   * - x-accessibility.label: 10 pts (proportional)
   */
  private evaluateAccessibility(schema: any, issues: string[]): number {
    const { total, withDesc, withA11y, missingDesc, missingA11y } = 
      this.countAccessibilityMetadata(schema);

    if (total === 0) return 20; // No fields = full score

    const descScore = (withDesc / total) * 10;
    const a11yScore = (withA11y / total) * 10;

    // Report missing metadata
    if (missingDesc.length > 0) {
      issues.push(`${missingDesc.length} field(s) missing description`);
    }
    if (missingA11y.length > 0) {
      issues.push(`${missingA11y.length} field(s) missing accessibility label`);
    }

    return descScore + a11yScore;
  }

  /**
   * Count fields with descriptions and accessibility labels
   */
  private countAccessibilityMetadata(schema: any, path = ''): {
    total: number;
    withDesc: number;
    withA11y: number;
    missingDesc: string[];
    missingA11y: string[];
  } {
    let total = 0;
    let withDesc = 0;
    let withA11y = 0;
    const missingDesc: string[] = [];
    const missingA11y: string[] = [];

    if (!schema.properties) return { total, withDesc, withA11y, missingDesc, missingA11y };

    for (const [key, prop] of Object.entries(schema.properties)) {
      const property = prop as SchemaProperty;
      const fieldPath = path ? `${path}.${key}` : key;

      total++;

      // Check for description
      if (property.description) {
        withDesc++;
      } else {
        missingDesc.push(fieldPath);
      }

      // Check for accessibility label
      if (property['x-accessibility']?.label) {
        withA11y++;
      } else {
        missingA11y.push(fieldPath);
      }

      // Recurse into nested objects
      if (property.type === 'object' && property.properties) {
        const nested = this.countAccessibilityMetadata(property, fieldPath);
        total += nested.total;
        withDesc += nested.withDesc;
        withA11y += nested.withA11y;
        missingDesc.push(...nested.missingDesc);
        missingA11y.push(...nested.missingA11y);
      }
    }

    return { total, withDesc, withA11y, missingDesc, missingA11y };
  }

  // ========================================
  // Dimension 4: Consistency & Safety (20 points)
  // ========================================

  /**
   * Evaluates logical consistency and safety
   * 
   * Penalty-based: Start at 20, subtract 2 pts per violation
   * 
   * Rules:
   * - required fields must exist in properties
   * - no empty enum arrays
   * - pattern only on string types
   * - minimum <= maximum for numbers
   */
  private evaluateConsistency(schema: any, issues: string[]): number {
    const violations: string[] = [];

    // Check consistency rules
    this.checkRequiredFields(schema, violations);
    this.checkEmptyEnums(schema, violations);
    this.checkPatternMisuse(schema, violations);
    this.checkNumberRanges(schema, violations);

    // Add violations to issues
    violations.forEach(v => issues.push(v));

    // Calculate score: start at 20, subtract 2 per violation
    const score = Math.max(0, 20 - (violations.length * 2));
    return score;
  }

  /**
   * Check that all required fields exist in properties
   */
  private checkRequiredFields(schema: any, violations: string[], path = ''): void {
    if (schema.required && Array.isArray(schema.required)) {
      const properties = schema.properties || {};
      
      for (const requiredField of schema.required) {
        if (!properties[requiredField]) {
          violations.push(`Required field "${path ? path + '.' : ''}${requiredField}" not found in properties`);
        }
      }
    }

    // Recurse into nested objects
    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        const property = prop as SchemaProperty;
        if (property.type === 'object') {
          this.checkRequiredFields(property, violations, path ? `${path}.${key}` : key);
        }
      }
    }
  }

  /**
   * Check for empty enum arrays
   */
  private checkEmptyEnums(schema: any, violations: string[], path = ''): void {
    if (!schema.properties) return;

    for (const [key, prop] of Object.entries(schema.properties)) {
      const property = prop as SchemaProperty;
      const fieldPath = path ? `${path}.${key}` : key;

      if (property.enum && property.enum.length === 0) {
        violations.push(`${fieldPath} has empty enum array`);
      }

      // Recurse
      if (property.type === 'object' && property.properties) {
        this.checkEmptyEnums(property, violations, fieldPath);
      }
    }
  }

  /**
   * Check that pattern is only used on string types
   */
  private checkPatternMisuse(schema: any, violations: string[], path = ''): void {
    if (!schema.properties) return;

    for (const [key, prop] of Object.entries(schema.properties)) {
      const property = prop as SchemaProperty;
      const fieldPath = path ? `${path}.${key}` : key;

      if (property.pattern && property.type !== 'string') {
        violations.push(`${fieldPath} has pattern but is not of type string`);
      }

      // Recurse
      if (property.type === 'object' && property.properties) {
        this.checkPatternMisuse(property, violations, fieldPath);
      }
    }
  }

  /**
   * Check that minimum <= maximum for numbers
   */
  private checkNumberRanges(schema: any, violations: string[], path = ''): void {
    if (!schema.properties) return;

    for (const [key, prop] of Object.entries(schema.properties)) {
      const property = prop as SchemaProperty;
      const fieldPath = path ? `${path}.${key}` : key;

      if (
        (property.type === 'number' || property.type === 'integer') &&
        property.minimum !== undefined &&
        property.maximum !== undefined &&
        property.minimum > property.maximum
      ) {
        violations.push(`${fieldPath} has minimum > maximum`);
      }

      // Recurse
      if (property.type === 'object' && property.properties) {
        this.checkNumberRanges(property, violations, fieldPath);
      }
    }
  }

  // ========================================
  // Dimension 5: AI Improvement Depth (10 points)
  // ========================================

  /**
   * Evaluates the depth of AI improvements
   * 
   * Rules:
   * - Award 1 pt per meaningful change
   * - Cap at 10 points
   * 
   * Meaningful changes:
   * - Added validation rules
   * - Added accessibility metadata
   * - Added descriptions
   * - Enhanced types/formats
   */
  private evaluateImprovement(aiChanges: any[], issues: string[]): number {
    const meaningfulChanges = aiChanges.filter(change => 
      this.isMeaningfulChange(change)
    );

    const score = Math.min(meaningfulChanges.length, 10);

    if (meaningfulChanges.length === 0) {
      issues.push('No meaningful AI improvements detected');
    }

    return score;
  }

  /**
   * Determine if a change is meaningful
   */
  private isMeaningfulChange(change: any): boolean {
    const meaningfulPaths = [
      'pattern',
      'minLength',
      'maxLength',
      'minimum',
      'maximum',
      'minItems',
      'format',
      'description',
      'x-accessibility',
      'title',
      'enum',
    ];

    // Check if the change path includes any meaningful keywords
    const pathLower = change.path?.toLowerCase() || '';
    return meaningfulPaths.some(keyword => pathLower.includes(keyword));
  }
}
