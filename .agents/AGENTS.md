# Luxora 2.0 Universal Implementation Protocol (Mandatory)

This protocol is the mandatory engineering workflow for every new feature, enhancement, refactor, or architectural change in Luxora 2.0. No implementation should begin until the audit is complete, and no implementation should be considered finished until every verification step passes.

The development philosophy is: **AUDIT → VERIFY → IMPROVE → EXTEND → BUILD → TEST → VALIDATE**

## Phase 1 — Architecture Audit (MANDATORY)
Before writing any code, perform a complete audit of the affected module. Identify existing architecture, structure, routes, components, etc. Determine what exists, what is missing, what should be preserved/extended, and what should never be modified. No assumptions.

## Phase 2 — Duplication Audit (MANDATORY)
Search the entire project for reusable implementations before creating ANY file. Determine if an existing component, hook, layout, or utility can be reused or extended. Only create new files if absolutely necessary. Never duplicate layouts, business logic, hooks, styling, utilities, routing, or contexts. If a reusable solution exists: EXTEND IT. Do NOT replace it.

## Phase 3 — Architecture Review
Produce an Architecture Review before implementation. Include: Current Architecture, Problems Found, Reusable Components, Components to Preserve, Components to Improve, Components to Extend, Components NOT to Touch, Potential Risks, Recommended Solution, Implementation Order. Wait for approval before implementation.

## Phase 4 — Implementation Plan
Produce a detailed implementation roadmap. For every file include: NEW, MODIFIED, UNCHANGED. Explain WHY every file is changing, WHY no redesign is necessary, and HOW the feature extends the current architecture. No code should be written until this plan is approved.

## Phase 5 — Implementation Rules
During implementation:
- Preserve existing architecture, design system, animations, typography, spacing, responsiveness, business logic.
- Improve only what is required.
- Extend existing components whenever possible.
- Never rebuild something that already works.

## Phase 6 — Build Verification (MANDATORY)
After implementation execute:
- `npm run lint`: Zero ESLint errors, warnings, unused imports, React Hook violations, TypeScript lint issues.
- `npm run build`: TypeScript compilation succeeds, Vite production build succeeds, Zero route compilation errors, missing imports, bundling failures.
Resolve ALL issues before proceeding.

## Phase 7 — Runtime Verification (MANDATORY)
Execute `npm run dev`. Verify: Every modified page loads, every route works, buttons/forms/modals function, navigation paths work, no console errors, no runtime exceptions.

## Phase 8 — Functional Verification
Manually verify: User flows, navigation, Auth, CTA behaviour, Search, Filters, Tables, Cards, states (Empty, Loading, Error, Success), and feature-specific behaviour. Nothing should be assumed.

## Phase 9 — Responsive Verification
Verify on: Mobile, Tablet, Laptop, Desktop. Ensure: Layout consistency, spacing, typography scaling, grid behaviour, overflow handling, navigation usability, no visual regressions.

## Phase 10 — Visual Verification
Confirm preservation of: Design language, colour palette, glassmorphism, typography, animations, transitions, luxury branding, component consistency. No unnecessary redesigns.

## Phase 11 — Architecture Validation
Confirm no duplicate components, layouts, hooks, contexts, utilities, routing, business logic. Confirm all new code is modular, reusable, scalable and maintainable.

## Phase 12 — Completion Report
Produce a Final Verification Report containing:
1. Architecture Audit Summary
2. Duplication Audit
3. Architecture Improvements
4. Components Preserved
5. Components Extended
6. Components Created
7. Files Modified
8. Files Created
9. Build Verification Results
10. Runtime Verification Results
11. Functional Verification Results
12. Responsive Verification Results
13. Visual Verification Results
14. Issues Found
15. Issues Fixed
16. Remaining Risks (if any)
17. Future Extension Points
18. Final Architecture Assessment

Do not claim any verification has passed unless it was actually executed. If any check fails: Explain the failure, fix the issue, re-run verification, repeat until pass.

## Mandatory Completion Checklist
The task is NOT complete until all items in the checklist are satisfied:
- **Architecture**: Audited, existing code reviewed/reused/extended, no redesign, no duplication.
- **Implementation**: Feature implemented, styling/UX/responsiveness preserved.
- **Build**: Lint and build pass successfully with zero errors/warnings.
- **Runtime**: Dev environment verified with no errors.
- **Responsive**: All breakpoints verified.
- **Visual**: Design/animations/branding preserved.
- **Architecture**: Modular, reusable, scalable, maintainable.
- **Documentation**: Final Verification Report completed with remaining risks/extension points.
