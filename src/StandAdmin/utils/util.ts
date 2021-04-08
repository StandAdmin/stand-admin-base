export function getAutoIdGenerator(base = 0) {
  let baseId = base;

  return () => {
    baseId += 1;
    return baseId;
  };
}
