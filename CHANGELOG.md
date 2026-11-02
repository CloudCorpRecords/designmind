# Changelog

## 0.1.0 (2026-10-26)

- Initial release.
- MCP server (`designmind mcp`, stdio) and CLI with twenty read-only
  knowledge tools over a locally curated design catalogue:
  `get_principles`, `get_pattern`, `get_business_strategy`,
  `evaluate_design`, `search_knowledge`, `get_checklist`,
  `get_d4d_framework`, `list_design_systems`, `get_design_system`,
  `compose_system`, `get_brand_system`, `get_content_system`,
  `get_content_principles`, `get_content_pattern`,
  `get_research_method`, `get_metrics_framework`,
  `get_service_pattern`, `get_service_standard`,
  `get_brand_principles`, and `get_brand_trends`.
- Labelled core subset of the documented 111-tool original:
  audits, grab, the taste engine, the creative studio, the
  decision graph, and generation jobs are intentionally not
  reproduced.
- `evaluate_design` scores a design description against the local
  principles catalogue; it takes no screenshots.
- All local: no network access and no API key.
