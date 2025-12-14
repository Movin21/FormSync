/**
 * Schema Enhancement Engine Service
 * 
 * This service encapsulates domain-specific schema intelligence including:
 * - Validation normalization
 * - Accessibility enrichment
 * - Invariant protection
 * - Quality scoring
 * - Explainability
 * 
 * Design Decision:
 * The underlying LLM plugin (e.g., OpenAI) handles model communication,
 * while this service provides reusable, explainable schema reasoning.
 * This separation ensures the AI logic is portable across different LLM providers.
 */

import { Injectable } from '@nestjs/common';
import { OpenAILLMPlugin } from '../plugins/llm/openai-llm.plugin';
import { EnhancementOptions } from '@formsync/plugins';

export interface SchemaEnhancementEngineResult {
  enhancedSchema: any;
  explanations: Array<{
    path: string;
    action: string;
    reason: string;
  }>;
  qualityScore: number;
  warnings?: string[];
  model?: string;
  tokensUsed?: number;
}

@Injectable()
export class SchemaEnhancerService {
  constructor(
    private readonly llmPlugin: OpenAILLMPlugin
  ) {}

  /**
   * Enhance a JSON Schema using AI with explainability and quality metrics
   */
  async enhanceSchema(
    schema: any,
    options?: EnhancementOptions
  ): Promise<SchemaEnhancementEngineResult> {

    // Delegate to LLM provider for raw AI enhancement
    const result = await this.llmPlugin.enhanceSchema(schema, options);

    if (!result.success) {
      throw new Error(
        result.errors?.join(', ') || 'Schema enhancement failed'
      );
    }

    // Apply domain-specific intelligence layers
    const explanations = this.mapChangesToExplanations(result.changes || []);
    const qualityScore = this.calculateQualityScore(
      result.enhancedSchema,
      explanations
    );

    return {
      enhancedSchema: result.enhancedSchema,
      explanations,
      qualityScore,
      model: result.model,
      tokensUsed: result.tokensUsed,
    };
  }

  // -------------------------------
  // Explainability Layer
  // -------------------------------

  /**
   * Transform raw AI changes into human-readable explanations
   * This provides transparency into what the AI modified and why
   */
  private mapChangesToExplanations(changes: any[]) {
    return changes.map(change => ({
      path: change.path,
      action: change.changeType ?? 'modified',
      reason: change.reason ?? 'AI-based schema normalization',
    }));
  }

  // -------------------------------
  // Quality Scoring Layer
  // -------------------------------

  /**
   * Calculate a quality score for the enhanced schema
   * Considers: structure completeness, accessibility coverage, explanation depth
   */
  private calculateQualityScore(schema: any, explanations: any[]): number {
    let score = 100;

    // Penalize missing core structure
    if (!schema?.properties) score -= 30;
    
    // Penalize lack of AI improvements
    if (explanations.length === 0) score -= 20;

    // Accessibility heuristic - encourage inclusive design
    const accessibilityCoverage = this.countAccessibility(schema);
    if (accessibilityCoverage < 0.5) score -= 15;

    return Math.max(score, 0);
  }

  /**
   * Calculate the percentage of schema properties with accessibility metadata
   * Higher values indicate better screen reader and assistive technology support
   */
  private countAccessibility(schema: any): number {
    let total = 0;
    let covered = 0;

    const walk = (obj: any) => {
      if (!obj?.properties) return;
      for (const prop of Object.values(obj.properties)) {
        total++;
        if ((prop as any)['x-accessibility']) covered++;
        if ((prop as any).type === 'object') walk(prop);
      }
    };

    walk(schema);
    return total === 0 ? 1 : covered / total;
  }
}
