#!/usr/bin/env node
/**
 * designmind CLI. One subcommand per tool, plus `mcp` and `--version`.
 * All local, no key. Exit: 0 ok, 1 error, 2 usage.
 */
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

function usage(): never {
  console.error(`Usage:
  designmind get_principles <context...>
  designmind get_pattern <ui_type>
  designmind get_business_strategy [topic]
  designmind evaluate_design <description...> [--compact]
  designmind search_knowledge <query...>
  designmind get_checklist <ui_type>
  designmind get_d4d_framework [template]
  designmind list_design_systems
  designmind get_design_system <name>
  designmind compose_system <system...> (comma or space separated)
  designmind get_brand_system <brand>
  designmind get_content_system <brand>
  designmind get_content_principles [topic]
  designmind get_content_pattern <pattern_type>
  designmind get_research_method <method_type>
  designmind get_metrics_framework <framework>
  designmind get_service_pattern <pattern>
  designmind get_service_standard
  designmind get_brand_principles [topic]
  designmind get_brand_trends
  designmind mcp
  designmind --version`);
  process.exit(2);
}
function print(v: unknown): void { console.log(typeof v === "string" ? v : JSON.stringify(v, null, 2)); }

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === "--version" || cmd === "-v") { console.log(VERSION); return; }
  if (cmd === "mcp") { await import("./mcp.js"); return; }
  if (!cmd) usage();
  try {
    switch (cmd) {
      case "get_principles": if (!rest[0]) usage(); print(getPrinciples({ context: rest.join(" ") })); break;
      case "get_pattern": if (!rest[0]) usage(); print(getPattern({ ui_type: rest[0] })); break;
      case "get_business_strategy": print(getBusinessStrategy({ topic: rest[0] })); break;
      case "evaluate_design": {
        const compact = rest.includes("--compact");
        const desc = rest.filter((a) => a !== "--compact").join(" ");
        if (!desc) usage();
        print(evaluateDesign({ description: desc, compact })); break;
      }
      case "search_knowledge": if (!rest[0]) usage(); print(searchKnowledge({ query: rest.join(" ") })); break;
      case "get_checklist": if (!rest[0]) usage(); print(getChecklist({ ui_type: rest[0] })); break;
      case "get_d4d_framework": print(getD4dFramework({ template: rest[0] })); break;
      case "list_design_systems": print(listDesignSystems()); break;
      case "get_design_system": if (!rest[0]) usage(); print(getDesignSystem({ name: rest.join(" ") })); break;
      case "compose_system": {
        const sources = rest.join(" ").split(/[,\s]+/).filter(Boolean);
        if (sources.length === 0) usage();
        print(composeSystem({ sources })); break;
      }
      case "get_brand_system": if (!rest[0]) usage(); print(getBrandSystem({ brand: rest[0] })); break;
      case "get_content_system": if (!rest[0]) usage(); print(getContentSystem({ brand: rest[0] })); break;
      case "get_content_principles": print(getContentPrinciples({ topic: rest[0] })); break;
      case "get_content_pattern": if (!rest[0]) usage(); print(getContentPattern({ pattern_type: rest[0] })); break;
      case "get_research_method": if (!rest[0]) usage(); print(getResearchMethod({ method_type: rest.join(" ") })); break;
      case "get_metrics_framework": if (!rest[0]) usage(); print(getMetricsFramework({ framework: rest[0] })); break;
      case "get_service_pattern": if (!rest[0]) usage(); print(getServicePattern({ pattern: rest[0] })); break;
      case "get_service_standard": print(getServiceStandard()); break;
      case "get_brand_principles": print(getBrandPrinciples({ topic: rest[0] })); break;
      case "get_brand_trends": print(getBrandTrends()); break;
      default: usage();
    }
  } catch (err) {
    console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
void main();
