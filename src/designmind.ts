/**
 * designmind core: twenty read-only knowledge lookups over a locally
 * curated design catalogue, written fresh for this rebuild.
 *
 * The catalogue covers Nielsen's heuristics, the Laws of UX, the
 * Gestalt principles, WCAG basics, and typography / colour / spacing
 * rules; UI patterns and checklists; design-system token sets for a
 * few named systems; brand systems; content (voice) systems in the
 * spirit of GOV.UK, Polaris, Atlassian and conversational UI; the
 * HEART, AARRR, North Star, RICE and OKR metrics frameworks; and
 * the GOV.UK Service Standard's 14 points.
 *
 * Coverage note: this catalogue is an original local curation. It
 * will differ in breadth and wording from the original server's
 * catalogue; see BUILD-REPORT.md. Labelled core subset: audits,
 * grab, the taste engine, the creative studio, the decision graph
 * and generation jobs are not reproduced.
 *
 * Everything is local: no network, no key, no state. Lookups are
 * deterministic; unknown named entries raise an error listing the
 * names that do exist, rather than guessing.
 */
import type {
  BrandSystem,
  ComposeSystemOptions,
  ContentSystem,
  DesignSystem,
  EvaluateDesignOptions,
  GetBrandPrinciplesOptions,
  GetBrandSystemOptions,
  GetBusinessStrategyOptions,
  GetChecklistOptions,
  GetContentPatternOptions,
  GetContentPrinciplesOptions,
  GetContentSystemOptions,
  GetD4dFrameworkOptions,
  GetDesignSystemOptions,
  GetMetricsFrameworkOptions,
  GetPatternOptions,
  GetPrinciplesOptions,
  GetResearchMethodOptions,
  GetServicePatternOptions,
  Principle,
  SearchKnowledgeOptions,
} from "./types.js";

export const VERSION = "0.1.0";

function norm(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function keyOf(value: unknown): string {
  return norm(value).replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
}
function requireString(value: unknown, name: string): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) throw new Error(`${name} must be a non-empty string`);
  return v;
}
function words(text: string): string[] {
  return norm(text).split(/[^a-z0-9]+/).filter(Boolean);
}

/* ---------------- principles catalogue ---------------- */

export const PRINCIPLES: Principle[] = [
  { id: "visibility-of-status", title: "Visibility of system status", source: "Nielsen heuristics", summary: "Keep people informed about what is happening, through timely and appropriate feedback, so they never have to guess whether an action worked.", contexts: ["forms", "loading", "feedback", "dashboards"], keywords: ["status", "feedback", "loading", "progress", "visibility"] },
  { id: "match-real-world", title: "Match between system and the real world", source: "Nielsen heuristics", summary: "Speak the user's language and follow real-world conventions, so information appears in a natural, logical order.", contexts: ["content", "navigation", "onboarding"], keywords: ["language", "plain", "conventions", "familiar"] },
  { id: "user-control", title: "User control and freedom", source: "Nielsen heuristics", summary: "People choose the wrong thing by accident. Provide a clear emergency exit — undo, cancel, back — without an extended dialogue.", contexts: ["forms", "flows", "editing"], keywords: ["undo", "cancel", "exit", "back", "control"] },
  { id: "consistency", title: "Consistency and standards", source: "Nielsen heuristics", summary: "The same words, actions and components should mean the same thing everywhere, and platform conventions should be followed.", contexts: ["design systems", "navigation", "components"], keywords: ["consistent", "consistency", "standards", "design system", "token"] },
  { id: "error-prevention", title: "Error prevention", source: "Nielsen heuristics", summary: "Better than any error message: stop the error happening — constrain inputs, confirm destructive actions, and check before committing.", contexts: ["forms", "checkout", "destructive actions"], keywords: ["error", "prevention", "validation", "confirm"] },
  { id: "recognition", title: "Recognition rather than recall", source: "Nielsen heuristics", summary: "Make objects, actions and options visible so people do not have to remember information from one part of the interface to another.", contexts: ["navigation", "search", "dashboards"], keywords: ["recognition", "recall", "memory", "visible"] },
  { id: "flexibility", title: "Flexibility and efficiency of use", source: "Nielsen heuristics", summary: "Accelerators — shortcuts, recent items, personalisation — let experienced users move fast without penalising beginners.", contexts: ["productivity", "dashboards", "power users"], keywords: ["shortcut", "efficiency", "accelerator", "keyboard"] },
  { id: "aesthetic-minimalist", title: "Aesthetic and minimalist design", source: "Nielsen heuristics", summary: "Interfaces should not contain irrelevant or rarely needed information; every extra unit competes with what matters.", contexts: ["landing pages", "mobile", "content"], keywords: ["minimal", "simple", "clutter", "focus"] },
  { id: "error-recovery", title: "Help users recognise, diagnose and recover from errors", source: "Nielsen heuristics", summary: "Error messages should be in plain language, name the problem precisely, and suggest a constructive next step.", contexts: ["forms", "errors", "checkout"], keywords: ["error", "message", "recovery", "help"] },
  { id: "help-documentation", title: "Help and documentation", source: "Nielsen heuristics", summary: "When help is needed it should be easy to find, focused on the task at hand, and short enough to act on.", contexts: ["support", "onboarding", "complex tasks"], keywords: ["help", "documentation", "guidance", "support"] },
  { id: "fitts-law", title: "Fitts's Law", source: "Laws of UX", summary: "The time to reach a target depends on its distance and size: make important targets large and close to where the user already is.", contexts: ["mobile", "buttons", "touch"], keywords: ["target", "size", "touch", "tap", "distance"] },
  { id: "hicks-law", title: "Hick's Law", source: "Laws of UX", summary: "Decision time grows with the number and complexity of choices. Break long decisions into steps and highlight the recommended option.", contexts: ["navigation", "pricing", "settings"], keywords: ["choice", "options", "decision", "overload"] },
  { id: "jakobs-law", title: "Jakob's Law", source: "Laws of UX", summary: "People spend most of their time in other products, so they expect yours to work the same way. Prefer familiar patterns over novelty.", contexts: ["navigation", "ecommerce", "patterns"], keywords: ["familiar", "conventions", "expectation", "pattern"] },
  { id: "millers-law", title: "Miller's Law", source: "Laws of UX", summary: "Working memory holds only a handful of chunks. Group information into meaningful chunks instead of long undifferentiated lists.", contexts: ["forms", "content", "dashboards"], keywords: ["chunking", "grouping", "memory", "list"] },
  { id: "doherty-threshold", title: "Doherty Threshold", source: "Laws of UX", summary: "Productivity soars when system response stays under roughly 400 ms; beyond that, show progress and keep the user oriented.", contexts: ["performance", "feedback", "loading"], keywords: ["speed", "response", "performance", "latency"] },
  { id: "von-restorff", title: "Von Restorff Effect", source: "Laws of UX", summary: "The one item that stands out is the one that gets remembered. Make the primary action visually distinct — and only that one.", contexts: ["calls to action", "pricing", "landing pages"], keywords: ["emphasis", "primary action", "highlight", "distinct"] },
  { id: "peak-end", title: "Peak-End Rule", source: "Laws of UX", summary: "People judge an experience mostly by its peak moment and its end. Design the confirmation and the goodbye as carefully as the start.", contexts: ["onboarding", "checkout", "flows"], keywords: ["peak", "end", "confirmation", "delight"] },
  { id: "gestalt-proximity", title: "Proximity", source: "Gestalt principles", summary: "Elements placed near each other are perceived as a group. Use spacing — not boxes and lines — as the primary grouping device.", contexts: ["layout", "forms", "spacing"], keywords: ["grouping", "spacing", "proximity", "layout"] },
  { id: "gestalt-similarity", title: "Similarity", source: "Gestalt principles", summary: "Elements that look alike are read as related and as doing the same thing. Keep one visual style per role.", contexts: ["components", "layout", "design systems"], keywords: ["similarity", "style", "grouping", "components"] },
  { id: "gestalt-figure-ground", title: "Figure and ground", source: "Gestalt principles", summary: "People separate what they see into a figure and its background. Modals, cards and overlays must make that separation unmistakable.", contexts: ["modals", "overlays", "layout"], keywords: ["contrast", "modal", "overlay", "background"] },
  { id: "gestalt-continuity", title: "Continuity", source: "Gestalt principles", summary: "The eye follows lines and alignments. Align elements on a shared grid so scanning paths feel effortless.", contexts: ["layout", "typography", "grids"], keywords: ["alignment", "grid", "continuity", "scanning"] },
  { id: "wcag-contrast", title: "Sufficient colour contrast", source: "WCAG basics", summary: "Normal text needs a contrast ratio of at least 4.5:1 against its background (3:1 for large text) to meet WCAG AA.", contexts: ["accessibility", "colour", "typography"], keywords: ["contrast", "wcag", "accessibility", "colour", "color"] },
  { id: "wcag-focus", title: "Visible focus and keyboard order", source: "WCAG basics", summary: "Everything operable by pointer must be operable by keyboard, in a logical order, with a focus indicator that is always visible.", contexts: ["accessibility", "forms", "navigation"], keywords: ["keyboard", "focus", "wcag", "accessibility", "tab"] },
  { id: "wcag-not-colour-alone", title: "Do not rely on colour alone", source: "WCAG basics", summary: "Colour must never be the only way information is conveyed; pair it with text, iconography or pattern so meaning survives colour-vision differences.", contexts: ["accessibility", "charts", "status"], keywords: ["colour", "color", "accessibility", "charts", "status"] },
  { id: "wcag-labels", title: "Labels, names and instructions", source: "WCAG basics", summary: "Every control needs a programmatic label that matches its visible label, and instructions must not depend on shape, size or position alone.", contexts: ["accessibility", "forms"], keywords: ["label", "aria", "screen reader", "accessibility", "instructions"] },
  { id: "type-scale", title: "A deliberate type scale", source: "Typography rules", summary: "Pick a small set of sizes on a consistent ratio, a line height of roughly 1.4–1.6 for body text, and a line length of about 45–75 characters.", contexts: ["typography", "content", "layout"], keywords: ["typography", "type scale", "font", "readability", "line height"] },
  { id: "colour-roles", title: "Colour by role, not by taste", source: "Colour rules", summary: "Define colours by the job they do — surface, text, interactive, success, warning, danger — and reuse the role everywhere instead of inventing shades per screen.", contexts: ["colour", "design systems", "branding"], keywords: ["colour", "color", "palette", "token", "role"] },
  { id: "spacing-scale", title: "One spacing scale", source: "Spacing rules", summary: "Space elements on a single base scale (commonly 4 px or 8 px multiples). Related things sit closer; unrelated things get visibly more air.", contexts: ["spacing", "layout", "design systems"], keywords: ["spacing", "scale", "layout", "margin", "padding"] },
];

