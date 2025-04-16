declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  export type MotionComponent<P = {}> = React.ForwardRefExoticComponent<
    React.PropsWithChildren<P & MotionProps> & React.RefAttributes<any>
  >;
  
  export interface Motion {
    div: MotionComponent<React.HTMLAttributes<HTMLDivElement>>;
    button: MotionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    span: MotionComponent<React.HTMLAttributes<HTMLSpanElement>>;
    p: MotionComponent<React.HTMLAttributes<HTMLParagraphElement>>;
    // Add other HTML elements as needed
    [key: string]: MotionComponent;
  }
  
  export const motion: Motion;
  export const AnimatePresence: React.FC<{
    exitBeforeEnter?: boolean;
    initial?: boolean;
    onExitComplete?: () => void;
    children?: React.ReactNode;
  }>;
} 