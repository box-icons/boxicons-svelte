# @boxicons/svelte

Svelte icon library built from Boxicons SVG files with full tree-shaking support.

## Installation

```bash
npm install @boxicons/svelte
# or
yarn add @boxicons/svelte
# or
pnpm add @boxicons/svelte
```

## Usage

### Basic Usage

```svelte
<script>
  import { Alarm, Twitter, Home } from '@boxicons/svelte';
</script>

<Alarm />
<Twitter />
<Home />
```

### Icon Packs

- **basic** - Outline/regular style icons (default)
- **filled** - Solid/filled style icons
- **brands** - Brand/logo icons

```svelte
<Alarm />
<Alarm pack="filled" />
```

### Sizing

#### Size Presets

```svelte
<Alarm size="xs" />   <!-- 16px -->
<Alarm size="sm" />   <!-- 20px -->
<Alarm size="base" /> <!-- 24px (default) -->
<Alarm size="md" />   <!-- 36px -->
<Alarm size="lg" />   <!-- 48px -->
<Alarm size="xl" />   <!-- 64px -->
<Alarm size="2xl" />  <!-- 96px -->
<Alarm size="3xl" />  <!-- 128px -->
<Alarm size="4xl" />  <!-- 256px -->
<Alarm size="5xl" />  <!-- 512px -->
```

#### Custom Sizing

```svelte
<Alarm width={32} height={32} />
<Alarm width="2rem" height="2rem" />
```

### Colors

```svelte
<Alarm fill="#ff0000" />
<Alarm fill="currentColor" />
```

### Opacity

```svelte
<Alarm opacity={0.5} />
```

### Flip

```svelte
<Alarm flip="horizontal" />
<Alarm flip="vertical" />
```

### Rotate

```svelte
<Alarm rotate={45} />
<Alarm rotate="90deg" />
```

### Remove Padding

```svelte
<Alarm removePadding />
```

### Combining Props

```svelte
<Alarm 
  pack="filled"
  fill="#ffffff"
  opacity={0.8}
  size="lg"
  flip="horizontal"
  rotate={45}
  class="my-icon"
/>
```

## Tree Shaking

Only imported icons are bundled:

```js
// ✅ Only Alarm is bundled
import { Alarm } from '@boxicons/svelte';
```

## Available Icons

- **1884** basic (outline) icons
- **1884** filled icons  
- **295** brand icons

## TypeScript

```ts
import type { BoxIconProps, IconPack, IconSize, FlipDirection } from '@boxicons/svelte';
```

## License

MIT