export function getPrinciples(opts: GetPrinciplesOptions) {
  const context = requireString(opts?.context, "context");
  const ctxWords = new Set(words(context));
  const scored = PRINCIPLES.map((p) => {
    const hay = new Set([...words(p.title), ...p.keywords.flatMap((k) => words(k)), ...p.contexts.flatMap((c) => words(c))]);
    let score = 0;
    for (const w of ctxWords) if (hay.has(w)) score++;
    return { p, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  if (scored.length === 0) {
    return { context, matched: false, count: PRINCIPLES.length, principles: PRINCIPLES, note: "No principle matched that context specifically; returning the full catalogue." };
  }
  return { context, matched: true, count: scored.length, principles: scored.map((x) => x.p) };
}

/* ---------------- UI patterns & checklists ---------------- */

const PATTERNS: Record<string, { ui_type: string; summary: string; guidance: string[]; pitfalls: string[] }> = {
  dashboard: { ui_type: "dashboard", summary: "An at-a-glance operational view: the few numbers that matter, their trend, and a path to detail.", guidance: ["Lead with the 3–5 metrics the user acts on, each with a comparison period", "Put detail one click away, never all on the first screen", "Keep one time range control that governs the whole page", "Use recognition over recall: label everything, hide nothing behind hover alone"], pitfalls: ["Chartjunk and gauges that show precision nobody needs", "Every metric given equal visual weight"] },
  form: { ui_type: "form", summary: "A single-column sequence of labelled fields, one idea per step when the form is long.", guidance: ["One column, labels above fields, visible at all times", "Ask only for what the service genuinely needs, in the order users think about it", "Validate on submit and inline after correction; place the error summary at the top with links to fields", "Mark required clearly and explain why unusual information is requested"], pitfalls: ["Placeholder text used as the only label", "Clearing the user's input when validation fails"] },
  navigation: { ui_type: "navigation", summary: "A stable map of the product: few top-level destinations, named as users name them.", guidance: ["Keep top-level items to the handful users can hold in mind; group the rest", "Current location must always be identifiable", "Order items by user frequency, not by org chart", "Search complements navigation; it never replaces it"], pitfalls: ["Novel navigation invented for branding reasons (Jakob's Law)", "Labels written in internal jargon"] },
  onboarding: { ui_type: "onboarding", summary: "Get the user to one real success as fast as possible, teaching only what that success needs.", guidance: ["One clear first win, reachable in the first session", "Defer account and profile detail until the value is proven", "Use progressive disclosure: advanced options appear after basics work", "End with a confirmation that names what happened and what is next (Peak-End Rule)"], pitfalls: ["A tour of every feature before any value", "Empty states with no action"] },
  search: { ui_type: "search", summary: "A forgiving query box with fast, scannable results and honest empty states.", guidance: ["Accept synonyms, typos and partial terms; show recent and suggested queries", "Results show title, a snippet with the matched terms, and key metadata", "Zero results is a designed state: suggest corrections and broader terms", "Filters show counts and can be cleared in one action"], pitfalls: ["Dead-end 'no results' pages", "Hiding the query so users cannot refine it"] },
  checkout: { ui_type: "checkout", summary: "A short, predictable payment flow with total costs up front and no surprises at the end.", guidance: ["Show the full price, including fees, before the final step", "Guest checkout first; account creation after purchase", "One primary action per step, with order progress visible", "Confirm with an order reference and what happens next"], pitfalls: ["Surprise costs revealed on the last screen", "Forced account creation mid-flow"] },
  "empty-state": { ui_type: "empty-state", summary: "A first-run or no-data view that explains the space and offers the action that fills it.", guidance: ["Say what will appear here and why it is useful", "Offer exactly one primary action that creates the first item", "Distinguish 'nothing yet' from 'nothing matched' from 'something broke'"], pitfalls: ["A blank panel with no explanation", "Marketing copy where an instruction belongs"] },
  modal: { ui_type: "modal", summary: "A focused interruption for one decision, used sparingly and always escapable.", guidance: ["Reserve modals for decisions that cannot wait or that need isolation", "Title states the decision; the destructive action is named, not 'OK'", "Escape and close are always available; focus is trapped and returned on close"], pitfalls: ["Modals stacked on modals", "Using a modal for content that deserves a page"] },
  table: { ui_type: "table", summary: "Dense comparable data: aligned columns, sortable headers, and numbers right-aligned.", guidance: ["Right-align numbers, left-align text; keep units in the header", "Sorting state is visible; defaults match the common question", "Row actions appear in a consistent place and survive keyboard navigation", "On small screens, prioritise columns rather than squeezing all of them"], pitfalls: ["Centre-aligned numeric columns", "Horizontal scrolling for primary content"] },
  settings: { ui_type: "settings", summary: "Grouped, searchable preferences that take effect immediately or say plainly when they do not.", guidance: ["Group by user intent, not by engineering subsystem", "Show the current value before the control to change it", "Dangerous settings get plain-language consequences and confirmation", "Defaults should be the safe, common choice"], pitfalls: ["Settings that silently do nothing until a hidden save", "Double negatives in toggle labels"] },
};

export function getPattern(opts: GetPatternOptions) {
  const uiType = requireString(opts?.ui_type, "ui_type");
  const entry = PATTERNS[keyOf(uiType)];
  if (!entry) throw new Error(`Unknown ui_type "${uiType}". Available: ${Object.keys(PATTERNS).join(", ")}`);
  return entry;
}

const CHECKLISTS: Record<string, { ui_type: string; items: string[] }> = {
  form: { ui_type: "form", items: ["Every field has a persistent visible label", "Required fields are identified in text, not colour alone", "Errors are summarised at the top and linked to their fields", "Input is never cleared on a validation error", "The primary button names its action", "The form works fully by keyboard, with visible focus"] },
  dashboard: { ui_type: "dashboard", items: ["The 3–5 decision metrics appear first, each with a comparison", "One time-range control governs every widget", "Every number has a label, a unit and a period", "Detail is one click away from each summary", "Colour is never the only carrier of status", "Loading and empty states are designed, not blank"] },
  checkout: { ui_type: "checkout", items: ["Total cost including fees is visible before the final step", "Guest checkout is offered before account creation", "Progress through steps is visible", "Payment errors preserve all entered data", "Confirmation shows an order reference and next steps", "Receipt is available by email and on screen"] },
  "landing-page": { ui_type: "landing-page", items: ["One primary action, visibly distinct from everything else", "The headline states the outcome in the user's words", "Proof (numbers, names, quotes) sits next to claims", "Body text meets 4.5:1 contrast and a 45–75 character line", "The page works with images and scripts disabled", "The ending repeats the primary action once"] },
  navigation: { ui_type: "navigation", items: ["Top-level items use the user's vocabulary", "The current location is identifiable on every page", "Every destination is reachable by keyboard in a logical order", "Search is present, visible and forgiving", "No destination is more than one level deeper than it needs to be"] },
  onboarding: { ui_type: "onboarding", items: ["The first real success is reachable in one session", "Only information needed for that success is requested", "Progress and the option to skip or exit are visible", "The empty state offers the action that fills it", "Completion confirms what happened and what comes next"] },
  mobile: { ui_type: "mobile", items: ["Primary targets are at least 44x44 pt and near the thumb's reach", "Content survives a 320 px-wide viewport without horizontal scroll", "Forms use the right keyboard type per field", "Nothing essential is hover-only", "Text is readable without zooming (16 px input text or larger)"] },
  accessibility: { ui_type: "accessibility", items: ["Text contrast is at least 4.5:1 (3:1 for large text)", "All functionality is keyboard-operable with visible focus", "Colour never carries meaning alone", "Images have alt text by purpose; decorative images are hidden from AT", "Headings form a logical outline; landmarks are present", "Motion respects prefers-reduced-motion"] },
};

export function getChecklist(opts: GetChecklistOptions) {
  const uiType = requireString(opts?.ui_type, "ui_type");
  const entry = CHECKLISTS[keyOf(uiType)];
  if (!entry) throw new Error(`Unknown ui_type "${uiType}". Available: ${Object.keys(CHECKLISTS).join(", ")}`);
  return entry;
}

/* ---------------- business strategy & D4D ---------------- */

const STRATEGY: Record<string, { topic: string; summary: string; principles: string[]; designImplications: string[] }> = {
  positioning: { topic: "positioning", summary: "Name the specific audience, the job they hire the product for, and the alternative you beat — in one sentence a buyer can repeat.", principles: ["A position is a choice: naming who it is not for is part of the position", "Compete on the job to be done, not on feature lists", "Proof beats adjectives: one measured outcome outweighs ten claims"], designImplications: ["The homepage headline carries the position, not the product category", "Comparison and switching pages answer the alternative directly"] },
  pricing: { topic: "pricing", summary: "Price on the value metric the customer already counts, with tiers that map to real segments rather than to feature gates nobody wants.", principles: ["Anchor on the outcome the buyer budgets for", "Three tiers work because the middle is the considered choice", "Every price change is also a trust event: explain it early and plainly"], designImplications: ["Show total cost early; surprise fees destroy conversion and trust", "The recommended tier is visually distinct (Von Restorff), once"] },
  growth: { topic: "growth", summary: "Sustainable growth is retention with a distribution habit attached: a product people keep, that gives them a natural reason to bring others in.", principles: ["Fix the leaky bucket before buying more traffic", "Instrument activation before acquisition: a user who never succeeds never refers", "Loops beat funnels: output of one user becomes input for the next"], designImplications: ["Design the sharing moment into the core flow, not a referral afterthought", "Measure time-to-first-value and design onboarding against it"] },
  retention: { topic: "retention", summary: "People stay for recurring value delivered with decreasing effort: habits, stored value and switching costs earned honestly.", principles: ["Stored value (data, history, templates) is the strongest honest retention force", "Re-engagement messages must carry real value or they train people to ignore you", "Churn interviews beat churn surveys: ask five leavers, not five hundred stayers"], designImplications: ["Make accumulated value visible: history, streaks, libraries", "Design the return visit's first screen around what changed since last time"] },
  trust: { topic: "trust", summary: "Trust is a design material: consistent behaviour, honest pricing, reversible actions and plain language, compounded over every interaction.", principles: ["Never use dark patterns; the short-term conversion costs long-term custom", "Undo is cheaper than support: reversibility is a trust feature", "Say what you collect and why, at the moment of collection"], designImplications: ["Consent and privacy choices are real, symmetric and easy to find", "Status and billing pages are written to be understood under stress"] },
};

export function getBusinessStrategy(opts: GetBusinessStrategyOptions) {
  const topic = typeof opts?.topic === "string" ? opts.topic.trim() : "";
  if (!topic) return { topics: Object.keys(STRATEGY), summary: "Business strategy guidance by topic. Ask for one topic for detail.", entries: Object.values(STRATEGY).map((e) => ({ topic: e.topic, summary: e.summary })) };
  const entry = STRATEGY[keyOf(topic)];
  if (!entry) throw new Error(`Unknown topic "${topic}". Available: ${Object.keys(STRATEGY).join(", ")}`);
  return entry;
}

const D4D_PHASES = [
  { phase: "Discover", goal: "Learn what the problem actually is, from the people who have it.", activities: ["User interviews and field observation", "Analytics and support-log review", "Journey mapping of the current experience"], outputs: ["Research summary", "Journey map", "Opportunity areas"] },
  { phase: "Define", goal: "Choose the problem worth solving and state it so a team can act on it.", activities: ["Synthesis of discovery findings", "Problem framing and prioritisation (for example with RICE)", "Success metrics agreed before design starts"], outputs: ["Problem statement", "Design brief", "Success metrics"] },
  { phase: "Develop", goal: "Explore several answers, then converge on one by testing with real users.", activities: ["Sketching and concept generation", "Prototyping at increasing fidelity", "Usability testing and iteration"], outputs: ["Tested prototype", "Design specification", "Content draft"] },
  { phase: "Deliver", goal: "Ship the smallest complete version, measure it against the agreed metrics, and keep improving.", activities: ["Build with the design system, not around it", "Accessibility and content review before release", "Post-launch measurement and iteration"], outputs: ["Live service", "Measurement report", "Iteration backlog"] },
];

const D4D_TEMPLATES: Record<string, { template: string; framing: string; phaseNotes: Record<string, string> }> = {
  standard: { template: "standard", framing: "The full double-diamond: diverge, converge, diverge, converge.", phaseNotes: {} },
  sprint: { template: "sprint", framing: "A one-week compressed pass: one day per phase, prototype tested on day five.", phaseNotes: { Discover: "Interview 3–5 users in a single day; reuse existing research.", Define: "Agree the problem statement by end of day two — no extensions.", Develop: "Prototype only the riskiest flow.", Deliver: "Deliverable is the test report and a go/no-go decision." } },
  workshop: { template: "workshop", framing: "A facilitated group format: participants generate and judge ideas together in one room.", phaseNotes: { Discover: "Bring real user evidence into the room; do not rely on opinion.", Develop: "Sketch individually first, critique second — avoids anchoring." } },
  audit: { template: "audit", framing: "An evaluation format: the phases review an existing service against evidence and standards.", phaseNotes: { Discover: "Heuristic evaluation plus analytics review.", Define: "Findings are prioritised by severity and user impact.", Deliver: "Deliverable is a findings report with recommended fixes." } },
};

export function getD4dFramework(opts: GetD4dFrameworkOptions) {
  const template = typeof opts?.template === "string" ? opts.template.trim() : "";
  if (!template) return { framework: "D4D — Discover, Define, Develop, Deliver", templates: Object.keys(D4D_TEMPLATES), phases: D4D_PHASES };
  const t = D4D_TEMPLATES[keyOf(template)];
  if (!t) throw new Error(`Unknown template "${template}". Available: ${Object.keys(D4D_TEMPLATES).join(", ")}`);
  return { framework: "D4D — Discover, Define, Develop, Deliver", template: t.template, framing: t.framing, phases: D4D_PHASES.map((p) => ({ ...p, note: t.phaseNotes[p.phase] ?? null })) };
}

/* ---------------- design systems & compose ---------------- */

export const DESIGN_SYSTEMS: DesignSystem[] = [
  { name: "material", summary: "A comprehensive system built around surfaces, elevation and a dynamic colour scheme generated from a seed colour.", tokens: { "color.primary": "#6750A4", "color.background": "#FEF7FF", "color.text": "#1D1B20", "color.error": "#B3261E", "spacing.unit": "4px", "font.family": "Roboto, system-ui, sans-serif", "font.size.base": "16px", "radius.base": "12px", "shadow.card": "0 1px 3px rgba(0,0,0,0.20)" } },
  { name: "carbon", summary: "An enterprise system with a strict 8px spacing scale, two typefaces for product and brand, and data-dense component patterns.", tokens: { "color.primary": "#0F62FE", "color.background": "#FFFFFF", "color.text": "#161616", "color.error": "#DA1E28", "spacing.unit": "8px", "font.family": "'IBM Plex Sans', system-ui, sans-serif", "font.size.base": "14px", "radius.base": "0px", "shadow.card": "0 2px 6px rgba(0,0,0,0.20)" } },
  { name: "polaris", summary: "A commerce-focused system: restrained colour, generous spacing, and content guidance written for merchants of every skill level.", tokens: { "color.primary": "#008060", "color.background": "#F6F6F7", "color.text": "#202223", "color.error": "#D72C0D", "spacing.unit": "4px", "font.family": "-apple-system, 'Segoe UI', sans-serif", "font.size.base": "14px", "radius.base": "8px", "shadow.card": "0 1px 0 rgba(22,29,37,0.05)" } },
  { name: "atlassian", summary: "A collaboration-product system with a bright palette, a strong illustration voice, and tokens shared across many products.", tokens: { "color.primary": "#0052CC", "color.background": "#FFFFFF", "color.text": "#172B4D", "color.error": "#DE350B", "spacing.unit": "8px", "font.family": "-apple-system, 'Segoe UI', sans-serif", "font.size.base": "14px", "radius.base": "3px", "shadow.card": "0 1px 1px rgba(9,30,66,0.25)" } },
  { name: "govuk", summary: "A public-service system optimised for clarity and accessibility: one typeface, a restrained palette, and content before decoration.", tokens: { "color.primary": "#1D70B8", "color.background": "#FFFFFF", "color.text": "#0B0C0C", "color.error": "#D4351C", "color.focus": "#FFDD00", "spacing.unit": "5px", "font.family": "'GDS Transport', Arial, sans-serif", "font.size.base": "19px", "radius.base": "0px", "shadow.card": "none" } },
];

const SYSTEM_ALIASES: Record<string, string> = { "material-design": "material", "material-you": "material", "ibm-carbon": "carbon", "shopify-polaris": "polaris", polaris: "polaris", "atlassian-design-system": "atlassian", ads: "atlassian", "gov-uk": "govuk", gov: "govuk" };

function resolveSystem(name: string): DesignSystem {
  const k = keyOf(name);
  const canonical = SYSTEM_ALIASES[k] ?? k;
  const found = DESIGN_SYSTEMS.find((s) => s.name === canonical);
  if (!found) throw new Error(`Unknown design system "${name}". Available: ${DESIGN_SYSTEMS.map((s) => s.name).join(", ")}`);
  return found;
}

export function listDesignSystems() {
  return { count: DESIGN_SYSTEMS.length, systems: DESIGN_SYSTEMS.map((s) => ({ name: s.name, summary: s.summary, tokenCount: Object.keys(s.tokens).length })) };
}

export function getDesignSystem(opts: GetDesignSystemOptions) {
  const name = requireString(opts?.name, "name");
  const s = resolveSystem(name);
  return { name: s.name, summary: s.summary, tokens: s.tokens, tokenCount: Object.keys(s.tokens).length };
}

export function composeSystem(opts: ComposeSystemOptions) {
  if (!Array.isArray(opts?.sources) || opts.sources.length === 0) throw new Error("sources must be a non-empty array of design system names");
  const resolved = opts.sources.map((s) => resolveSystem(requireString(s, "source")));
  const merged: Record<string, string> = {};
  const seenBy: Record<string, Record<string, string>> = {};
  for (const sys of resolved) {
    for (const [token, value] of Object.entries(sys.tokens)) {
      (seenBy[token] ??= {})[sys.name] = value;
      merged[token] = value; // later sources win
    }
  }
  const conflicts = Object.entries(seenBy)
    .filter(([, bySystem]) => new Set(Object.values(bySystem)).size > 1)
    .map(([token, bySystem]) => ({ token, values: bySystem, winner: resolved.map((s) => s.name).filter((n) => n in bySystem).pop(), resolvedValue: merged[token] }));
  return { sources: resolved.map((s) => s.name), tokens: merged, tokenCount: Object.keys(merged).length, conflicts, conflictCount: conflicts.length, rule: "Later sources win on conflicts." };
}

/* ---------------- brand & content systems ---------------- */

const BRAND_SYSTEMS: BrandSystem[] = [
  { brand: "govuk", summary: "A public-service brand: trustworthy because it is plain. Crown, one typeface, and content that treats every citizen as equally deserving of clarity.", values: ["Clarity over decoration", "Equal service for everyone", "Evidence over opinion"], visual: ["Restrained palette with a single link blue and a high-visibility focus yellow", "One sans typeface at generous sizes", "No imagery that does not inform"], doList: ["Write the service name as a verb phrase a citizen would use", "Test with users who have access needs, every round"], dontList: ["Do not add decoration to look modern", "Do not use language a press office likes but a citizen cannot parse"] },
  { brand: "polaris", summary: "A commerce brand that speaks like a helpful shopkeeper: encouraging, plain, and focused on the merchant's next sale rather than the platform.", values: ["Be the merchant's partner, not their landlord", "Encouragement backed by specifics", "Plain words at a grade-school reading level"], visual: ["Restrained neutrals with one confident green", "Illustration that shows work, not aspiration", "Generous whitespace around the primary action"], doList: ["Name features by what the merchant achieves", "Celebrate concrete milestones with concrete numbers"], dontList: ["Do not use hype words like 'revolutionary'", "Do not centre the platform in the merchant's story"] },
  { brand: "atlassian", summary: "A teamwork brand: optimistic, practical, and a little playful — software presented as a team sport with open ways of working.", values: ["Open company, no bullshit", "Build with heart and balance", "Play as a team"], visual: ["Bright multi-colour palette used with restraint", "Rounded, friendly illustration of people working together", "Bold display type for statements, quiet type for product"], doList: ["Show teams, not lone heroes", "Share practices openly, including failures"], dontList: ["Do not use corporate stock-photo formality", "Do not promise effortlessness teamwork does not have"] },
  { brand: "conversational", summary: "A voice-first brand for chat and assistant products: the personality lives in word choice and timing, not in a mascot.", values: ["Helpful before clever", "Honest about being automated", "Brief by default, thorough on request"], visual: ["Minimal chrome; the words are the interface", "Typing and listening states are designed, not default", "Personality shown in microcopy, never in fake humanity"], doList: ["Confirm understanding before acting on ambiguity", "Offer the human escape route early"], dontList: ["Do not pretend to have feelings or a body", "Do not use humour in error or loss situations"] },
];

const BRAND_ALIASES: Record<string, string> = { "gov-uk": "govuk", gov: "govuk", shopify: "polaris", "shopify-polaris": "polaris", chat: "conversational", "voice-ui": "conversational" };

function resolveBrand(brand: string, list: { brand: string }[]): string {
  const k = keyOf(brand);
  const canonical = BRAND_ALIASES[k] ?? k;
  if (!list.some((b) => b.brand === canonical)) throw new Error(`Unknown brand "${brand}". Available: ${list.map((b) => b.brand).join(", ")}`);
  return canonical;
}

export function getBrandSystem(opts: GetBrandSystemOptions) {
  const brand = requireString(opts?.brand, "brand");
  const canonical = resolveBrand(brand, BRAND_SYSTEMS);
  return BRAND_SYSTEMS.find((b) => b.brand === canonical);
}

const CONTENT_SYSTEMS: ContentSystem[] = [
  { brand: "govuk", voice: ["Plain English, short sentences, words citizens use", "Direct address: 'you' for the citizen, the service name — not 'we' — for government", "Front-load the action: what to do, then why"], toneBySituation: { routine: "Calm, factual, brief", problem: "Apologetic in substance, specific about what happens next", refusal: "Honest about the rule, clear about any appeal route" }, mechanics: ["Sentence case everywhere, including headings", "Numbers as numerals; dates written out in full", "One idea per paragraph; headings that work as a summary alone"] },
  { brand: "polaris", voice: ["Encouraging without hype: name the next small win", "Merchant's vocabulary, never platform jargon", "Verbs first in buttons and headings"], toneBySituation: { routine: "Friendly and efficient", problem: "Own the issue, give the fix and the timeframe", celebration: "Specific praise tied to the merchant's own numbers" }, mechanics: ["Sentence case; no exclamation inflation (one per screen at most)", "Avoid 'simply' and 'just' — they minimise real work", "Empty states teach the concept in one line, then offer the action"] },
  { brand: "atlassian", voice: ["Practical optimism: teamwork is hard and worth it", "Colloquial but never sloppy; contractions welcome", "Credit the team in examples, not the tool"], toneBySituation: { routine: "Warm, concise, a touch wry", problem: "Straightforward, no jokes, clear ownership", celebration: "Amplify the team's achievement, not the product's" }, mechanics: ["Headings in sentence case that scan as a story", "Humour lives in illustration and asides, never in errors", "Write alt text and link text that stand alone out of context"] },
  { brand: "conversational", voice: ["Short turns, one question at a time", "Mirror the user's words for names, dates and items", "Confirm before acting whenever the cost of a mistake is real"], toneBySituation: { routine: "Light, quick, unadorned", problem: "Slow down, acknowledge, offer a human", misunderstanding: "Restate what was heard and invite correction without blame" }, mechanics: ["Design the repair path ('I meant Tuesday') as a first-class flow", "Never read markup, codes or internal IDs aloud", "End every flow by stating what was done and how to undo it"] },
];

export function getContentSystem(opts: GetContentSystemOptions) {
  const brand = requireString(opts?.brand, "brand");
  const canonical = resolveBrand(brand, CONTENT_SYSTEMS);
  return CONTENT_SYSTEMS.find((b) => b.brand === canonical);
}

/* ---------------- content principles & patterns ---------------- */

const CONTENT_PRINCIPLES = [
  { topic: "clarity", principle: "Write so a reader in a hurry, under stress, on a small screen still gets it first time.", detail: "Short sentences, common words, the key point first. If a sentence needs a second reading, rewrite it." },
  { topic: "clarity", principle: "One idea per sentence, one purpose per page.", detail: "Pages that try to do two jobs do neither; split them and link." },
  { topic: "voice", principle: "Voice is constant; tone flexes with the situation.", detail: "The personality stays the same in a celebration and in an error — the tone (warmth, formality, pace) adjusts." },
  { topic: "voice", principle: "Write like the service, not like the organisation chart.", detail: "Users meet one service, not departments. Remove internal team names and process language." },
  { topic: "structure", principle: "Front-load: headings and first sentences carry the summary.", detail: "Most readers scan. A page whose headings alone tell the story serves scanners and readers alike." },
  { topic: "structure", principle: "Use lists for lists and prose for reasoning.", detail: "Three or more parallel items become a list; an argument stays prose so its logic stays visible." },
  { topic: "accessibility", principle: "Link text and headings must make sense out of context.", detail: "Screen-reader users navigate by headings and links: 'Apply for a permit' beats 'Click here', every time." },
  { topic: "accessibility", principle: "Plain language is an accessibility feature.", detail: "Reading level around age 9–11 serves the widest audience, including experts in a hurry." },
  { topic: "errors", principle: "An error message names the problem and the fix, in the user's terms.", detail: "'Enter the date as 12 6 2027' beats 'Invalid input'. Never blame the user; never keep their work hostage." },
];

export function getContentPrinciples(opts: GetContentPrinciplesOptions) {
  const topic = typeof opts?.topic === "string" ? opts.topic.trim() : "";
  if (!topic) return { topics: [...new Set(CONTENT_PRINCIPLES.map((p) => p.topic))], count: CONTENT_PRINCIPLES.length, principles: CONTENT_PRINCIPLES };
  const t = keyOf(topic);
  const matched = CONTENT_PRINCIPLES.filter((p) => p.topic === t);
  if (matched.length === 0) return { topic, matched: false, count: CONTENT_PRINCIPLES.length, principles: CONTENT_PRINCIPLES, note: "No content principles filed under that topic; returning all." };
  return { topic: t, matched: true, count: matched.length, principles: matched };
}

const CONTENT_PATTERNS: Record<string, { pattern_type: string; summary: string; structure: string[]; example: string; avoid: string }> = {
  "error-message": { pattern_type: "error-message", summary: "A message that appears where the error is, names it plainly, and gives the correction.", structure: ["State what happened", "State how to fix it, with the expected format", "Preserve everything the user entered"], example: "Enter your date of birth as day month year, like 12 6 1990.", avoid: "'Invalid input' or a bare error code with no next step." },
  "empty-state": { pattern_type: "empty-state", summary: "Words for a space with nothing in it yet: what belongs here, why it matters, and the action that fills it.", structure: ["Name what will live here", "One line on why it is useful", "One primary action"], example: "Invoices you send will appear here. Send your first invoice to get paid faster.", avoid: "Witty copy with no action, or an apology for the emptiness." },
  confirmation: { pattern_type: "confirmation", summary: "The receipt moment: what happened, the reference, and what happens next — written for the Peak-End Rule.", structure: ["Confirm the outcome in the first line", "Give the reference number and how it was sent", "State the next step and its timeframe"], example: "Application received. Your reference is HDJ2123F. We will email a decision within 5 working days.", avoid: "Burying the reference, or ending on a cross-sell." },
  onboarding: { pattern_type: "onboarding", summary: "Instructional copy that teaches by doing: one concept, inside the task, at the moment of need.", structure: ["Name the benefit in the user's words", "Give the single next action", "Defer everything else"], example: "Add your first product — it takes about a minute, and you can change it any time.", avoid: "A five-screen feature tour before the first task." },
  "help-text": { pattern_type: "help-text", summary: "Short guidance attached to a field or decision, answering the question the user has at exactly that point.", structure: ["Answer the actual question (usually 'where do I find this?')", "Give an example in the expected format", "Keep it under two short sentences"], example: "Find your reference on the letter we sent you — it starts with two letters, like AB123456.", avoid: "Repeating the label in longer words." },
  notification: { pattern_type: "notification", summary: "An interruption that earns its place: timely, specific, and actionable, or not sent at all.", structure: ["Lead with what changed", "Say why it matters to this user", "One action, named as a verb"], example: "Payment received: £240 from A. Example for invoice 1042. View invoice.", avoid: "Batching bad news under a cheerful subject line." },
  "form-labels": { pattern_type: "form-labels", summary: "Labels written as the questions users ask themselves, kept visible and matched by programmatic names.", structure: ["Use the user's own words for the thing requested", "Add format hints outside the label, not inside it", "Keep the visible label and the accessible name identical"], example: "'Date of birth' with hint 'For example, 12 6 1990'.", avoid: "'DOB', internal field names, or placeholder-only labels." },
};

export function getContentPattern(opts: GetContentPatternOptions) {
  const patternType = requireString(opts?.pattern_type, "pattern_type");
  const entry = CONTENT_PATTERNS[keyOf(patternType)];
  if (!entry) throw new Error(`Unknown pattern_type "${patternType}". Available: ${Object.keys(CONTENT_PATTERNS).join(", ")}`);
  return entry;
}

/* ---------------- research, metrics, service ---------------- */

const RESEARCH_METHODS: Record<string, { method_type: string; summary: string; whenToUse: string; steps: string[]; sampleGuidance: string }> = {
  interview: { method_type: "interview", summary: "One-to-one conversations that uncover behaviour, context and motivation — what people do and why, in their own words.", whenToUse: "Early discovery, and whenever analytics shows a pattern nobody can explain.", steps: ["Write a discussion guide of open questions, ordered from warm-up to specifics", "Ask about past behaviour ('last time you…') rather than future intentions", "Record with consent; take timestamped notes", "Synthesise themes across at least five participants before concluding"], sampleGuidance: "5–8 participants per distinct audience segment." },
  "usability-test": { method_type: "usability-test", summary: "Watching representative users attempt real tasks on a design, while thinking aloud — behaviour, not opinion.", whenToUse: "Before build, on prototypes; and before launch, on the real service.", steps: ["Pick the 3–5 tasks whose failure would hurt most", "Recruit from the real audience, including assistive-technology users", "Ask participants to think aloud; never help or defend the design", "Score task success, errors and time; quote exact words in the report"], sampleGuidance: "5 users per round finds most severe issues; run more rounds, not more users." },
  survey: { method_type: "survey", summary: "Standardised questions at scale: good for measuring prevalence and tracking change, poor at explaining causes.", whenToUse: "When a question needs a denominator: how many, how often, how satisfied.", steps: ["One question per item; remove double negatives and jargon", "Pilot with five people reading aloud", "Keep it under five minutes; state that estimate honestly", "Report response rate and who is missing, not just averages"], sampleGuidance: "Aim for a sample that mirrors the audience; weight or caveat when it does not." },
  "diary-study": { method_type: "diary-study", summary: "Participants log experiences over days or weeks, revealing behaviour across time and context that a lab session cannot.", whenToUse: "Habits, recurring tasks, and journeys that span days.", steps: ["Set a small number of prompts tied to moments, not clock time", "Check in mid-study to keep entries flowing", "Close with an interview per participant to probe the entries"], sampleGuidance: "8–15 participants for 1–3 weeks is typical." },
  "card-sort": { method_type: "card-sort", summary: "Users group and label content items, exposing the mental model your information architecture should follow.", whenToUse: "Designing or repairing navigation and category structures.", steps: ["Choose 30–50 representative items, in users' vocabulary", "Open sort to discover groups; closed sort to validate a proposed tree", "Analyse groupings quantitatively, then interview outliers"], sampleGuidance: "15–20 participants for open sorts; 30+ for quantitative confidence." },
  "a-b-test": { method_type: "a-b-test", summary: "A controlled experiment: two variants, one metric decided in advance, random assignment, statistical discipline.", whenToUse: "Choosing between two concrete designs where behaviour can be measured.", steps: ["Write the hypothesis and the single primary metric first", "Estimate sample size from the smallest effect worth acting on", "Run to the planned size — no peeking and stopping early", "Report the effect with its interval, including when it is 'no difference'"], sampleGuidance: "Set by power calculation, not by calendar." },
  "heuristic-evaluation": { method_type: "heuristic-evaluation", summary: "Expert review of an interface against recognised heuristics (for example Nielsen's ten) to find violations cheaply.", whenToUse: "Early, and alongside — never instead of — testing with real users.", steps: ["Each evaluator inspects alone, twice: flow first, detail second", "Rate severity by frequency, impact and persistence", "Merge findings in a joint session; keep disagreements visible"], sampleGuidance: "3–5 evaluators find the majority of issues." },
};

export function getResearchMethod(opts: GetResearchMethodOptions) {
  const methodType = requireString(opts?.method_type, "method_type");
  const entry = RESEARCH_METHODS[keyOf(methodType).replace(/^user-/, "").replace(/^ux-/, "")];
  if (!entry) throw new Error(`Unknown method_type "${methodType}". Available: ${Object.keys(RESEARCH_METHODS).join(", ")}`);
  return entry;
}

const METRICS_FRAMEWORKS: Record<string, { framework: string; summary: string; components: { name: string; meaning: string }[]; cautions: string[] }> = {
  heart: { framework: "HEART", summary: "Google's user-experience measurement frame: Happiness, Engagement, Adoption, Retention, Task success — each paired with goals, signals and metrics.", components: [{ name: "Happiness", meaning: "Satisfaction and perceived ease, usually surveyed." }, { name: "Engagement", meaning: "Depth and frequency of meaningful use." }, { name: "Adoption", meaning: "New users reaching first value." }, { name: "Retention", meaning: "Users returning over a defined window." }, { name: "Task success", meaning: "Completion, errors and time on key tasks." }], cautions: ["Pick the categories that matter for this product; HEART is a menu, not a mandate."] },
  aarrr: { framework: "AARRR", summary: "The pirate funnel: Acquisition, Activation, Retention, Referral, Revenue — a diagnostic for where a growth system leaks.", components: [{ name: "Acquisition", meaning: "How users find you, by channel." }, { name: "Activation", meaning: "The first experience of real value." }, { name: "Retention", meaning: "Users coming back on the product's natural cadence." }, { name: "Referral", meaning: "Users bringing users, measured as a rate, not a hope." }, { name: "Revenue", meaning: "Money per user and per cohort." }], cautions: ["Order matters: optimising acquisition before retention pours water into a leaking bucket."] },
  "north-star": { framework: "North Star", summary: "One metric that captures the core value users receive, supported by a small set of input metrics teams can actually move.", components: [{ name: "North Star Metric", meaning: "The single number expressing delivered value (for example, weekly active teams shipping)." }, { name: "Input metrics", meaning: "3–5 levers that drive the star and map to team work." }], cautions: ["Revenue is usually a lagging result, not a North Star.", "Revisit yearly; a star that never changes may have stopped describing value."] },
  rice: { framework: "RICE", summary: "A prioritisation score: Reach × Impact × Confidence ÷ Effort. Useful for ordering a backlog, dangerous when treated as truth.", components: [{ name: "Reach", meaning: "How many users this affects in a period." }, { name: "Impact", meaning: "How much it moves the goal per user (use a small fixed scale)." }, { name: "Confidence", meaning: "How sure the estimates are, as a percentage." }, { name: "Effort", meaning: "Person-months, honestly estimated." }], cautions: ["Scores rank hypotheses; they do not replace judgement or discovery.", "Re-score after any experiment changes confidence."] },
  okr: { framework: "OKR", summary: "Objectives and Key Results: a qualitative ambition paired with 2–5 measurable results, set quarterly and scored without punishment theatre.", components: [{ name: "Objective", meaning: "A memorable, qualitative statement of what to achieve." }, { name: "Key Results", meaning: "Measurable outcomes (not tasks) that prove the objective." }], cautions: ["Key results measure outcomes; shipping a feature is an output.", "Tying OKR scores directly to pay corrupts the scoring."] },
};

export function getMetricsFramework(opts: GetMetricsFrameworkOptions) {
  const framework = requireString(opts?.framework, "framework");
  const entry = METRICS_FRAMEWORKS[keyOf(framework).replace(/-metric$/, "")];
  if (!entry) throw new Error(`Unknown framework "${framework}". Available: ${Object.keys(METRICS_FRAMEWORKS).join(", ")}`);
  return entry;
}

const SERVICE_PATTERNS: Record<string, { pattern: string; summary: string; steps: string[]; designNotes: string[] }> = {
  "start-page": { pattern: "start-page", summary: "The single entry point of a service: what it is, who it is for, what it costs, and the one button that begins it.", steps: ["Name the service as the user names it", "State eligibility, cost and what to have ready", "One start button, labelled with a verb"], designNotes: ["Most users arrive from search, not the homepage — the start page must stand alone."] },
  "check-eligibility": { pattern: "check-eligibility", summary: "A few questions, asked before effort is spent, that tell users whether the service is for them.", steps: ["Ask only questions that change the outcome", "Give the answer immediately, with the reason", "Offer the alternative route when the answer is no"], designNotes: ["Never ask for evidence at this stage; this is orientation, not assessment."] },
  "collect-information": { pattern: "collect-information", summary: "Gathering what the service needs: one thing per page, in the user's order, with progress visible.", steps: ["One question or decision per page", "Ask in the order users hold the information", "Let users change answers without losing the rest"], designNotes: ["The pattern behind most well-rated government forms; resist grouping for visual neatness."] },
  "check-answers": { pattern: "check-answers", summary: "A review page before submission: every answer listed, each with a change link returning to its question.", steps: ["List answers in the order they were given", "Each row links back to its question and returns here", "The declaration and submit action sit below the list"], designNotes: ["This page is the user's last chance to catch an error cheaply — design it as a safety feature."] },
  pay: { pattern: "pay", summary: "Taking a payment inside a service: amount confirmed first, familiar payment methods, receipt guaranteed.", steps: ["Confirm exactly what is being paid for and the total", "Offer the payment methods users already trust", "Issue the receipt and reference immediately"], designNotes: ["Never store card details yourself when a payment provider can hold them instead."] },
  confirmation: { pattern: "confirmation", summary: "The closing pattern: outcome, reference, timeframe, and what to do if something goes wrong.", steps: ["Confirm the outcome in the heading itself", "Give the reference and where it was also sent", "State the next step and when it will happen"], designNotes: ["Written for the Peak-End Rule: this page is disproportionately what users remember."] },
  "status-tracking": { pattern: "status-tracking", summary: "Letting users see where their case stands without contacting anyone: honest states, in plain language, with dates.", steps: ["Show the current state and what it means", "Show what happens next and the expected timeframe", "Provide the contact route when the state needs a human"], designNotes: ["A status that never changes is worse than none — keep states truthful or remove the tracker."] },
};

export function getServicePattern(opts: GetServicePatternOptions) {
  const pattern = requireString(opts?.pattern, "pattern");
  const entry = SERVICE_PATTERNS[keyOf(pattern)];
  if (!entry) throw new Error(`Unknown pattern "${pattern}". Available: ${Object.keys(SERVICE_PATTERNS).join(", ")}`);
  return entry;
}

const SERVICE_STANDARD = [
  { point: 1, title: "Understand users and their needs", summary: "Research real users, including those with access needs, before designing anything." },
  { point: 2, title: "Solve a whole problem for users", summary: "Consider the full journey, across channels, not just the screen in front of you." },
  { point: 3, title: "Provide a joined-up experience across all channels", summary: "Online, phone, paper and face-to-face should feel like one service." },
  { point: 4, title: "Make the service simple to use", summary: "Test with users and keep improving until the task is genuinely easy." },
  { point: 5, title: "Make sure everyone can use the service", summary: "Meet accessibility standards and provide assisted digital support for those who need it." },
  { point: 6, title: "Have a multidisciplinary team", summary: "Design, research, content, engineering and policy in one team, with a named service owner." },
  { point: 7, title: "Use agile ways of working", summary: "Iterate in small steps, governed by what user evidence shows." },
  { point: 8, title: "Iterate and improve frequently", summary: "Release often, keep researching, and never treat launch as the end." },
  { point: 9, title: "Create a secure service which protects users' privacy", summary: "Handle data lawfully and minimally, and design consent honestly." },
  { point: 10, title: "Define what success looks like and publish performance data", summary: "Choose measures of user outcomes and report them openly." },
  { point: 11, title: "Choose the right tools and technology", summary: "Prefer proven, commodity technology; justify anything bespoke." },
  { point: 12, title: "Make new source code open", summary: "Publish code openly so others can reuse and scrutinise it, unless secrecy is genuinely required." },
  { point: 13, title: "Use and contribute to open standards, common components and patterns", summary: "Build on shared components and give improvements back." },
  { point: 14, title: "Operate a reliable service", summary: "Monitor, support and keep the service available at the standard users depend on." },
];

export function getServiceStandard() {
  return { name: "GOV.UK Service Standard", pointCount: SERVICE_STANDARD.length, points: SERVICE_STANDARD };
}

/* ---------------- brand principles & trends ---------------- */

const BRAND_PRINCIPLES = [
  { topic: "distinctiveness", principle: "Be recognisable in a cropped square with the logo removed.", detail: "Distinctive assets — colour, shape, type, voice — earn memory; generic polish earns nothing." },
  { topic: "distinctiveness", principle: "Consistency compounds; novelty resets.", detail: "Every change to a core asset spends recognition the brand already owned. Change rarely, and for a reason." },
  { topic: "voice", principle: "The brand sounds like one person on their best day, in every channel.", detail: "Define voice by word choices and sentences to imitate, not by adjectives like 'bold'." },
  { topic: "positioning", principle: "A brand is a promise the operations must keep.", detail: "Branding a slow, confusing service as effortless creates a louder disappointment, not a better brand." },
  { topic: "positioning", principle: "Stand for one thing in the customer's words.", detail: "If customers cannot repeat the promise unaided, the positioning is a workshop artefact, not a brand." },
  { topic: "governance", principle: "Guidelines should make the right thing the easy thing.", detail: "Templates, tokens and examples outperform rulebooks; govern by providing, not policing." },
];

export function getBrandPrinciples(opts: GetBrandPrinciplesOptions) {
  const topic = typeof opts?.topic === "string" ? opts.topic.trim() : "";
  if (!topic) return { topics: [...new Set(BRAND_PRINCIPLES.map((p) => p.topic))], count: BRAND_PRINCIPLES.length, principles: BRAND_PRINCIPLES };
  const t = keyOf(topic);
  const matched = BRAND_PRINCIPLES.filter((p) => p.topic === t);
  if (matched.length === 0) return { topic, matched: false, count: BRAND_PRINCIPLES.length, principles: BRAND_PRINCIPLES, note: "No brand principles filed under that topic; returning all." };
  return { topic: t, matched: true, count: matched.length, principles: matched };
}

const BRAND_TRENDS = [
  { trend: "Design tokens as the brand's single source of truth", summary: "Brands increasingly ship tokens and variables, not PDFs, so identity updates propagate to every product surface at once.", implication: "Treat the token pipeline as brand infrastructure, with versioning and review." },
  { trend: "Variable and expressive typography", summary: "Variable fonts let one typeface carry a system from quiet UI text to loud display moments without new licences or files.", implication: "Define type by role and range, not by fixed weights." },
  { trend: "Motion as identity", summary: "Characteristic easing and timing are becoming as recognisable as colour — and as easy to get wrong under reduced-motion settings.", implication: "Specify motion tokens and a reduced-motion equivalent for every signature animation." },
  { trend: "Accessible palettes by default", summary: "Contrast-checked colour pairs are being published as part of the palette itself, shifting accessibility from audit to asset.", implication: "Ship approved foreground/background pairs, not just swatches." },
  { trend: "Voice systems for AI surfaces", summary: "As assistants generate words at runtime, brands are writing generation guidance — example turns, repair patterns, refusals — alongside static copy rules.", implication: "Content systems now need worked examples of generated dialogue, including failure cases." },
  { trend: "Sustainability as a design constraint", summary: "Page weight, dark-mode energy use and media budgets are entering brand guidelines as measurable limits.", implication: "Give media and motion budgets numbers, like any other token." },
];

export function getBrandTrends() {
  return { count: BRAND_TRENDS.length, trends: BRAND_TRENDS, note: "Curated local snapshot; trends are editorial, not live market data." };
}

/* ---------------- evaluate & search ---------------- */

const EVAL_DIMENSIONS: { name: string; signals: string[]; absence: string }[] = [
  { name: "accessibility", signals: ["contrast", "wcag", "screen reader", "keyboard", "focus", "alt text", "aria", "accessible", "accessibility"], absence: "No accessibility signals: the description does not mention contrast, keyboard focus, or assistive technology." },
  { name: "hierarchy", signals: ["hierarchy", "headline", "primary action", "emphasis", "type scale", "typography scale", "visual weight", "stands out"], absence: "No hierarchy signals: nothing indicates what the user should look at or do first." },
  { name: "consistency", signals: ["consistent", "design system", "token", "reuse", "pattern library", "same style", "components"], absence: "No consistency signals: no design system, tokens, or reused components are mentioned." },
  { name: "feedback", signals: ["feedback", "loading", "error state", "success", "confirmation", "progress", "empty state", "status"], absence: "No feedback signals: loading, success, error and empty states are not addressed." },
  { name: "simplicity", signals: ["simple", "minimal", "few steps", "clear", "progressive disclosure", "one task", "single column", "plain language"], absence: "No simplicity signals: nothing suggests choices or steps were reduced." },
];

export function evaluateDesign(opts: EvaluateDesignOptions) {
  const description = requireString(opts?.description, "description");
  const text = norm(description);
  const dimensions = EVAL_DIMENSIONS.map((d) => {
    const hits = d.signals.filter((s) => text.includes(s));
    const score = hits.length === 0 ? 30 : Math.min(100, 45 + 18 * hits.length);
    return { name: d.name, score, signalsFound: hits };
  });
  const score = Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length);
  const grade = score >= 85 ? "strong" : score >= 70 ? "good" : score >= 50 ? "mixed" : "weak";
  if (opts?.compact) return { score, grade, dimensions: Object.fromEntries(dimensions.map((d) => [d.name, d.score])) };
  const matchingPrinciples = PRINCIPLES.filter((p) => p.keywords.some((k) => text.includes(k)) || words(p.title).some((w) => w.length > 4 && text.includes(w)))
    .map((p) => ({ id: p.id, title: p.title, source: p.source }));
  const violations = EVAL_DIMENSIONS.filter((d) => !dimensions.find((x) => x.name === d.name)?.signalsFound.length).map((d) => d.absence);
  const suggestions = dimensions.filter((d) => d.score < 70).map((d) => `Strengthen ${d.name}: address it explicitly in the design description and the design itself.`);
  return { score, grade, dimensions, matchingPrinciples, violations, suggestions, note: "Heuristic evaluation of the description text against the local catalogue — not a review of a rendered design." };
}

export function searchKnowledge(opts: SearchKnowledgeOptions) {
  const query = requireString(opts?.query, "query");
  const q = new Set(words(query));
  type Hit = { kind: string; name: string; summary: string; score: number };
  const hits: Hit[] = [];
  const add = (kind: string, name: string, summary: string, extra: string) => {
    const hay = new Set([...words(name), ...words(summary), ...words(extra)]);
    let score = 0;
    for (const w of q) if (hay.has(w)) score++;
    if (score > 0) hits.push({ kind, name, summary, score });
  };
  for (const p of PRINCIPLES) add("principle", p.title, p.summary, `${p.source} ${p.keywords.join(" ")} ${p.contexts.join(" ")}`);
  for (const p of Object.values(PATTERNS)) add("pattern", p.ui_type, p.summary, p.guidance.join(" "));
  for (const c of Object.values(CHECKLISTS)) add("checklist", c.ui_type, c.items[0] ?? "", c.items.join(" "));
  for (const s of DESIGN_SYSTEMS) add("design-system", s.name, s.summary, Object.keys(s.tokens).join(" "));
  for (const b of BRAND_SYSTEMS) add("brand-system", b.brand, b.summary, b.values.join(" "));
  for (const c of CONTENT_SYSTEMS) add("content-system", c.brand, c.voice[0] ?? "", c.voice.join(" "));
  for (const cp of Object.values(CONTENT_PATTERNS)) add("content-pattern", cp.pattern_type, cp.summary, cp.example);
  for (const m of Object.values(RESEARCH_METHODS)) add("research-method", m.method_type, m.summary, m.whenToUse);
  for (const f of Object.values(METRICS_FRAMEWORKS)) add("metrics-framework", f.framework, f.summary, f.components.map((c) => c.name).join(" "));
  for (const sp of Object.values(SERVICE_PATTERNS)) add("service-pattern", sp.pattern, sp.summary, sp.steps.join(" "));
  for (const s of Object.values(STRATEGY)) add("business-strategy", s.topic, s.summary, s.principles.join(" "));
  hits.sort((a, b) => b.score - a.score);
  return { query, count: hits.length, results: hits.slice(0, 20).map(({ kind, name, summary }) => ({ kind, name, summary })) };
}
