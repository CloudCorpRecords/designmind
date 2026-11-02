# BUILD-REPORT — designmind (original: rhinocap/raven-mcp, rank 105, 7 stars)

Built 2026-10-26 for the MCP Rebuild 100 program, Tranche Batch 3,
labelled knowledge core subset. Local only; nothing pushed or
published.

## Identity

- npm: `@reneturcios/designmind`, bin `designmind`, version 0.1.0
- Registry name: `io.github.CloudCorpRecords/designmind`
  (matches package.json `mcpName`, server.json `name`, and the
  Dockerfile `io.modelcontextprotocol.server.name` label)
- server.json description: 81 chars (≤100, counted)
- server.json OCI package entry: no `version` field (version only
  in the tagged identifier `ghcr.io/cloudcorprecords/designmind:0.1.0`)

## Subset scope

The original documents 111 local tools. This rebuild implements a
LABELLED 20-tool core subset — all read-only knowledge lookups —
defined by the fixture
`harness/fixtures/raven-mcp-tools-original.json`, whose `_source`
records the subset and the omissions:

Implemented (20): `get_principles`, `get_pattern`,
`get_business_strategy`, `evaluate_design`, `search_knowledge`,
`get_checklist`, `get_d4d_framework`, `list_design_systems`,
`get_design_system`, `compose_system`, `get_brand_system`,
`get_content_system`, `get_content_principles`,
`get_content_pattern`, `get_research_method`,
`get_metrics_framework`, `get_service_pattern`,
`get_service_standard`, `get_brand_principles`, `get_brand_trends`.

Omitted (listed in the fixture `_source`, not reproduced):
audits, grab, the taste engine, the creative studio, the decision
graph, generation jobs, and every other documented tool outside
the 20 above.

`evaluate_design` evaluates a design DESCRIPTION against the
local principles catalogue — per-dimension scores (accessibility,
hierarchy, consistency, feedback, simplicity), matching
principles, violations and suggestions. It takes no screenshots
and renders no judgement about a visual design beyond what the
description states; that limitation is stated in its output.

`compose_system{sources}` merges token sets from the catalogue in
order; later sources win on conflicts, and every conflict is
listed with per-source values, the winner, and the resolved value.

Content is a locally curated catalogue written fresh for this
rebuild: 28 principles (Nielsen heuristics, Laws of UX, Gestalt,
WCAG basics, typography / colour / spacing rules), 10 UI patterns,
8 checklists, 5 design-system token sets (material, carbon,
polaris, atlassian, govuk), 4 brand systems and 4 content (voice)
systems (GOV.UK, Polaris, Atlassian, conversational), content
principles and patterns, 7 research methods, 5 metrics frameworks
(HEART, AARRR, North Star, RICE, OKR), 7 service patterns, the
GOV.UK Service Standard's 14 points, 5 business-strategy topics,
the D4D framework with 4 templates, brand principles and trends.
**Catalogue coverage will differ from the original's** — different
breadth, different wording; this is a fresh curation, not a copy.

Schemas are documented reconstructions: the original's README
gives tool names and one-line purposes, not wire schemas. The
fixture is labelled accordingly ("docs-derived core subset").

Registered via the low-level MCP `Server` API with explicit
inputSchema literals identical to the fixture; zod validates call
arguments. All local: no network, no key, no state.

## Verification (all foreground, verified from disk/output)

- Factory set: 19/19 required files present on disk (package.json,
  server.json, Dockerfile, tsconfig.json, .gitignore,
  package-lock.json, README.md, LICENSE, CHANGELOG.md,
  src/{index,cli,mcp,types,designmind}.ts, test/designmind.test.ts,
  .github/workflows/{ci,publish,publish-container,registry-publish}.yml)
- tsc: `npm run build` exit 0; `dist/cli.js` present;
  `node dist/cli.js --version` → `0.1.0`; no-args and unknown
  command print Usage and exit 2
- Tests: 30/30 pass (`npm test`, local only — catalogue matching
  and fallbacks, pattern/checklist hits and unknown-name errors,
  strategy/D4D, system aliases, compose merge/winner/conflict
  listing, brand/content resolution, research/metrics/service
  lookups, the 14-point service standard, evaluate scoring order
  and compact mode, cross-kind search)
- Parity: fixture `harness/fixtures/raven-mcp-tools-original.json`
  vs live stdio rebuild via `harness/parity.py` →
  `parity_pct == 100.0`, identical 20/20, verdict PASS, output in
  `parity-out/parity.json`
- Live stdio smoke: `initialize` returned
  `serverInfo {name: designmind, version: 0.1.0}`; a
  `tools/call evaluate_design` returned score 71 / grade "good"
  with 1 violation; a `tools/call get_design_system` with an
  unknown name returned `isError: true` naming the available systems
- Lockfile: CLEAN Route 3 — generated in a temp copy with no
  `node_modules` via `npm install --package-lock-only
  --ignore-scripts --offline`; verified parses, name
  `@reneturcios/designmind`, version 0.1.0, lockfileVersion 3,
  128 package entries; only the lockfile was copied back. Local
  build/test used a sibling's `node_modules` copy, which is not
  part of the shipped tree.

## Honest gaps

- Parity is against the labelled 20-tool subset fixture only;
  the other 91 documented tools of the original are out of scope
  by design and are not claimed.
- Catalogue coverage differs from the original's (see Subset
  scope): named-system token sets are representative values for
  five systems, brand/content systems cover four brands, and
  trend content is an editorial snapshot, not live data.
- `evaluate_design` is a text heuristic over the description, not
  a design audit; its output says so.
- No live upstream exists for this tool (fully local), so there
  is no upstream-drift surface; behaviour is proven by the local
  test suite and the stdio smoke above.
- mcpaudit / mcpvet / shipcheck pre-publish gate not run (belongs
  to the publish wave, per SCOREBOARD).
