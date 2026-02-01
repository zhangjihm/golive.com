# Component Development Guide

This directory is reserved for component-specific CSS files as the project scales.

## When to Create Component Files

Create individual component CSS files when:
- A component becomes complex enough to warrant its own file
- You need to isolate styles for reusability
- Multiple pages use the same complex component
- The main style.css file becomes too large to manage

## Naming Convention

Use kebab-case for component file names:
- `header.css`
- `hero-section.css` 
- `blog-post-card.css`
- `product-card.css`
- `newsletter-form.css`

## Structure Guidelines

Each component file should follow this structure:

```css
/* Component Name
-------------------------------------------------- */

/* Base styles for the component */
.component-name {
  /* base styles */
}

/* Modifier classes */
.component-name--modifier {
  /* modified styles */
}

/* Child elements */
.component-name__child {
  /* child element styles */
}

/* Responsive variations */
@media (min-width: 768px) {
  .component-name {
    /* tablet+ styles */
  }
}
