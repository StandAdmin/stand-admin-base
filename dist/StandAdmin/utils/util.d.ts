/// <reference types="react" />
export declare function getAutoIdGenerator(base?: number): () => number;
export declare function markAndMatch(): (
  tag: string,
) => [() => boolean, number];
export declare function getDisplayName<T>(
  WrappedComponent: React.ComponentType<T>,
): string;
export declare function whyDidYouUpdate(
  componentName: string,
  prevProps: any,
  props: any,
): void;
