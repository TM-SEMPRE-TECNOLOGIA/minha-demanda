# General Guidelines

- Prioritize **responsive layout**. Avoid absolute positioning, use **Flexbox** or **Grid**.
- **Dark Mode** is the default.
- Use the **TMS palette**:
  - `#0a192f` — main background
  - `#112240` — secondary background / cards
  - `#1a365d` — borders and dividers
  - `#64ffda` — highlight / primary
  - `#00d4ff` — accent / informative
- Typography: **Inter** and **Roboto**, weights 400–700.
- Maintain consistent visual hierarchy: title → subtitle → body.
- All text must use a **technical and objective tone** (no informalities).
- Prefer **Lucide** icons for visual consistency.

---

# Design System Guidelines

Applicable to the **TMS – Photographic Surveys** app

- Base font-size: **14px**.
- Standard spacing: **8px scale** (4, 8, 16, 24, 32...).
- Borders: **8px** on inputs and buttons, **16px** on cards.
- **Do not use FAB** together with the bottom bar.
- **Maximum of 4 items** in the bottom bar.
- Buttons always with labels in **uppercase** and icons on the left.
- Required fields must have clear visual indication (asterisk or border color).
- Main layout: linear flow → WO → Environments → Capture → Review → Submit.

---

## Button

**Primary Button**

- Use: primary action (e.g., _Submit Survey_)
- Style: background `#64ffda`, text `#0a192f`, hover `#00d4ff`
- One per screen

**Secondary Button**

- Use: auxiliary actions (e.g., _Cancel_, _Back_)
- Style: border `#64ffda`, text `#64ffda`, transparent background

**Tertiary Button**

- Use: less important actions or contextual links
- Style: plain text, color `#00d4ff`

---

## Input Fields

- Labels always visible, never isolated placeholders.
- States:
  - Normal: border `#1a365d`
  - Focus: border `#64ffda`
  - Error: red border `#ff4d4d`
- Email, password, and numeric inputs with indicative icons.

---

## Cards

- Background `#112240`
- Internal padding 16px
- Subtle shadow for emphasis
- Title always in `#e6f1ff`, subtitle in `#8892b0`

---

## Photography Modules

- Captures always displayed in **2x2 grid**.
- Each module must contain:
  - Required thumbnails
  - Status (Pending, Submitted, Review)
  - Capture date/time
- Always display **Add Photo** button in fixed bottom position.

---

## Navigation

- Linear flow controlled by **numbered steps**.
- Avoid dropdown menus with fewer than 3 options.
- Breadcrumbs optional in Manager Panel, not in mobile app.

---

## Date & Time

- Format: `DD/MM/YYYY`
- Time: `HH:mm`

---

## Accessibility

- Minimum contrast 4.5:1
- All buttons must have visible focus
- Alternative text required on icons and images