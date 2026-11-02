# designmind

Local design knowledge as an MCP server and CLI: principles, UI
patterns, checklists, design-system tokens, brand and content
systems, research methods, metrics frameworks, and the GOV.UK
Service Standard — all served from a curated catalogue that ships
with the package. No network, no API key, no state.

designmind is a labelled core subset (20 tools) rebuilt from the
public tool spec of a 111-tool design-knowledge server. The tools
that audit live sites, grab assets, run a taste engine or a
creative studio, maintain a decision graph, or run generation
jobs are intentionally not reproduced; what is here is the
read-only knowledge core.

## What the catalogue contains

Original prose written for this rebuild, covering:

- **Principles** — Nielsen's ten heuristics, Laws of UX (Fitts,
  Hick, Jakob, Miller, Doherty, Von Restorff, Peak-End), Gestalt
  principles, WCAG AA basics (contrast, focus, labels, not colour
  alone), and typography, colour-role and spacing-scale rules.
- **UI patterns and checklists** — dashboards, forms, navigation,
  onboarding, search, checkout, empty states, modals, tables and
  settings, each with guidance and pitfalls.
- **Design systems** — token sets for Material, Carbon, Polaris,
  Atlassian and GOV.UK, which can be merged with `compose_system`
  (later sources win; every conflict is listed, never hidden).
- **Brand and content systems** — brand guidance plus voice and
  tone systems for GOV.UK, Polaris, Atlassian and conversational
  UI, content principles, and content patterns (error messages,
  empty states, confirmations, help text, notifications, labels).
- **Strategy and methods** — business strategy topics, the D4D
  (Discover, Define, Develop, Deliver) framework with templates,
  research methods, HEART / AARRR / North Star / RICE / OKR, and
  service patterns with the 14-point GOV.UK Service Standard.

Coverage differs from the original server's catalogue — this is a
fresh local curation, not a copy of its content.

## Install and run

```bash
npx -y @reneturcios/designmind mcp        # stdio MCP server
npx -y @reneturcios/designmind get_pattern form
docker run -i ghcr.io/cloudcorprecords/designmind          # MCP via container
docker run --rm ghcr.io/cloudcorprecords/designmind get_checklist form
```

MCP client config:

```json
{
  "mcpServers": {
    "designmind": {
      "command": "npx",
      "args": ["-y", "@reneturcios/designmind", "mcp"]
    }
  }
}
```

## Tools

| Tool | Arguments | Purpose |
| --- | --- | --- |
| `get_principles` | `context` | Principles relevant to a context |
| `get_pattern` | `ui_type` | UI pattern guidance |
| `get_business_strategy` | `topic?` | Business strategy guidance |
| `evaluate_design` | `description`, `compact?` | Score a design description against the principles catalogue — scores, matching principles and violations; no screenshots |
| `search_knowledge` | `query` | Search the whole catalogue |
| `get_checklist` | `ui_type` | A pre-ship checklist |
| `get_d4d_framework` | `template?` | Discover / Define / Develop / Deliver |
| `list_design_systems` | — | Catalogue design systems |
| `get_design_system` | `name` | One system's token set |
| `compose_system` | `sources[]` | Merge token sets; later wins, conflicts listed |
| `get_brand_system` | `brand` | Brand guidance for a named brand |
| `get_content_system` | `brand` | Voice and tone system for a named brand |
| `get_content_principles` | `topic?` | Content design principles |
| `get_content_pattern` | `pattern_type` | A content pattern (errors, empty states, …) |
| `get_research_method` | `method_type` | A UX research method, with steps |
| `get_metrics_framework` | `framework` | HEART, AARRR, North Star, RICE or OKR |
| `get_service_pattern` | `pattern` | A service design pattern |
| `get_service_standard` | — | The GOV.UK Service Standard, 14 points |
| `get_brand_principles` | `topic?` | Brand principles |
| `get_brand_trends` | — | Curated brand design trends |

Unknown names (a system, brand, framework, pattern…) return an
error listing the names that do exist, rather than a guess. The
CLI exposes the same twenty operations as subcommands; run
`designmind` with no arguments for the full usage list.

## Development

```bash
npm install
npm run build   # tsc -> dist/
npm test        # node test runner, local only
npm run dev     # run the CLI from source
```

## License

MIT — Copyright (c) 2026 Rene Turcios.
