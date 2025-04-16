// This file provides temporary type declarations to resolve module import issues

declare module 'zod' {
  export const z: {
    string: () => any;
    object: (schema: any) => any;
    literal: (value: any) => any;
  };
  export function string(): any;
  export function object(schema: any): any;
  export function literal(value: any): any;
  export type infer<T> = any;
}

declare module '@hookform/resolvers/zod' {
  export const zodResolver: (schema: any) => any;
} 