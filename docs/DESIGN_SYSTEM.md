# Design System Documentation

## Card Components

All card components across the site follow a standardized design language based on the profile page designs.

### Standard Card Design Tokens

#### Base Card Styles
- **Background**: `bg-card`
- **Border**: `border-border`
- **Border Radius**: `rounded-xl` (12px)
- **Padding**: 
  - Small: `p-6` (24px)
  - Medium: `p-8` (32px) - **Default**
  - Large: `p-12` (48px)

#### Hover Effects (Interactive Cards)
- **Border**: `hover:border-primary/20`
- **Shadow**: `hover:shadow-lg`
- **Transition**: `transition-all duration-300`

#### Usage Examples

##### Static Content Card
```tsx
<div className="bg-card rounded-xl border border-border p-8">
  {/* Content */}
</div>
```

##### Interactive/Clickable Card
```tsx
<div className="group bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
  {/* Content */}
</div>
```

##### Using StandardCard Component
```tsx
import StandardCard from '@/components/common/StandardCard';

// Static card
<StandardCard>
  {/* Content */}
</StandardCard>

// Interactive card with hover effects
<StandardCard hover>
  {/* Content */}
</StandardCard>

// Large padding card
<StandardCard padding="lg" hover>
  {/* Content */}
</StandardCard>
```

### Standardized Components

#### Fund Cards
- **Location**: `src/components/FundCard.tsx`
- **Style**: Interactive card with hover effects
- **Padding**: `p-8`

#### Recently Viewed Cards
- **Location**: `src/components/RecentlyViewedFunds.tsx`
- **Style**: Interactive card with hover and top accent bar
- **Padding**: `p-8`
- **Special**: Gradient top border on hover

#### Comparison Cards
- **Location**: `src/components/comparisons-hub/ComparisonsList.tsx`
- **Style**: Interactive card with hover effects
- **Padding**: `p-8`

#### Category List Cards
- **Location**: `src/components/categories-hub/CategoriesList.tsx`
- **Style**: Interactive list items with hover effects
- **Padding**: `p-6` (list items)

#### FAQ Cards
- **Location**: `src/components/common/FAQSection.tsx`
- **Style**: Interactive cards with hover effects
- **Padding**: `p-8`

#### Header Cards
- **Location**: Various page headers
- **Style**: Static content cards
- **Padding**: `p-8`

### Shadow System

Cards use a minimal shadow approach:
- **Default**: No shadow
- **Hover**: `shadow-lg` (large shadow)
- **Special cases**: Fund details components use `shadow-sm` as base

### Border System

- **Default**: `border-border` (uses CSS variable from design system)
- **Hover**: `border-primary/20` (20% opacity of primary color)
- **Verified funds**: `border-success/30` with `ring-2 ring-success/30`

### Color Tokens

All colors use semantic tokens from `index.css`:
- `--card`: Background for cards
- `--border`: Default border color
- `--primary`: Primary brand color (used in hovers)
- `--success`: Success/verified indicator
- `--muted`: Muted background areas
- `--foreground`: Main text color
- `--muted-foreground`: Secondary text color

### Typography in Cards

- **Headings**: Use `text-foreground` for primary text
- **Body text**: Use `text-muted-foreground` for secondary text
- **Sizes**: Follow consistent sizing (h2: text-3xl, h3: text-xl, body: text-base)

### Best Practices

1. **Consistency**: Always use the standardized card design
2. **Semantic tokens**: Use design system colors, never hardcoded values
3. **Hover states**: Only add hover effects to interactive/clickable cards
4. **Padding**: Use consistent padding (p-8 for most cards)
5. **Border radius**: Always use rounded-xl for cards
6. **Transitions**: Use `transition-all duration-300` for smooth animations

### Anti-patterns to Avoid

❌ Don't use:
- `rounded-lg` (use `rounded-xl` instead)
- `shadow-sm` as default (use no shadow, add on hover)
- Direct color values like `bg-white`, `border-gray-200`
- Inconsistent padding values
- Different border radius on hover

✅ Do use:
- `rounded-xl` for all cards
- Semantic color tokens
- Consistent padding (p-6, p-8, or p-12)
- Hover effects only on interactive elements
- Design system variables

### Migration Guide

When updating old cards to the new standard:

1. Replace `rounded-lg` → `rounded-xl`
2. Replace `shadow-sm` → remove (add `hover:shadow-lg` if interactive)
3. Add `hover:border-primary/20` for interactive cards
4. Ensure `transition-all duration-300` is present
5. Verify padding is p-6, p-8, or p-12
6. Check all colors use semantic tokens

Example migration:
```tsx
// Before
<div className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md">

// After
<div className="bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
```

## Related Documentation

- [Color System](./COLOR_SYSTEM.md)
- [Typography](./TYPOGRAPHY.md)
- [Component Library](./COMPONENTS.md)
