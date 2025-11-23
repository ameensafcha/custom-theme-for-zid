# Button Group

A set of toggle buttons that can work as radio buttons (single selection) or checkboxes (multiple selection).

## Overview

The Button Group component provides a visually connected group of buttons that can be toggled on or off. It supports both single selection (radio behavior) and multiple selection (checkbox behavior), making it perfect for filters, view modes, and option selections.

## Usage

```jinja
{%
  with
  name='view',
  options=[
    {'label': 'Grid', 'value': 'grid'},
    {'label': 'List', 'value': 'list', 'checked': true}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

## Examples

### Default (Connected)

Connected buttons with no spacing between them.

```jinja
{% set options = [
  {'label': 'Option 1', 'value': '1'},
  {'label': 'Option 2', 'value': '2'},
  {'label': 'Option 3', 'value': '3'}
] %}

{% with options=options, name='choice' %}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### With Spacing

Use `separated=true` and add gap classes via `wrapper_class` to add spacing between buttons.

```jinja
{%
  with
  name='view',
  separated=true,
  wrapper_class='gap-2',
  options=[
    {'label': 'Grid', 'value': 'grid'},
    {'label': 'List', 'value': 'list', 'checked': true}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### Icon Only

Icon-only buttons automatically get square sizing (48px × 48px with 8px padding).

```jinja
{% set view_icon_grid %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
{% endset %}
{% set view_icon_list %}
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
{% endset %}

{%
  with
  name='view_mode',
  options=[
    {'icon': view_icon_grid, 'value': 'grid', 'icon_only': true, 'checked': true},
    {'icon': view_icon_list, 'value': 'list', 'icon_only': true}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### Icon with Text

Combine icons with labels by providing both `icon` and `label` properties (without `icon_only`).

```jinja
{% set icon_grid %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
{% endset %}
{% set icon_list %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
{% endset %}

{%
  with
  name='view',
  options=[
    {'icon': icon_grid, 'label': 'Grid', 'value': 'grid', 'checked': true},
    {'icon': icon_list, 'label': 'List', 'value': 'list'}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### Multiple Selection

Use `type='multiple'` for checkbox behavior (multiple selections allowed).

```jinja
{%
  with
  name='filters[]',
  type='multiple',
  separated=true,
  wrapper_class='gap-2',
  options=[
    {'label': 'On Sale', 'value': 'sale'},
    {'label': 'In Stock', 'value': 'in_stock', 'checked': true},
    {'label': 'Free Shipping', 'value': 'free_shipping', 'checked': true}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### With Click Events

Add onclick handlers to individual options.

```jinja
{%
  with
  name='view',
  options=[
    {'label': 'Grid', 'value': 'grid', 'onclick': 'updateView("grid")'},
    {'label': 'List', 'value': 'list', 'onclick': 'updateView("list")'}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### With Data Attributes

Pass custom data attributes to options.

```jinja
{%
  with
  name='sort',
  options=[
    {
      'label': 'Popular',
      'value': 'popular',
      'attrs': 'data-sort="popularity" data-order="desc"'
    },
    {
      'label': 'Newest',
      'value': 'newest',
      'attrs': 'data-sort="created_at" data-order="desc"'
    }
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

### Disabled

Mark specific options as disabled.

```jinja
{%
  with
  name='size',
  options=[
    {'label': 'XS', 'value': 'xs', 'disabled': true},
    {'label': 'S', 'value': 's'},
    {'label': 'M', 'value': 'm', 'checked': true},
    {'label': 'L', 'value': 'l'},
    {'label': 'XL', 'value': 'xl', 'disabled': true}
  ]
%}
  {% include 'components/ui/button-group.jinja' %}
{% endwith %}
```

## Real-World Examples

### Product View Switcher

```jinja
<form method="get" action="/products">
  {% set view_options = [
    {'label': 'Grid View', 'value': 'grid', 'checked': (request.args.get('view') == 'grid')},
    {'label': 'List View', 'value': 'list', 'checked': (request.args.get('view') == 'list')}
  ] %}

  {% with options=view_options, name='view', aria_label='Select product view' %}
    {% include 'components/ui/button-group.jinja' %}
  {% endwith %}
</form>
```

### Product Size Selection

```jinja
<form method="post" action="/cart/add">
  <h3>Select Size</h3>
  {% set size_options = [
    {'label': 'XS', 'value': 'xs', 'disabled': (not product.sizes.xs_available)},
    {'label': 'S', 'value': 's'},
    {'label': 'M', 'value': 'm', 'checked': true},
    {'label': 'L', 'value': 'l'},
    {'label': 'XL', 'value': 'xl', 'disabled': (not product.sizes.xl_available)}
  ] %}

  {% with options=size_options, name='size', aria_label='Select size' %}
    {% include 'components/ui/button-group.jinja' %}
  {% endwith %}

  {% with content='Add to Cart', variant='filled', size='lg', type='submit' %}
    {% include 'components/ui/button.jinja' %}
  {% endwith %}
</form>
```

### Shipping

```jinja
<div class="flex flex-col gap-4">
  <h3>Shipping Speed</h3>
  {% set shipping_options = [
    {'label': 'Standard (5-7 days)', 'value': 'standard', 'checked': true},
    {'label': 'Express (2-3 days) +$10', 'value': 'express'},
    {'label': 'Overnight +$25', 'value': 'overnight'}
  ] %}

  {% with options=shipping_options, name='shipping', aria_label='Select shipping speed' %}
    {% include 'components/ui/button-group.jinja' %}
  {% endwith %}
</div>
```

### Filter Time Range

```jinja
<form method="get" action="/orders">
  <h3>Time Range</h3>
  {% set time_options = [
    {'label': 'Today', 'value': 'today'},
    {'label': 'This Week', 'value': 'week', 'checked': true},
    {'label': 'This Month', 'value': 'month'},
    {'label': 'This Year', 'value': 'year'}
  ] %}

  {% with options=time_options, name='range', aria_label='Select time range' %}
    {% include 'components/ui/button-group.jinja' %}
  {% endwith %}
</form>
```

### Payment Frequency

```jinja
<div class="flex flex-col gap-4">
  <h3>Billing Frequency</h3>
  {% set frequency_options = [
    {'label': 'Monthly', 'value': 'monthly'},
    {'label': 'Quarterly (Save 10%)', 'value': 'quarterly'},
    {'label': 'Annually (Save 20%)', 'value': 'annually', 'checked': true}
  ] %}

  {% with options=frequency_options, name='billing', aria_label='Select billing frequency' %}
    {% include 'components/ui/button-group.jinja' %}
  {% endwith %}
</div>
```

## API Reference

### Parameters

| Parameter       | Type                     | Default    | Description                                              |
|----------------|--------------------------|------------|----------------------------------------------------------|
| `name`         | `string`                 | Required   | Form field name (same for all options in group)          |
| `options`      | `array`                  | Required   | Array of option objects (see Option Object below)        |
| `type`         | `"single" \| "multiple"` | `"single"` | Selection behavior: radio (single) or checkbox (multiple)|
| `separated`    | `boolean`                | `false`    | If true, buttons have full rounded corners. If false, buttons are connected |
| `aria_label`   | `string`                 | -          | Accessible label for the group                           |
| `wrapper_class`| `string`                 | -          | CSS classes for the wrapper (use for gap-* classes, etc.)|
| `attrs`        | `string`                 | -          | Raw HTML attributes for the wrapper (data-*, etc.)       |

### Option Object

Each option in the `options` array should have:

| Property    | Type      | Default  | Description                                       |
|------------|-----------|----------|---------------------------------------------------|
| `label`    | `string`  | -        | Button text (can be combined with `icon`)         |
| `value`    | `string`  | Required | Value submitted when selected                     |
| `icon`     | `string`  | -        | HTML/SVG icon content (can be combined with `label`) |
| `icon_only`| `boolean` | `false`  | If true, hides label and shows only icon (48px square with 8px padding) |
| `checked`  | `boolean` | `false`  | Initial selected state                            |
| `disabled` | `boolean` | `false`  | Disables the option                               |
| `required` | `boolean` | `false`  | Marks as required for validation                  |
| `id`       | `string`  | Auto     | Custom ID (auto: `{name}-{index}`)                |
| `onclick`  | `string`  | -        | JavaScript onclick handler                        |
| `class`    | `string`  | -        | Additional CSS classes for this option            |
| `attrs`    | `string`  | -        | Raw HTML attributes (data-*, aria-*, etc.)        |

## Accessibility

- Uses semantic `<input type="radio">` or `<input type="checkbox">` for native browser support
- Single selection has `role="radiogroup"`, multiple has `role="group"`
- Always provide `aria_label` parameter for screen readers
- Keyboard accessible (Tab, Arrow keys, Space)
- Icon-only buttons should have aria-labels on individual options
- Disabled state prevents interaction
- Visual focus indicators for keyboard navigation
- Connected buttons (separated=false) maintain logical tab order

## Source Code

[`components/ui/button-group.jinja`](../../components/ui/button-group.jinja)
