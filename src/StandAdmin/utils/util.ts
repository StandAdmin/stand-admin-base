export function getAutoIdGenerator(base = 0) {
  let baseId = base;

  return () => {
    baseId += 1;
    return baseId;
  };
}

export function markAndMatch() {
  const markMap: { [key: string]: number } = {};

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
  const changedProps: { [key: string]: any } = {};

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
