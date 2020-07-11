Object.filter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));
