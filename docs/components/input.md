# Input

A text input field with floating label, optional icons, and multiple states.

## Overview

The Input component provides a form input with a floating label that animates when the field is focused or filled. It supports optional left and right icons, helper text, error states, and all standard input types.

## Usage

```jinja
{% with name='email', label='Email Address' %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

## Examples

### Default

Basic text input with floating label.

```jinja
{% with name='username', label='Username' %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Value

Input with a pre-filled value (label stays floated).

```jinja
{% with name='email', label='Email', value='user@example.com' %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Left Icon

Add an icon to the left of the input.

```jinja
{% set icon_user %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
{% endset %}

{% with name='username', label='Username', icon_left=icon_user %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Right Icon

Add an icon to the right of the input.

```jinja
{% set icon_search %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
{% endset %}

{% with name='search', label='Search', icon_right=icon_search %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### With Both Icons

Combine left and right icons.

```jinja
{% set icon_mail %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
{% endset %}

{% set icon_check %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
{% endset %}

{% with name='email', label='Email', icon_left=icon_mail, icon_right=icon_check, value='verified@example.com' %}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

### Search Field

Search input with icon and placeholder behavior.

```jinja
{% set icon_search %}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
{% endset %}

{% with
  name='search',
  label='Search products',
  type='search',
  icon_left=icon_search
%}
  {% include 'components/ui/input.jinja' %}
{% endwith %}
```

## Real-World Examples

### Contact Form

```jinja
<form method="post" action="/contact">
  {% set icon_user %}...{% endset %}
  {% set icon_mail %}...{% endset %}
  {% set icon_phone %}...{% endset %}

  <div class="grid gap-4">
    {% with
      name='name',
      label='Full Name',
      icon_left=icon_user,
      required=true
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}

    {% with
      name='email',
      label='Email Address',
      type='email',
      icon_left=icon_mail,
      autocomplete='email',
      required=true
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}

    {% with
      name='phone',
      label='Phone Number',
      type='tel',
      icon_left=icon_phone,
      autocomplete='tel'
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}

    {% with content='Send Message', variant='filled', size='lg', type='submit' %}
      {% include 'components/ui/button.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Login Form

```jinja
<form method="post" action="/login">
  <div class="flex flex-col gap-4">
    {% with
      name='email',
      label='Email',
      type='email',
      autocomplete='email',
      required=true,
      error=login_error,
      error_message='Invalid email or password'
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}

    {% with
      name='password',
      label='Password',
      type='password',
      autocomplete='current-password',
      required=true
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}

    {% with content='Sign In', variant='filled', size='lg', type='submit', wrapper_class='w-full' %}
      {% include 'components/ui/button.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Shipping Address Form

```jinja
<form method="post" action="/checkout/shipping">
  <div class="grid gap-4">
    <div class="grid gap-4 md:grid-cols-2">
      {% with name='first_name', label='First Name', required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}

      {% with name='last_name', label='Last Name', required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>

    {% with name='address', label='Street Address', required=true %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}

    <div class="grid gap-4 md:grid-cols-3">
      {% with name='city', label='City', required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}

      {% with name='state', label='State / Province', required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}

      {% with name='postal_code', label='Postal Code', required=true %}
        {% include 'components/ui/input.jinja' %}
      {% endwith %}
    </div>

    {% with
      name='phone',
      label='Phone Number',
      type='tel',
      caption='For delivery coordination',
      required=true
    %}
      {% include 'components/ui/input.jinja' %}
    {% endwith %}
  </div>
</form>
```

### Newsletter Signup

```jinja
{% set icon_mail %}...{% endset %}

<form method="post" action="/newsletter/subscribe" class="flex gap-2">
  {% with
    name='email',
    label='Email Address',
    type='email',
    icon_left=icon_mail,
    wrapper_class='flex-1'
  %}
    {% include 'components/ui/input.jinja' %}
  {% endwith %}

  {% with content='Subscribe', variant='filled' %}
    {% include 'components/ui/button.jinja' %}
  {% endwith %}
</form>
```

## API Reference

### Parameters

| Parameter       | Type      | Default | Description                                           |
|----------------|-----------|---------|-------------------------------------------------------|
| `name`         | `string`  | Required| Form field name                                       |
| `label`        | `string`  | Required| Floating label text                                   |
| `type`         | `string`  | `"text"`| Input type (text, email, password, tel, search, etc.) |
| `value`        | `string`  | -       | Initial/current value                                 |
| `id`           | `string`  | Auto    | Input ID (auto-generated if not provided)             |
| `required`     | `boolean` | `false` | Mark as required (shows red asterisk)                 |
| `disabled`     | `boolean` | `false` | Disable the input                                     |
| `readonly`     | `boolean` | `false` | Make input read-only                                  |
| `autocomplete` | `string`  | -       | HTML autocomplete attribute                           |
| `minlength`    | `number`  | -       | Minimum length validation                             |
| `maxlength`    | `number`  | -       | Maximum length validation                             |
| `pattern`      | `string`  | -       | Regex pattern validation                              |
| `icon_left`    | `string`  | -       | HTML/SVG for left icon                                |
| `icon_right`   | `string`  | -       | HTML/SVG for right icon                               |
| `caption`      | `string`  | -       | Helper text below input                               |
| `error_message`| `string`  | -       | Error message (replaces caption)      |
| `wrapper_class`| `string`  | -       | Additional CSS classes for wrapper                    |
| `input_class`  | `string`  | -       | Additional CSS classes for input element              |
| `attrs`        | `string`  | -       | Raw HTML attributes for input                         |

## Accessibility

- Uses semantic `<input>` with proper `type` attribute
- Label is properly associated via `for` attribute
- Required fields are marked with `required` attribute and visual asterisk
- Disabled state prevents interaction
- Error states use color and text to convey meaning
- Supports all standard HTML5 input validation attributes
- Icons use `aria-hidden` implicitly (decorative)
- Focus states are clearly visible
- Fully RTL-aware with logical properties

## Source Code

[`components/ui/input.jinja`](../../components/ui/input.jinja)
