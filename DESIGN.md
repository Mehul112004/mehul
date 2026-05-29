---
name: Monolithic Slate
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b6b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.7'
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for authority, precision, and high-performance environments. It evokes a "Matte Charcoal Void"—a workspace that feels physically heavy and intellectually sharp. Targeting developers, quantitative analysts, and power users, the aesthetic prioritizes information density and structural clarity over decorative softness.

The visual style is a fusion of **Brutalism** and **Premium Minimalism**. It utilizes rigid structures, heavy structural borders, and a stark monochromatic palette to create a "monolithic" presence. Every element is intentional, immovable, and commanding, providing a sense of permanence and reliability common in mission-critical software.

## Colors

The palette is strictly achromatic, relying on value contrast rather than hue to establish hierarchy.

- **Background (#0C0C0C):** The base void. All layouts emerge from this deep, matte black.
- **Surface (#161616):** Used for elevated containers, cards, and sidebar regions to create subtle tonal separation.
- **Structural Border (#2A2A2A):** The primary tool for defining the grid. Borders are never feathered; they are sharp dividers.
- **Primary Text (#EDEDED):** High-readability off-white to reduce eye strain in dark environments while maintaining impact.
- **Accent/Action (#FFFFFF):** Reserved for interactive states, primary calls-to-action, and focus indicators. In this system, pure white is a high-energy signal.

## Typography

The typography strategy leverages the tension between geometric engineering and technical utility.

- **Space Grotesk** is used for all UI elements, headings, and primary body copy. Its idiosyncratic geometric shapes provide the "engineered" personality required for a high-end tool. Use tighter letter-spacing for large displays.
- **JetBrains Mono** is utilized for metadata, tags, code snippets, and terminal interfaces. It signals "utility" and "data," providing a clear visual distinction between content and system information.

All type should be set with high contrast against the background. Bold weights (600+) are preferred for headers to maintain the "heavy" brand feel.

## Layout & Spacing

This design system employs a **Rigid Geometric Grid**. Layouts must feel architectural and calculated.

- **Grid Model:** A 12-column fixed grid for desktop, transitioning to a 4-column fluid grid for mobile. 
- **Gutter & Border:** Columns are separated by 1px borders (using the #2A2A2A structural color) rather than empty space where possible to reinforce the "structured" feel.
- **Rhythm:** All spacing must be multiples of 4px. Use generous outer margins (40px+) to frame the content "monolith" in the center of the screen.
- **Reflow:** On mobile, complex horizontal data tables or terminal views should transition to independent scrolling regions rather than stacking, preserving the technical integrity of the information.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Hard Outlines** rather than shadows. 

- **Level 0 (Background):** #0C0C0C.
- **Level 1 (Cards/Panels):** #161616 with a 1px solid border of #2A2A2A.
- **Level 2 (Hover/Active):** When an element is focused or active, the border color shifts to #FFFFFF.

Shadows are strictly prohibited. The UI should appear as a series of flat, stacked slabs. Overlays and modals should use a solid #0C0C0C fill with a high-contrast #EDEDED border to distinguish them from the layers beneath.

## Shapes

The shape language is **Sharp and Uncompromising**. 

All buttons, input fields, cards, and containers must have **0px corner radius**. If a softer touch is absolutely required for small-scale interaction (like a radio button or checkbox internal state), a maximum of 2px may be used, though 0px remains the system standard. This lack of curvature reinforces the industrial, heavy-duty nature of the platform.

## Components

### Buttons
Primary buttons are solid #FFFFFF with #0C0C0C text, using **Space Grotesk Bold** in all caps. Secondary buttons are transparent with a 1px #2A2A2A border and #EDEDED text. On hover, secondary buttons transition to a #FFFFFF border.

### Terminal Interface
Terminal views use #0C0C0C background with #EDEDED JetBrains Mono text. The header of the terminal should be a solid #161616 bar with a 1px border. Use a "blinking" block cursor (solid #FFFFFF) for active command lines.

### Timeline
Vertical timelines use a 1px #2A2A2A vertical line. Nodes are **10px x 10px squares** (not circles) filled with #161616 and bordered with #2A2A2A. Active nodes are filled with pure #FFFFFF.

### Input Fields
Inputs are rectangular slabs with a #161616 background and a bottom-only border of #2A2A2A. On focus, the border becomes a full 1px #FFFFFF outline around the entire field.

### Cards
High-contrast containers with 0px radius. Use #161616 for the card body and a dedicated #2A2A2A header area to separate the title from the content. Titles in cards should always be accompanied by a small mono-label in the top right corner.