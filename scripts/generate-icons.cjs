const fs = require('fs');
const path = require('path');

const SVG_DIR = path.join(path.dirname(require.resolve('@boxicons/core/package.json')), 'svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'icons');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const RESERVED_NAMES = new Set([
  'Component', 'Fragment', 'Element', 'Node', 'Event', 'Error',
  'Function', 'Object', 'Array', 'String', 'Number', 'Boolean',
  'Symbol', 'Map', 'Set', 'Promise', 'Proxy', 'Reflect', 'Date',
  'RegExp', 'JSON', 'Math', 'Intl', 'NaN', 'Infinity', 'undefined',
  'null', 'true', 'false',
]);

function toPascalCase(filename) {
  const name = filename.replace(/^bx-/, '').replace(/\.svg$/, '');
  let result = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  if (/^\d/.test(result)) result = 'Icon' + result;
  if (RESERVED_NAMES.has(result)) result = result + 'Icon';
  return result;
}

function parseSvg(svgContent) {
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const innerContent = innerMatch ? innerMatch[1].trim() : '';
  return { viewBox, innerContent };
}

function escapeForSvelte(str) {
  return str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
}

function readPackSvgs(packName) {
  const packDir = path.join(SVG_DIR, packName);
  if (!fs.existsSync(packDir)) return new Map();
  const files = fs.readdirSync(packDir).filter(f => f.endsWith('.svg'));
  const svgs = new Map();
  for (const file of files) {
    const content = fs.readFileSync(path.join(packDir, file), 'utf8');
    const componentName = toPascalCase(file);
    svgs.set(componentName, { filename: file, content });
  }
  return svgs;
}

function generateComponent(componentName, packs, defaultPack) {
  const packSvgs = {};
  for (const pack of packs) {
    const packDir = path.join(SVG_DIR, pack);
    const files = fs.readdirSync(packDir).filter(f => f.endsWith('.svg'));
    for (const file of files) {
      if (toPascalCase(file) === componentName) {
        const content = fs.readFileSync(path.join(packDir, file), 'utf8');
        const { viewBox, innerContent } = parseSvg(content);
        packSvgs[pack] = { viewBox, content: escapeForSvelte(innerContent) };
        break;
      }
    }
  }
  if (Object.keys(packSvgs).length === 0) return null;

  const pathsObj = JSON.stringify(packSvgs);

  return `<script lang="ts">
  import type { BoxIconProps } from '../types.js';
  import { buildTransform, getSizePixels } from '../utils.js';

  const paths: Record<string, { viewBox: string; content: string }> = ${pathsObj};

  type $$Props = BoxIconProps;

  export let pack: $$Props['pack'] = '${defaultPack}';
  export let fill: $$Props['fill'] = 'currentColor';
  export let opacity: $$Props['opacity'] = undefined;
  export let width: $$Props['width'] = undefined;
  export let height: $$Props['height'] = undefined;
  export let size: $$Props['size'] = 'base';
  export let flip: $$Props['flip'] = undefined;
  export let rotate: $$Props['rotate'] = undefined;
  export let removePadding: $$Props['removePadding'] = false;

  $: iconData = paths[pack || '${defaultPack}'] || paths['${defaultPack}'];
  $: transform = buildTransform(flip, rotate);
  $: resolvedWidth = width ?? getSizePixels(size || 'base');
  $: resolvedHeight = height ?? getSizePixels(size || 'base');
  $: resolvedViewBox = removePadding ? '2 2 20 20' : iconData.viewBox;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={resolvedViewBox}
  width={resolvedWidth}
  height={resolvedHeight}
  {fill}
  {opacity}
  {transform}
  style={transform ? 'transform-origin: center' : undefined}
  {...$$restProps}
>
  {@html iconData.content}
</svg>
`;
}

function generate() {
  console.log('Generating Boxicons Svelte components...\n');
  const basicSvgs = readPackSvgs('basic');
  const filledSvgs = readPackSvgs('filled');
  const brandsSvgs = readPackSvgs('brands');

  console.log('Found ' + basicSvgs.size + ' basic icons');
  console.log('Found ' + filledSvgs.size + ' filled icons');
  console.log('Found ' + brandsSvgs.size + ' brand icons');

  const iconConfigs = new Map();
  for (const name of basicSvgs.keys()) {
    const packs = ['basic'];
    if (filledSvgs.has(name)) packs.push('filled');
    iconConfigs.set(name, { packs, defaultPack: 'basic', isBrandOnly: false });
  }
  for (const name of filledSvgs.keys()) {
    if (!iconConfigs.has(name)) {
      iconConfigs.set(name, { packs: ['filled'], defaultPack: 'filled', isBrandOnly: false });
    }
  }
  for (const name of brandsSvgs.keys()) {
    if (!iconConfigs.has(name)) {
      iconConfigs.set(name, { packs: ['brands'], defaultPack: 'brands', isBrandOnly: true });
    } else {
      iconConfigs.get(name).packs.push('brands');
    }
  }

  console.log('\nGenerating ' + iconConfigs.size + ' unique icon components...\n');

  const exports = [];
  let generated = 0;
  for (const [name, config] of iconConfigs) {
    const component = generateComponent(name, config.packs, config.defaultPack);
    if (component) {
      fs.writeFileSync(path.join(OUTPUT_DIR, name + '.svelte'), component);
      exports.push(name);
      generated++;
      if (generated % 100 === 0) console.log('   Generated ' + generated + ' components...');
    }
  }
  console.log('   Generated ' + generated + ' components total.\n');

  const iconsIndexContent = exports.sort().map(name => "export { default as " + name + " } from './" + name + ".svelte';").join('\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), iconsIndexContent + '\n');
  console.log('Generated icons/index.ts with all exports\n');
  console.log('Successfully generated ' + generated + ' icon components!');
}

generate();
