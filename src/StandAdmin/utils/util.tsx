import React, { Fragment } from 'react';

export function getAutoIdGenerator(base = 0) {
  let baseId = base;

  return () => {
    baseId += 1;
    return baseId;
  };
}

export function waitCondition(options: {
  test: () => boolean;
  interval?: number;
  timeout?: number;
}) {
  const { test, interval = 10, timeout = -1 } = options;

  let timeLast = 10;

  return new Promise<boolean>(function(resolve, reject) {
    (function waitPoll() {
      if (test()) {
        return resolve(true);
      }

      if (timeLast > 0 && timeLast > timeout) {
        console.warn('waitCondition timeout', test);
        reject(new Error('timeout'));
      }

      setTimeout(waitPoll, interval);
      timeLast += interval;
    })();
  });
}

export function markAndMatch() {
  const markMap: Record<string, number> = {};

  const getAutoId = getAutoIdGenerator();

  return (tag: string): [() => boolean, number] => {
    const newTag = getAutoId();

    markMap[tag] = newTag;

    return [
      () => {
        return newTag === markMap[tag];
      },
      newTag,
    ];
  };
}

export function getDisplayName<T>(WrappedComponent: React.ComponentType<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function whyDidYouUpdate(
  componentName: string,
  prevProps: any,
  props: any,
) {
  const allKeys = Object.keys({ ...prevProps, ...props });
  const changedProps: Record<string, any> = {};

  allKeys.forEach(key => {
    if (prevProps![key] !== props[key]) {
      changedProps[key] = {
        from: prevProps![key],
        to: props[key],
      };
    }
  });

  if (Object.keys(changedProps).length) {
    console.log('[why-did-you-update]', componentName, changedProps);
  }
}

export function jsxJoin(nodes: React.ReactNode[], separator: any) {
  const filtered = nodes.filter(Boolean);

  return filtered.length === 0
    ? null
    : filtered.reduce<React.ReactNode[]>((acc, curr, i) => {
        return acc.length
          ? [
              ...acc,
              // Wrap the separator in a fragment to avoid `missing key` issues
              <Fragment key={i}>{separator}</Fragment>,
              curr,
            ]
          : [curr];
      }, []);
}
