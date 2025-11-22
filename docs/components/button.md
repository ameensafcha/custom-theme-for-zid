# Button

Displays a button or a component that looks like a button.

## Overview

The Button component is a versatile, reusable UI element that supports multiple variants, sizes, and states. It can render as either a `<button>` or `<a>` tag while maintaining consistent styling.

## Usage

```jinja
{% with content='Click me', variant='filled', size='lg' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

## Variants

### Filled (Default)

Black background with white text. Used for primary actions.

```jinja
{% with content='Add to Cart', variant='filled', size='lg' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Outlined

White background with black border. Used for secondary actions.

```jinja
{% with content='Learn More', variant='outlined', size='lg' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Text

No background or border. Used for tertiary actions or links.

```jinja
{% with content='Cancel', variant='text', size='lg' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

## Sizes

### Large (Default)

16px font size, larger padding. Best for primary CTAs.

```jinja
{% with content='Shop Now', variant='filled', size='lg' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Medium

14px font size, medium padding. Best for cards and lists.

```jinja
{% with content='View Details', variant='outlined', size='md' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Small

12px font size, small padding. Best for compact spaces.

```jinja
{% with content='Edit', variant='text', size='sm' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Icon Buttons

Square buttons with glassmorphism effect for icon-only actions.

**Medium Icon (40x40px):**
```jinja
{% set icon %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/>
  </svg>
{% endset %}
{% with content=icon, size='icon-md', attrs='aria-label="Toggle menu"' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

**Small Icon (32x32px):**
```jinja
{% set small_icon %}
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2"/>
  </svg>
{% endset %}
{% with content=small_icon, size='icon-sm', attrs='aria-label="Close"' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

## Examples

### Button with Icon and Text

Icons and text are automatically spaced based on button size.

```jinja
{% set button_content %}
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2"/>
  </svg>
  Add to Cart
{% endset %}
{% with content=button_content, variant='filled', size='lg' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Link Styled as Button

Use the `href` parameter to render as an `<a>` tag.

```jinja
{% with content='View Products', variant='filled', size='lg', href='/products' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Full Width Button

Add custom classes with the `class` parameter.

```jinja
{% with content='Checkout', variant='filled', size='lg', class='w-full' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Disabled State

Use the `disabled` parameter to disable the button.

```jinja
{% with content='Out of Stock', variant='outlined', size='lg', disabled=true %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### With Data Attributes

Pass custom attributes using the `attrs` parameter.

```jinja
{% with
  content='Add to Cart',
  variant='filled',
  size='lg',
  attrs='data-product-id="123" data-action="add-to-cart" aria-label="Add product to shopping cart"'
%}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Loading State

```jinja
{% set loading_button %}
  <svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
    <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>
  Loading...
{% endset %}
{% with content=loading_button, variant='filled', size='lg', disabled=true %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

## Real-World Examples

### Product Card Button

```jinja
{% with
  content=_("Select options") if product.has_options else _("Add to cart"),
  variant='outlined',
  size='lg',
  class='w-full',
  attrs='data-product-id="' + product.id + '"'
%}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Hero CTA

```jinja
{% with
  content='Shop Collection',
  variant='filled',
  size='lg',
  href='/collections/new-arrivals'
%}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

### Filter Toggle

```jinja
{% set filter_icon %}
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 4h16M5 10h10M8 16h4" stroke="currentColor" stroke-width="2"/>
  </svg>
  {{ _("Filters") }}
{% endset %}
{% with content=filter_icon, variant='outlined', size='md' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

## API Reference

### Parameters

| Parameter    | Type      | Default  | Description                                    |
|--------------|-----------|----------|------------------------------------------------|
| `content`    | `string`  | Required | Button text or HTML content (use `{% set %}`) |
| `variant`    | `string`  | `filled` | Button style: `filled`, `outlined`, `text`     |
| `size`       | `string`  | `lg`     | Button size: `lg`, `md`, `sm`, `icon-md`, `icon-sm` |
| `href`       | `string`  | -        | If set, renders as `<a>` tag                   |
| `type`       | `string`  | `button` | Button type: `button`, `submit`, `reset`       |
| `disabled`   | `boolean` | `false`  | Disables the button                            |
| `aria_label` | `string`  | -        | Accessibility label (required for icon buttons)|
| `class`      | `string`  | -        | Additional CSS classes for button element      |
| `attrs`      | `string`  | -        | Raw HTML attributes (data-*, aria-*, etc.)     |

### States

- **Default**: Normal appearance
- **Hover**: Darker background (filled), subtle background (outlined/text)
- **Active/Pressed**: Even darker background
- **Disabled**: Grayed out, not interactive, `opacity-50`
- **Focus**: Ring outline for keyboard navigation

## Accessibility

- Always include `aria-label` for icon-only buttons
- Use semantic `<button>` for actions, `<a>` for navigation
- Buttons are keyboard accessible (Tab, Enter, Space)
- Disabled state prevents interaction and sets `aria-disabled`
- Focus ring visible for keyboard users


## Customization

### Rounded Buttons

```jinja
{% with content='Pill Button', variant='filled', size='lg', class='rounded-full' %}
  {% include 'components/ui/button.jinja' %}
{% endwith %}
```

## Source Code

[`components/ui/button.jinja`](../../components/ui/button.jinja)
