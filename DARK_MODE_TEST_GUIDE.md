# Dark Mode Color Scheme — Testing Guide

## How to Test the Changes

### 1. **Enable Dark Mode**
On the live site: https://autoshop-ashen.vercel.app
- Look for the theme toggle in the top-right navigation
- Click the sun/moon icon to switch between light and dark modes
- Your preference is saved to localStorage

### 2. **Visual Inspection Checklist**

#### Background & Surfaces
- [ ] Dark mode background is deep but not pure black (should feel sophisticated)
- [ ] Cards have clear visual separation from the background
- [ ] Hover states on cards are visible but subtle
- [ ] Form fields have clearly visible borders

#### Text Readability
- [ ] Primary text (headings, body) is clear and easy to read
- [ ] Secondary text (descriptions, muted labels) is distinguishable but subordinate
- [ ] Muted text (breadcrumbs, helper text) is still readable, not faded out
- [ ] Links and accents (red) stand out against the dark background

#### Component-Specific Tests

**Navigation Bar**
- [ ] Navigation links are clearly readable
- [ ] Hover underline animation is smooth
- [ ] Search bar placeholder text is visible
- [ ] Mobile hamburger menu is visible

**Cards (Vehicles, Parts, Services)**
- [ ] Card title is clear
- [ ] Card price is prominent and readable
- [ ] Badges (status, category) are visible
- [ ] Hover shadow effect is subtle but noticeable

**Form Elements**
- [ ] Input fields have visible borders
- [ ] Focused input has clear visual indication
- [ ] Labels are readable above inputs
- [ ] Error states (if any) are visible

**Buttons**
- [ ] Primary button (red) stands out
- [ ] Secondary button outline is visible
- [ ] Hover state is smooth
- [ ] Text inside buttons is readable

**Tables & Lists**
- [ ] Row borders separate items clearly
- [ ] Alternating rows (if any) have subtle contrast
- [ ] Borders are not too bright or too dim

**Footer**
- [ ] Text is readable against dark background
- [ ] Links are distinguishable
- [ ] Bottom border/divider is visible

### 3. **Device Testing**

Test across:
- [ ] Desktop (Chrome/Firefox/Safari)
- [ ] iPad/Tablet in portrait and landscape
- [ ] iPhone/Android phone (especially important!)

### 4. **Accessibility Check**

Run Chrome DevTools Lighthouse:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run "Accessibility" audit
4. Check that all elements meet contrast ratios:
   - Large text: **3:1** minimum
   - Normal text: **4.5:1** minimum
   - UI components: **3:1** minimum

Expected result: All checks should pass (green checkmarks)

### 5. **Specific Color Verification**

If you want to verify exact colors:

**Light Mode (Baseline)**
```
Background:     #FFFFFF
Text:           #1A1E24
Secondary Text: #475569
Accent:         #E51B24 (red)
Borders:        #E5E7EB
```

**Dark Mode (Updated)**
```
Background:     #0B0F1A
Text:           #F0F4F8
Secondary Text: #CBD5E1
Muted Text:     #94A3B8
Accent:         #E51B24 (red — same)
Borders:        #2A3654
Surfaces:       #131823
```

Use Chrome DevTools Inspector to verify:
1. Right-click on element → Inspect
2. In Styles panel, check computed values
3. Look for CSS variables in format `var(--text)`, `var(--bg)`, etc.
4. Hover over color swatches to see hex values

### 6. **Known Things to Look For**

These should now be **fixed**:
- ✓ Amber badges now display (was undefined variable)
- ✓ Secondary text is now readable in dark mode (was too dim)
- ✓ Muted text (like breadcrumbs) now visible (was `#475569`, now `#94A3B8`)
- ✓ Card surfaces have better separation from background
- ✓ Form borders are now clearly visible

These should be **unchanged** (good):
- ✓ Red accent color remains `#E51B24` across both modes
- ✓ Light mode colors unchanged
- ✓ Brand appearance consistent

### 7. **Browser DevTools Contrast Checker**

Chrome DevTools has a built-in contrast checker:
1. Right-click element → Inspect
2. Go to Elements → Computed
3. Click the color swatch next to a text/background color
4. Scroll to "Contrast ratio" section
5. Should show at least **4.5:1** for normal text

---

## Reporting Issues

If you notice:
- Text that's hard to read
- Colors that look mismatched between pages
- Buttons or links that aren't visible
- Borders that are too subtle or too harsh

Create an issue with:
1. **Screenshot** (dark mode enabled)
2. **Component name** (e.g., "Vehicle Card", "Search Bar")
3. **Browser** (Chrome/Safari/Firefox + version)
4. **Device** (desktop/iPad/iPhone + model)
5. **Description** of the contrast/visibility issue

---

## Color Harmony Verification

The color palette should feel:
- ✓ **Cohesive** - Red accent pops against dark background
- ✓ **Professional** - No harsh transitions or jarring color shifts
- ✓ **Readable** - All text is clear at normal viewing distance
- ✓ **Accessible** - Meets WCAG AA standards (4.5:1 contrast minimum)
- ✓ **Consistent** - Same colors across all pages and components

---

## Technical Details

All changes are in: `frontend/app/globals.css`

Search for `.dark {` to see the updated dark mode variables.

**CSS Variable System:**
- `:root` selector = light mode defaults
- `.dark` selector = dark mode overrides
- Applied automatically when user toggles theme

No component changes needed—all colors respond automatically!

---

## Questions?

Check the main docs:
- `QUICK_REFERENCE.md` - Development quick reference
- `README.md` - General project information
- `COLOR_SCHEME_FIXES.md` - Detailed explanation of all changes
