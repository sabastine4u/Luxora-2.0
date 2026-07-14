import type { ReactNode, SVGProps } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export type IconProps = SVGProps<SVGSVGElement>;

export * from './agent';
