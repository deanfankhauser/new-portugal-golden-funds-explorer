# Button System Documentation

## Overview

The button system provides a comprehensive set of variants following the design system tokens. All buttons use semantic colors and consistent styling patterns from the profile page design language.

## Import

```tsx
import { Button } from "@/components/ui/button";
```

## Button Variants

### Primary (Default)
The main call-to-action button with Bordeaux brand color.

```tsx
<Button>Primary Action</Button>
<Button variant="default">Primary Action</Button>
```

**Design Tokens:**
- Background: `bg-primary` (Bordeaux)
- Text: `text-primary-foreground` (White)
- Hover: `hover:bg-primary/90`
- Shadow: `shadow-sm hover:shadow-md`

**Use Cases:**
- Primary actions (Submit, Save, Create)
- Main CTAs on pages
- Important form submissions

---

### Secondary
Secondary actions with muted styling.

```tsx
<Button variant="secondary">Secondary Action</Button>
```

**Design Tokens:**
- Background: `bg-secondary` (Light gray)
- Text: `text-secondary-foreground` (Dark)
- Hover: `hover:bg-secondary/80`
- Shadow: `shadow-sm`

**Use Cases:**
- Secondary actions
- Cancel buttons (non-destructive)
- Alternative options

---

### Outline
Border-only button for less prominent actions.

```tsx
<Button variant="outline">Outline Button</Button>
```

**Design Tokens:**
- Background: `bg-card`
- Border: `border-2 border-border`
- Text: `text-foreground`
- Hover: `hover:bg-muted hover:border-primary/30`

**Use Cases:**
- Filter buttons
- Toggle buttons
- Less important actions
- Comparison/view actions

---

### Ghost
Transparent button for subtle actions.

```tsx
<Button variant="ghost">Ghost Button</Button>
```

**Design Tokens:**
- Background: Transparent
- Text: Inherits from parent
- Hover: `hover:bg-muted hover:text-foreground`

**Use Cases:**
- Navigation items
- Dropdown triggers
- Icon buttons in toolbars
- Subtle interactive elements

---

### Link
Text-only button styled as a link.

```tsx
<Button variant="link">Link Button</Button>
```

**Design Tokens:**
- Background: Transparent
- Text: `text-primary`
- Hover: `hover:underline hover:text-primary/80`
- Underline offset: `underline-offset-4`

**Use Cases:**
- Inline navigation
- Text links in content
- "Learn more" actions

---

### Accent (Bronze)
Accent color button using Bronze brand color.

```tsx
<Button variant="accent">Accent Button</Button>
```

**Design Tokens:**
- Background: `bg-accent` (Bronze)
- Text: `text-accent-foreground` (White)
- Hover: `hover:bg-accent/90`
- Shadow: `shadow-sm hover:shadow-md`

**Use Cases:**
- Special actions
- Feature highlights
- Alternative primary actions

---

### Success
Success state button using green color.

```tsx
<Button variant="success">Success Action</Button>
```

**Design Tokens:**
- Background: `bg-success` (Green)
- Text: `text-success-foreground` (White)
- Hover: `hover:bg-success/90`
- Shadow: `shadow-sm hover:shadow-md`

**Use Cases:**
- Confirm actions
- Approval buttons
- Successful state actions
- "Verified" indicators

---

### Destructive
Destructive actions with red color.

```tsx
<Button variant="destructive">Delete</Button>
```

**Design Tokens:**
- Background: `bg-destructive` (Red)
- Text: `text-destructive-foreground` (White)
- Hover: `hover:bg-destructive/90`
- Shadow: `shadow-sm hover:shadow-md`

**Use Cases:**
- Delete actions
- Remove items
- Destructive operations
- Warnings requiring action

---

## Button Sizes

### Default
Standard size for most use cases.

```tsx
<Button size="default">Default Size</Button>
```

**Dimensions:** `h-11 px-6 py-2.5`

---

### Small
Compact size for tight spaces.

```tsx
<Button size="sm">Small Button</Button>
```

**Dimensions:** `h-9 px-4` with `text-xs`

---

### Large
Prominent size for hero sections.

```tsx
<Button size="lg">Large Button</Button>
```

**Dimensions:** `h-12 px-8` with `text-base`

---

### Extra Large
Maximum size for major CTAs.

```tsx
<Button size="xl">Extra Large</Button>
```

