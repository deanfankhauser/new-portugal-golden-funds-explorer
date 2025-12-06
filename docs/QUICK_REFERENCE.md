# Design System Quick Reference

Quick reference guide for common design system patterns.

## Buttons

```tsx
import { Button } from "@/components/ui/button";

// Primary action
<Button>Submit</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Outline style
<Button variant="outline">Filter</Button>

// Subtle action
<Button variant="ghost">Menu</Button>

// Link style
<Button variant="link">Learn More</Button>

// Accent (Bronze)
<Button variant="accent">Special</Button>

// Success state
<Button variant="success">Approve</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icon
<Button>
  <Download />
  Download
</Button>

// Icon only
<Button size="icon" variant="ghost">
  <Search />
</Button>
```

## Cards

```tsx
import StandardCard from "@/components/common/StandardCard";

// Static card
<StandardCard>
  <h3>Title</h3>
  <p>Content</p>
</StandardCard>

// Interactive card
<StandardCard hover>
  <h3>Clickable Card</h3>
</StandardCard>

// Large padding
<StandardCard padding="lg">
  <h2>Hero Content</h2>
</StandardCard>

// Manual card styling
<div className="bg-card rounded-xl border border-border p-8">
  Content
</div>

// Interactive card
<div className="group bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
  Interactive Content
</div>
```

## FAQ Sections

```tsx
import FAQSection from "@/components/common/FAQSection";

const faqs = [
  {
    question: "What is the minimum investment?",
    answer: "The minimum investment is €500,000."
  }
];

<FAQSection 
  faqs={faqs}
  title="Frequently Asked Questions"
  schemaId="my-faq"
/>
```

## Typography

```tsx
// Page titles
<h1 className="text-3xl md:text-4xl font-bold text-foreground">
  Page Title
</h1>

// Section titles
<h2 className="text-2xl md:text-3xl font-semibold text-foreground">
  Section Title
</h2>

// Card titles
<h3 className="text-xl font-semibold text-foreground">
  Card Title
</h3>

// Body text
<p className="text-base text-foreground">
  Main content
</p>

// Secondary text
<p className="text-muted-foreground">
  Supporting text
</p>
```

## Icons

```tsx
import { Search, Download, Settings } from "lucide-react";

// Standard size (matches text)
<Search className="h-4 w-4" />

// Medium size
<Download className="h-5 w-5" />

// Large size
<Settings className="h-6 w-6" />

// With color
<Search className="h-4 w-4 text-primary" />
```

## Spacing

```tsx
// Padding
<div className="p-6">   {/* Small - 24px */}
<div className="p-8">   {/* Medium - 32px (default) */}
<div className="p-12">  {/* Large - 48px */}

// Margin
<div className="mb-6">  {/* 24px */}
<div className="mb-8">  {/* 32px */}
<div className="mb-12"> {/* 48px */}

// Gap
<div className="flex gap-4">  {/* 16px */}
<div className="flex gap-6">  {/* 24px */}
<div className="flex gap-8">  {/* 32px */}
```

## Colors

```tsx
// Background
<div className="bg-card">         {/* Card background */}
<div className="bg-background">   {/* Page background */}
<div className="bg-muted">        {/* Muted area */}

// Text
<p className="text-foreground">         {/* Primary text */}
<p className="text-muted-foreground">   {/* Secondary text */}
<p className="text-primary">            {/* Primary color */}

// Borders
<div className="border border-border">     {/* Default border */}
<div className="border-primary/20">        {/* Primary with opacity */}

// Interactive states
<div className="hover:bg-muted">           {/* Hover background */}
<div className="hover:border-primary/20">  {/* Hover border */}
<div className="hover:text-primary">       {/* Hover text */}
```

## Border Radius

```tsx
<div className="rounded-lg">   {/* 8px - buttons */}
<div className="rounded-xl">   {/* 12px - cards (standard) */}
<div className="rounded-2xl">  {/* 16px - large cards */}
<div className="rounded-full"> {/* Full - pills/circles */}
```

## Shadows

```tsx
// No shadow (default for cards)
<div className="shadow-none">

// Small shadow (subtle depth)
<div className="shadow-sm">

// Medium shadow (hover state)
<div className="shadow-md">

// Large shadow (elevated state)
<div className="shadow-lg">

// Hover pattern
<div className="hover:shadow-lg">
```

## Transitions

```tsx
// Standard transition (use everywhere)
<div className="transition-all duration-300">

// Specific property
<div className="transition-colors duration-200">

// Transform on hover
<div className="hover:translate-y-[-2px] transition-transform">
```

## Common Patterns

### Page Header

```tsx
<div className="bg-card p-8 rounded-xl border border-border mb-8">
  <div className="flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-primary mr-2" />
    <span className="text-sm bg-muted px-3 py-1 rounded-full">Badge</span>
  </div>
  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
    Page Title
  </h1>
  <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center">
    Description text
  </p>
</div>
```

### Section Header

```tsx
<div className="flex items-center gap-3 mb-12">
  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
    <Icon className="h-5 w-5 text-primary" />
  </div>
  <h2 className="text-3xl font-semibold text-foreground">
    Section Title
  </h2>
</div>
```

### Form Actions

```tsx
<div className="flex gap-3 justify-end">
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Save Changes</Button>
</div>
```

### Empty State

```tsx
<div className="bg-card rounded-xl border border-border p-12 text-center">
  <h3 className="text-2xl font-semibold mb-3">No Items Found</h3>
  <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
    Description of empty state
  </p>
  <Button onClick={handleAction}>
    Call to Action
  </Button>
</div>
```

### Loading State

```tsx
import { Loader2 } from "lucide-react";

<div className="flex items-center justify-center py-12">
  <div className="flex items-center gap-2 text-muted-foreground">
    <Loader2 className="w-6 h-6 animate-spin" />
    <span>Loading...</span>
  </div>
</div>
```

## Anti-Patterns (Don't Do This)

```tsx
// ❌ Direct colors
<div className="bg-white text-black border-gray-200">

// ✅ Use semantic tokens
<div className="bg-card text-foreground border-border">

// ❌ Inconsistent border radius
<div className="rounded-md">

// ✅ Use standard radius
<div className="rounded-xl">

// ❌ Custom button styles
<button className="bg-red-500 px-4 py-2 rounded">

// ✅ Use Button component
<Button variant="destructive">Delete</Button>

// ❌ Hardcoded spacing
<div style={{ padding: '25px' }}>

// ✅ Use Tailwind classes
<div className="p-6">
```

## Resources

- [Full Button Documentation](./BUTTON_SYSTEM.md)
- [Card Design Guide](./DESIGN_SYSTEM.md)
- [Color System](./COLOR_SYSTEM.md)
- [Component Library](./COMPONENTS.md)
