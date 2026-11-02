/**
 * designmind MCP server. Labelled 20-tool knowledge core subset.
 *
 * Low-level Server API with explicit inputSchema literals identical
 * to the fixture (the McpServer+zod path injects $schema /
 * additionalProperties and breaks parity). Zod validates call args.
 * All tools are read-only local catalogue lookups: no network, no key.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  composeSystem,
  evaluateDesign,
  getBrandPrinciples,
  getBrandSystem,
  getBrandTrends,
  getBusinessStrategy,
  getChecklist,
  getContentPattern,
  getContentPrinciples,
  getContentSystem,
  getD4dFramework,
  getDesignSystem,
  getMetricsFramework,
  getPattern,
  getPrinciples,
  getResearchMethod,
  getServicePattern,
  getServiceStandard,
  listDesignSystems,
  searchKnowledge,
  VERSION,
} from "./designmind.js";

const ContextArgs = z.object({ context: z.string() });
const UiTypeArgs = z.object({ ui_type: z.string() });
const TopicArgs = z.object({ topic: z.string().optional() });
const EvaluateArgs = z.object({ description: z.string(), compact: z.boolean().optional() });
const QueryArgs = z.object({ query: z.string() });
const TemplateArgs = z.object({ template: z.string().optional() });
const EmptyArgs = z.object({});
const NameArgs = z.object({ name: z.string() });
const ComposeArgs = z.object({ sources: z.array(z.string()) });
const BrandArgs = z.object({ brand: z.string() });
const PatternTypeArgs = z.object({ pattern_type: z.string() });
const MethodArgs = z.object({ method_type: z.string() });
const FrameworkArgs = z.object({ framework: z.string() });
const PatternArgs = z.object({ pattern: z.string() });

const TOOLS = [
  { name: "get_principles", description: "Get design principles relevant to a context.", inputSchema: { type: "object" as const, properties: { context: { type: "string", description: "Design context to match principles against, such as forms, navigation, or accessibility." } }, required: ["context"] } },
  { name: "get_pattern", description: "Get UI pattern guidance for a UI type.", inputSchema: { type: "object" as const, properties: { ui_type: { type: "string", description: "UI type to look up: dashboard, form, navigation, onboarding, search, checkout, empty-state, modal, table, or settings." } }, required: ["ui_type"] } },
  { name: "get_business_strategy", description: "Get business strategy guidance, optionally for a topic.", inputSchema: { type: "object" as const, properties: { topic: { type: "string", description: "Strategy topic: positioning, pricing, growth, retention, or trust; omit to list all topics." } } } },
  { name: "evaluate_design", description: "Evaluate a design description against the local principles catalogue: scores plus matching principles and violations.", inputSchema: { type: "object" as const, properties: { description: { type: "string", description: "Design description text to evaluate against the principles catalogue." }, compact: { type: "boolean", description: "Whether to return only the overall score, grade, and per-dimension scores." } }, required: ["description"] } },
  { name: "search_knowledge", description: "Search the local design knowledge catalogue.", inputSchema: { type: "object" as const, properties: { query: { type: "string", description: "Search query text." } }, required: ["query"] } },
  { name: "get_checklist", description: "Get a design checklist for a UI type.", inputSchema: { type: "object" as const, properties: { ui_type: { type: "string", description: "UI type to look up: form, dashboard, checkout, landing-page, navigation, onboarding, mobile, or accessibility." } }, required: ["ui_type"] } },
  { name: "get_d4d_framework", description: "Get the D4D (Discover, Define, Develop, Deliver) framework, optionally one template.", inputSchema: { type: "object" as const, properties: { template: { type: "string", description: "D4D template: standard, sprint, workshop, or audit; omit for the framework overview." } } } },
  { name: "list_design_systems", description: "List the design systems in the local catalogue.", inputSchema: { type: "object" as const, properties: {} } },
  { name: "get_design_system", description: "Get one design system and its token set by name.", inputSchema: { type: "object" as const, properties: { name: { type: "string", description: "Design system name: material, carbon, polaris, atlassian, or govuk." } }, required: ["name"] } },
  { name: "compose_system", description: "Merge token sets from catalogue design systems; later sources win on conflicts and conflicts are listed.", inputSchema: { type: "object" as const, properties: { sources: { type: "array", items: { type: "string" }, description: "Names of design systems to merge, in order; later sources win on token conflicts." } }, required: ["sources"] } },
  { name: "get_brand_system", description: "Get the brand system for a named brand in the catalogue.", inputSchema: { type: "object" as const, properties: { brand: { type: "string", description: "Brand name: govuk, polaris, atlassian, or conversational." } }, required: ["brand"] } },
  { name: "get_content_system", description: "Get the content (voice and tone) system for a named brand in the catalogue.", inputSchema: { type: "object" as const, properties: { brand: { type: "string", description: "Brand name: govuk, polaris, atlassian, or conversational." } }, required: ["brand"] } },
  { name: "get_content_principles", description: "Get content design principles, optionally for a topic.", inputSchema: { type: "object" as const, properties: { topic: { type: "string", description: "Content topic: clarity, voice, structure, accessibility, or errors; omit to return all principles." } } } },
  { name: "get_content_pattern", description: "Get a content pattern by pattern type.", inputSchema: { type: "object" as const, properties: { pattern_type: { type: "string", description: "Content pattern type: error-message, empty-state, confirmation, onboarding, help-text, notification, or form-labels." } }, required: ["pattern_type"] } },
  { name: "get_research_method", description: "Get a UX research method by method type.", inputSchema: { type: "object" as const, properties: { method_type: { type: "string", description: "Research method type: interview, usability-test, survey, diary-study, card-sort, a-b-test, or heuristic-evaluation." } }, required: ["method_type"] } },
  { name: "get_metrics_framework", description: "Get a product metrics framework by name.", inputSchema: { type: "object" as const, properties: { framework: { type: "string", description: "Metrics framework name: heart, aarrr, north-star, rice, or okr." } }, required: ["framework"] } },
  { name: "get_service_pattern", description: "Get a service design pattern by name.", inputSchema: { type: "object" as const, properties: { pattern: { type: "string", description: "Service pattern name: start-page, check-eligibility, collect-information, check-answers, pay, confirmation, or status-tracking." } }, required: ["pattern"] } },
  { name: "get_service_standard", description: "Get the GOV.UK Service Standard (14 points).", inputSchema: { type: "object" as const, properties: {} } },
  { name: "get_brand_principles", description: "Get brand principles, optionally for a topic.", inputSchema: { type: "object" as const, properties: { topic: { type: "string", description: "Brand topic: distinctiveness, voice, positioning, or governance; omit to return all principles." } } } },
  { name: "get_brand_trends", description: "Get current brand design trends from the local catalogue.", inputSchema: { type: "object" as const, properties: {} } },
];

function textResult(value: unknown) {
  return { content: [{ type: "text" as const, text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] };
}
function errorResult(err: unknown) {
  return { content: [{ type: "text" as const, text: err instanceof Error ? err.message : String(err) }], isError: true };
}

const server = new Server({ name: "designmind", version: VERSION }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case "get_principles": return textResult(getPrinciples(ContextArgs.parse(args ?? {})));
      case "get_pattern": return textResult(getPattern(UiTypeArgs.parse(args ?? {})));
      case "get_business_strategy": return textResult(getBusinessStrategy(TopicArgs.parse(args ?? {})));
      case "evaluate_design": return textResult(evaluateDesign(EvaluateArgs.parse(args ?? {})));
      case "search_knowledge": return textResult(searchKnowledge(QueryArgs.parse(args ?? {})));
      case "get_checklist": return textResult(getChecklist(UiTypeArgs.parse(args ?? {})));
      case "get_d4d_framework": return textResult(getD4dFramework(TemplateArgs.parse(args ?? {})));
      case "list_design_systems": EmptyArgs.parse(args ?? {}); return textResult(listDesignSystems());
      case "get_design_system": return textResult(getDesignSystem(NameArgs.parse(args ?? {})));
      case "compose_system": return textResult(composeSystem(ComposeArgs.parse(args ?? {})));
      case "get_brand_system": return textResult(getBrandSystem(BrandArgs.parse(args ?? {})));
      case "get_content_system": return textResult(getContentSystem(BrandArgs.parse(args ?? {})));
      case "get_content_principles": return textResult(getContentPrinciples(TopicArgs.parse(args ?? {})));
      case "get_content_pattern": return textResult(getContentPattern(PatternTypeArgs.parse(args ?? {})));
      case "get_research_method": return textResult(getResearchMethod(MethodArgs.parse(args ?? {})));
      case "get_metrics_framework": return textResult(getMetricsFramework(FrameworkArgs.parse(args ?? {})));
      case "get_service_pattern": return textResult(getServicePattern(PatternArgs.parse(args ?? {})));
      case "get_service_standard": EmptyArgs.parse(args ?? {}); return textResult(getServiceStandard());
      case "get_brand_principles": return textResult(getBrandPrinciples(TopicArgs.parse(args ?? {})));
      case "get_brand_trends": EmptyArgs.parse(args ?? {}); return textResult(getBrandTrends());
    }
  } catch (err) {
    return errorResult(err);
  }
  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
});

async function main(): Promise<void> {
  await server.connect(new StdioServerTransport());
}
void main();