**Dimensions:** `h-14 px-10` with `text-lg`

---

### Icon
Square button for icons only.

```tsx
<Button size="icon" variant="ghost">
  <Search className="h-4 w-4" />
</Button>
```

**Dimensions:** `h-11 w-11`

---

## Button with Icons

Icons automatically receive proper sizing and spacing.

```tsx
import { ArrowRight, Download } from "lucide-react";

// Icon on the right
<Button>
  Download Report
  <Download />
</Button>

// Icon on the left
<Button>
  <ArrowRight />
  Continue
</Button>

// Icon only
<Button size="icon" variant="ghost">
  <Search />
</Button>
```

---

## Common Patterns

### Full Width Button

```tsx
<Button className="w-full">Full Width</Button>
```

### Button Group

```tsx
<div className="flex gap-3">
  <Button variant="outline">Cancel</Button>
  <Button>Confirm</Button>
</div>
```

### Loading State

```tsx
import { Loader2 } from "lucide-react";

<Button disabled>
  <Loader2 className="animate-spin" />
  Loading...
</Button>
```

### As Link

```tsx
import { Link } from "react-router-dom";

<Button asChild>
  <Link to="/funds">View All Funds</Link>
</Button>
```

---

## Design System Tokens

All button variants use semantic tokens from `index.css`:

| Token | Usage |
|-------|-------|
| `--primary` | Primary button background |
| `--primary-foreground` | Primary button text |
| `--secondary` | Secondary button background |
| `--accent` | Accent (Bronze) button background |
| `--success` | Success button background |
| `--destructive` | Destructive button background |
| `--border` | Outline button border |
| `--muted` | Ghost/outline hover states |
| `--foreground` | Default text color |

---

## Accessibility

All buttons include:
- Proper focus states with visible ring
- Disabled state styling
- Keyboard navigation support
- Proper ARIA attributes
- Screen reader support

```tsx
// Accessible button with label
<Button aria-label="Close dialog" size="icon">
  <X />
</Button>
```

---

## Best Practices

### ✅ Do

- Use semantic variants (primary for main actions, outline for secondary)
- Keep button text concise (1-3 words)
- Use icons to enhance meaning
- Provide loading states for async actions
- Use full width buttons in forms
- Follow the visual hierarchy (primary > secondary > outline > ghost)

### ❌ Don't

- Override button styles with custom className
- Use too many primary buttons on one page
- Make ghost buttons the main CTA
- Use destructive variant for non-destructive actions
- Create custom button styles outside the system
- Use inconsistent sizing across related buttons

---

## Migration Examples

### Before (Custom Styles)

```tsx
// ❌ Anti-pattern
<button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-semibold">
  Submit
</button>
```

### After (Using System)

```tsx
// ✅ Correct
<Button>Submit</Button>
```

---

### Before (Inconsistent Styling)

```tsx
// ❌ Anti-pattern
<Button className="bg-card hover:bg-primary hover:text-primary-foreground text-primary border border-primary px-2 py-1 md:px-3 md:py-1 rounded-full">
  Tag
</Button>
```

### After (Using System)

```tsx
// ✅ Correct
<Button variant="outline" size="sm">
  Tag
</Button>
```

---

## Visual Examples

### Page Actions

```tsx
// Hero section
<div className="flex gap-4">
  <Button size="lg">Get Started</Button>
  <Button size="lg" variant="outline">Learn More</Button>
</div>

// Section actions
<div className="flex gap-3">
  <Button>Compare Funds</Button>
  <Button variant="secondary">View Details</Button>
</div>
```

### Form Actions

```tsx
// Form footer
<div className="flex gap-3 justify-end">
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Save Changes</Button>
</div>

// Destructive action
<div className="flex gap-3 justify-end">
  <Button variant="outline">Keep</Button>
  <Button variant="destructive">Delete Account</Button>
</div>
```

### Card Actions

```tsx
// Inside a card component
<div className="mt-6">
  <Button className="w-full">View Fund Details</Button>
</div>

// Multiple card actions
<div className="flex gap-2">
  <Button variant="outline" size="sm" className="flex-1">Compare</Button>
  <Button size="sm" className="flex-1">View Details</Button>
</div>
```

---

## Related Documentation

- [Design System](./DESIGN_SYSTEM.md)
- [Color System](./COLOR_SYSTEM.md)
- [Icons Guide](./ICONS.md)
