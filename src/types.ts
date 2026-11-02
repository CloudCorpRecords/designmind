/**
 * designmind types.
 *
 * Twenty read-only knowledge lookups over a locally curated design
 * catalogue. Every option type mirrors one MCP tool's arguments.
 * There is no network surface and no credential type: the catalogue
 * ships inside the core module.
 */

export interface GetPrinciplesOptions { context: string }
export interface GetPatternOptions { ui_type: string }
export interface GetBusinessStrategyOptions { topic?: string }
export interface EvaluateDesignOptions { description: string; compact?: boolean }
export interface SearchKnowledgeOptions { query: string }
export interface GetChecklistOptions { ui_type: string }
export interface GetD4dFrameworkOptions { template?: string }
export interface GetDesignSystemOptions { name: string }
export interface ComposeSystemOptions { sources: string[] }
export interface GetBrandSystemOptions { brand: string }
export interface GetContentSystemOptions { brand: string }
export interface GetContentPrinciplesOptions { topic?: string }
export interface GetContentPatternOptions { pattern_type: string }
export interface GetResearchMethodOptions { method_type: string }
export interface GetMetricsFrameworkOptions { framework: string }
export interface GetServicePatternOptions { pattern: string }
export interface GetBrandPrinciplesOptions { topic?: string }

export interface Principle {
  id: string;
  title: string;
  source: string;
  summary: string;
  contexts: string[];
  keywords: string[];
}

export interface DesignSystem {
  name: string;
  summary: string;
  tokens: Record<string, string>;
}

export interface BrandSystem {
  brand: string;
  summary: string;
  values: string[];
  visual: string[];
  doList: string[];
  dontList: string[];
}

export interface ContentSystem {
  brand: string;
  voice: string[];
  toneBySituation: Record<string, string>;
  mechanics: string[];
}
