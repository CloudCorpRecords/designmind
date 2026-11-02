import { describe, it } from "node:test";
import assert from "node:assert/strict";
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
} from "../src/designmind.js";

describe("principles", () => {
  it("matches principles to a context", () => {
    const out = getPrinciples({ context: "accessible forms with good contrast" });
    assert.equal(out.matched, true);
    assert.ok(out.principles.some((p) => p.id === "wcag-contrast"));
  });
  it("returns the full catalogue with matched:false for an unmatched context", () => {
    const out = getPrinciples({ context: "zzzqqq nonexistent" });
    assert.equal(out.matched, false);
    assert.ok(out.count >= 20);
  });
  it("rejects an empty context", () => {
    assert.throws(() => getPrinciples({ context: " " }), /non-empty/);
  });
});

describe("patterns and checklists", () => {
  it("returns pattern guidance for a known ui_type", () => {
    const out = getPattern({ ui_type: "Checkout" });
    assert.equal(out.ui_type, "checkout");
    assert.ok(out.guidance.length >= 3);
  });
  it("errors on an unknown ui_type, listing options", () => {
    assert.throws(() => getPattern({ ui_type: "hologram" }), /Available:/);
  });
  it("returns a checklist for a known ui_type", () => {
    const out = getChecklist({ ui_type: "form" });
    assert.ok(out.items.length >= 5);
  });
  it("errors on an unknown checklist ui_type", () => {
    assert.throws(() => getChecklist({ ui_type: "hologram" }), /Available:/);
  });
});

describe("business strategy and D4D", () => {
  it("lists topics without a topic argument", () => {
    const out = getBusinessStrategy({});
    assert.ok(out.topics.includes("positioning"));
  });
  it("returns a topic entry and errors on unknown topics", () => {
    assert.equal(getBusinessStrategy({ topic: "retention" }).topic, "retention");
    assert.throws(() => getBusinessStrategy({ topic: "astrology" }), /Available:/);
  });
  it("returns four D4D phases by default", () => {
    const out = getD4dFramework({});
    assert.equal(out.phases.length, 4);
    assert.equal(out.phases[0].phase, "Discover");
  });
  it("applies a template's notes and errors on unknown templates", () => {
    const out = getD4dFramework({ template: "sprint" });
    assert.equal(out.template, "sprint");
    assert.ok(out.phases.some((p) => p.note));
    assert.throws(() => getD4dFramework({ template: "nope" }), /Available:/);
  });
});

describe("design systems and compose", () => {
  it("lists the catalogue systems", () => {
    const out = listDesignSystems();
    assert.equal(out.count, 5);
    assert.ok(out.systems.some((s) => s.name === "govuk"));
  });
  it("resolves aliases and returns tokens", () => {
    const out = getDesignSystem({ name: "GOV.UK" });
    assert.equal(out.name, "govuk");
    assert.equal(out.tokens["color.focus"], "#FFDD00");
  });
  it("errors on an unknown system", () => {
    assert.throws(() => getDesignSystem({ name: "nope" }), /Available:/);
  });
  it("compose merges with later sources winning and lists conflicts", () => {
    const out = composeSystem({ sources: ["material", "govuk"] });
    assert.equal(out.tokens["color.primary"], "#1D70B8");
    assert.ok(out.conflictCount > 0);
    const conflict = out.conflicts.find((c) => c.token === "color.primary");
    assert.ok(conflict);
    assert.equal(conflict.winner, "govuk");
    assert.equal(conflict.values.material, "#6750A4");
  });
  it("compose of one system has no conflicts; empty sources error", () => {
    assert.equal(composeSystem({ sources: ["carbon"] }).conflictCount, 0);
    assert.throws(() => composeSystem({ sources: [] }), /non-empty/);
  });
});

describe("brand and content", () => {
  it("returns a brand system via alias", () => {
    assert.equal(getBrandSystem({ brand: "shopify" })?.brand, "polaris");
  });
  it("returns a content system and errors on unknown brands", () => {
    const out = getContentSystem({ brand: "govuk" });
    assert.ok(out?.voice.length >= 2);
    assert.throws(() => getContentSystem({ brand: "nope" }), /Available:/);
  });
  it("content principles list all, filter by topic, fall back honestly", () => {
    assert.ok(getContentPrinciples({}).count >= 8);
    const errs = getContentPrinciples({ topic: "errors" });
    assert.equal(errs.matched, true);
    assert.equal(getContentPrinciples({ topic: "zzz" }).matched, false);
  });
  it("returns a content pattern and errors on unknown types", () => {
    assert.equal(getContentPattern({ pattern_type: "error-message" }).pattern_type, "error-message");
    assert.throws(() => getContentPattern({ pattern_type: "nope" }), /Available:/);
  });
  it("brand principles filter and brand trends list", () => {
    assert.equal(getBrandPrinciples({ topic: "voice" }).matched, true);
    assert.ok(getBrandTrends().count >= 5);
  });
});

describe("research, metrics, service", () => {
  it("returns a research method and errors on unknown types", () => {
    assert.equal(getResearchMethod({ method_type: "usability test" }).method_type, "usability-test");
    assert.throws(() => getResearchMethod({ method_type: "nope" }), /Available:/);
  });
  it("returns metrics frameworks by name", () => {
    assert.equal(getMetricsFramework({ framework: "HEART" }).framework, "HEART");
    assert.equal(getMetricsFramework({ framework: "north-star" }).framework, "North Star");
    assert.throws(() => getMetricsFramework({ framework: "nope" }), /Available:/);
  });
  it("returns a service pattern and errors on unknown patterns", () => {
    assert.equal(getServicePattern({ pattern: "check-answers" }).pattern, "check-answers");
    assert.throws(() => getServicePattern({ pattern: "nope" }), /Available:/);
  });
  it("service standard has exactly 14 points in order", () => {
    const out = getServiceStandard();
    assert.equal(out.pointCount, 14);
    assert.equal(out.points[0].point, 1);
    assert.equal(out.points[13].point, 14);
  });
});

describe("evaluate and search", () => {
  it("scores a rich description higher than a bare one", () => {
    const rich = evaluateDesign({ description: "Single column form with visible labels, strong contrast for WCAG, clear hierarchy with one primary action, consistent design system tokens, loading and error state feedback, plain language." });
    const bare = evaluateDesign({ description: "A page with some stuff on it." });
    assert.ok(rich.score > bare.score);
    assert.equal(rich.violations.length, 0);
    assert.ok(bare.violations.length >= 3);
    assert.ok(rich.matchingPrinciples.length >= 1);
  });
  it("compact mode returns only score, grade and dimension scores", () => {
    const out = evaluateDesign({ description: "Clear hierarchy and contrast.", compact: true });
    assert.ok(typeof out.score === "number");
    assert.ok("accessibility" in out.dimensions);
    assert.ok(!("violations" in out));
  });
  it("rejects an empty description", () => {
    assert.throws(() => evaluateDesign({ description: "" }), /non-empty/);
  });
  it("search finds catalogue entries across kinds", () => {
    const out = searchKnowledge({ query: "contrast accessibility" });
    assert.ok(out.count > 0);
    assert.ok(out.results.some((r) => r.kind === "principle"));
  });
  it("search with no matches returns count 0", () => {
    assert.equal(searchKnowledge({ query: "zzzqqq" }).count, 0);
  });
});
