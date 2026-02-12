import type { SVGAttributes } from 'svelte/elements';

export type IconPack = 'basic' | 'filled' | 'brands';

export type FlipDirection = 'horizontal' | 'vertical';

export type IconSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export interface BoxIconProps extends SVGAttributes<SVGSVGElement> {
  pack?: IconPack;
  fill?: string;
  opacity?: number | string;
  width?: number | string;
  height?: number | string;
  size?: IconSize;
  flip?: FlipDirection;
  rotate?: number | string;
  removePadding?: boolean;
}

export interface IconConfig {
  name: string;
  packs: IconPack[];
  defaultPack: IconPack;
  isBrandOnly: boolean;
}
