if (!Object.fromEntries) {
  Object.fromEntries = (l) => l.reduce((a, [k, v]) => ({ ...a, [k]: v }), {});
}

Object.filter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));
