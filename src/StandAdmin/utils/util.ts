export function getAutoIdGenerator(base = 0) {
  let baseId = base;

  return () => {
    baseId += 1;
    return baseId;
  };
}

export function getDisplayName<T>(WrappedComponent: React.ComponentType<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
