import type { ReactNode, SVGProps } from 'react';

export interface ButtonProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e?: any) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export type IconProps = SVGProps<SVGSVGElement>;

export * from './agent';
export * from './property';
export * from './propertyManager';
export * from './homeServices';
export * from './buyer';
export * from './owner';
export * from './management';
