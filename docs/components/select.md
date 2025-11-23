# Select

A native select dropdown with floating label and native HTML5 validation.

## Overview

The Select component provides a native `<select>` element styled consistently with the Input component. It features a floating label that animates when an option is selected, native HTML5 validation, helper text, and is fully RTL-aware.

## Usage

```jinja
{%
  with
  name='country',
  label='Country',
  options=[
    {'value': 'sa', 'label': 'Saudi Arabia'},
    {'value': 'ae', 'label': 'United Arab Emirates'},
    {'value': 'eg', 'label': 'Egypt'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

## Examples

### Default

Basic select with floating label.

```jinja
{%
  with
  name='size',
  label='Size',
  options=[
    {'value': 's', 'label': 'Small'},
    {'value': 'm', 'label': 'Medium'},
    {'value': 'l', 'label': 'Large'},
    {'value': 'xl', 'label': 'Extra Large'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

### With Selected Value

Select with a pre-selected option (label stays floated).

```jinja
{%
  with
  name='country',
  label='Country',
  value='sa',
  options=[
    {'value': 'sa', 'label': 'Saudi Arabia'},
    {'value': 'ae', 'label': 'UAE'},
    {'value': 'eg', 'label': 'Egypt'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

### Required Field

Mark fields as required with a red asterisk. Validation error styling appears automatically after user interaction.

```jinja
{%
  with
  name='shipping_method',
  label='Shipping Method',
  required=true,
  error_message='Please select a shipping method',
  options=[
    {'value': 'standard', 'label': 'Standard (5-7 days)'},
    {'value': 'express', 'label': 'Express (2-3 days)'},
    {'value': 'overnight', 'label': 'Overnight'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

### With Caption

Add helper text below the select.

```jinja
{%
  with
  name='payment_method',
  label='Payment Method',
  caption='Choose your preferred payment method',
  options=[
    {'value': 'card', 'label': 'Credit Card'},
    {'value': 'paypal', 'label': 'PayPal'},
    {'value': 'cod', 'label': 'Cash on Delivery'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

### Native Validation (Error State)

The component uses native HTML5 validation. Error styling appears automatically after user interaction (`:user-invalid` pseudo-class).

```jinja
{%
  with
  name='country',
  label='Country',
  required=true,
  error_message='Please select a country',
  options=[
    {'value': 'sa', 'label': 'Saudi Arabia'},
    {'value': 'ae', 'label': 'UAE'},
    {'value': 'eg', 'label': 'Egypt'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

**Note:** Red error styling only appears after the user interacts with the field (selects and clears, or tries to submit the form). This prevents showing errors on page load.

### Disabled State

Disabled select with gray background.

```jinja
{%
  with
  name='subscription',
  label='Subscription Plan',
  value='premium',
  disabled=true,
  options=[
    {'value': 'free', 'label': 'Free'},
    {'value': 'premium', 'label': 'Premium'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

### With Disabled Options

Mark specific options as disabled without disabling the entire select.

```jinja
{%
  with
  name='size',
  label='Select Size',
  options=[
    {'value': 'xs', 'label': 'Extra Small (Out of Stock)', 'disabled': true},
    {'value': 's', 'label': 'Small'},
    {'value': 'm', 'label': 'Medium'},
    {'value': 'l', 'label': 'Large'},
    {'value': 'xl', 'label': 'Extra Large (Out of Stock)', 'disabled': true}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

### Using `selected` Property

Alternative way to mark an option as selected.

```jinja
{%
  with
  name='priority',
  label='Priority',
  options=[
    {'value': 'low', 'label': 'Low'},
    {'value': 'medium', 'label': 'Medium', 'selected': true},
    {'value': 'high', 'label': 'High'}
  ]
%}
  {% include 'components/ui/select.jinja' %}
{% endwith %}
```

## Real-World Examples

### Shipping Form

```jinja
<form method="post" action="/checkout/shipping">
  <div class="grid gap-4">
    {%
      with
      name='country',
      label='Country',
      required=true,
      error_message='Please select a country',
      options=[
        {'value': 'sa', 'label': 'Saudi Arabia'},
        {'value': 'ae', 'label': 'United Arab Emirates'},
        {'value': 'kw', 'label': 'Kuwait'},
        {'value': 'qa', 'label': 'Qatar'}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {%
      with
      name='city',
      label='City',
      required=true,
      error_message='Please select a city',
      options=[
        {'value': 'riyadh', 'label': 'Riyadh'},
        {'value': 'jeddah', 'label': 'Jeddah'},
        {'value': 'dammam', 'label': 'Dammam'}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {%
      with
      name='shipping_method',
      label='Shipping Method',
      required=true,
      caption='Estimated delivery time',
      options=[
        {'value': 'standard', 'label': 'Standard Shipping (5-7 days)'},
        {'value': 'express', 'label': 'Express Shipping (2-3 days) +SR 20'},
        {'value': 'overnight', 'label': 'Overnight (Next day) +SR 50'}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {% with content='Continue to Payment', variant='filled', size='lg', type='submit', class='w-full' %}
      {% include 'components/ui/button.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Product Options

```jinja
<form method="post" action="/cart/add">
  <div class="flex flex-col gap-4">
    <h3 class="text-lg font-semibold">{{ product.title }}</h3>

    {%
      with
      name='size',
      label='Select Size',
      required=true,
      error_message='Please select a size',
      options=[
        {'value': 'xs', 'label': 'XS', 'disabled': not product.sizes.xs_available},
        {'value': 's', 'label': 'S'},
        {'value': 'm', 'label': 'M', 'selected': true},
        {'value': 'l', 'label': 'L'},
        {'value': 'xl', 'label': 'XL', 'disabled': not product.sizes.xl_available}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {%
      with
      name='color',
      label='Select Color',
      required=true,
      error_message='Please select a color',
      options=[
        {'value': 'black', 'label': 'Black'},
        {'value': 'white', 'label': 'White'},
        {'value': 'navy', 'label': 'Navy Blue'}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {%
      with
      name='quantity',
      label='Quantity',
      value='1',
      options=[
        {'value': '1', 'label': '1'},
        {'value': '2', 'label': '2'},
        {'value': '3', 'label': '3'},
        {'value': '5', 'label': '5'},
        {'value': '10', 'label': '10'}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {% with content='Add to Cart', variant='filled', size='lg', type='submit', class='w-full' %}
      {% include 'components/ui/button.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Account Settings

```jinja
<form method="post" action="/account/settings">
  <div class="grid gap-6">
    <div class="grid gap-4 md:grid-cols-2">
      {%
        with
        name='language',
        label='Language',
        value=user.language,
        options=[
          {'value': 'en', 'label': 'English'},
          {'value': 'ar', 'label': 'العربية'}
        ]
      %}
        {% include 'components/ui/select.jinja' %}
      {% endwith %}

      {%
        with
        name='timezone',
        label='Timezone',
        value=user.timezone,
        options=[
          {'value': 'asia/riyadh', 'label': 'Riyadh (GMT+3)'},
          {'value': 'asia/dubai', 'label': 'Dubai (GMT+4)'},
          {'value': 'europe/london', 'label': 'London (GMT+0)'}
        ]
      %}
        {% include 'components/ui/select.jinja' %}
      {% endwith %}
    </div>

    {%
      with
      name='notification_frequency',
      label='Email Notifications',
      caption='How often would you like to receive updates?',
      value=user.notification_frequency,
      options=[
        {'value': 'realtime', 'label': 'Real-time'},
        {'value': 'daily', 'label': 'Daily Digest'},
        {'value': 'weekly', 'label': 'Weekly Summary'},
        {'value': 'never', 'label': 'Never'}
      ]
    %}
      {% include 'components/ui/select.jinja' %}
    {% endwith %}

    {% with content='Save Changes', variant='filled', type='submit' %}
      {% include 'components/ui/button.jinja' %}
    {% endwith %}
  </div>
</form>
```

## API Reference

### Parameters

| Parameter       | Type      | Default | Description                                           |
|----------------|-----------|---------|-------------------------------------------------------|
| `name`         | `string`  | Required| Form field name                                       |
| `label`        | `string`  | Required| Floating label text                                   |
| `options`      | `array`   | Required| Array of option objects (see Option Object below)    |
| `value`        | `string`  | -       | Selected value                                        |
| `id`           | `string`  | Auto    | Select ID (auto-generated if not provided)            |
| `required`     | `boolean` | `false` | Mark as required (shows red asterisk)                 |
| `disabled`     | `boolean` | `false` | Disable the select                                    |
| `autocomplete` | `string`  | -       | HTML autocomplete attribute                           |
| `multiple`     | `boolean` | `false` | Allow multiple selections                             |
| `caption`      | `string`  | -       | Helper text below select                              |
| `error_message`| `string`  | -       | Error message (displayed when validation fails)       |
| `wrapper_class`| `string`  | -       | Additional CSS classes for wrapper                    |
| `select_class` | `string`  | -       | Additional CSS classes for select element             |
| `attrs`        | `string`  | -       | Raw HTML attributes for select                        |

### Option Object

Each option in the `options` array:

| Property   | Type      | Default | Description                        |
|-----------|-----------|---------|-------------------------------------|
| `value`   | `string`  | Required| Option value                        |
| `label`   | `string`  | Required| Option display text                 |
| `selected`| `boolean` | `false` | Mark as selected                    |
| `disabled`| `boolean` | `false` | Disable this option                 |

### Examples:

```jinja
{# Simple options #}
options=[
  {'value': 's', 'label': 'Small'},
  {'value': 'm', 'label': 'Medium', 'selected': true},
  {'value': 'l', 'label': 'Large'}
]

{# With disabled options #}
options=[
  {'value': 'xs', 'label': 'XS (Out of Stock)', 'disabled': true},
  {'value': 's', 'label': 'S'},
  {'value': 'm', 'label': 'M'}
]
```

### Browser Support:

`:user-invalid` is supported in:
- ✅ Chrome 119+
- ✅ Safari 16.5+
- ✅ Firefox 88+

For older browsers, validation still works (form won't submit), but error styling won't appear until form submission.

## Accessibility

- Uses semantic `<select>` with native dropdown functionality
- Label is properly associated via `for` attribute
- Required fields are marked with `required` attribute and visual asterisk
- Disabled state prevents interaction
- Error states use color and text to convey meaning
- Supports keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Works with screen readers
- Native validation provides accessible error messages

## Source Code

[`components/ui/select.jinja`](../../components/ui/select.jinja)
