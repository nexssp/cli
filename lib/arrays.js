Array.prototype.remove = function (item) {
  var index = this.indexOf(item);
  if (index !== -1) this.splice(index, 1);
  return this;
};

Object.defineProperty(Array.prototype, "flat", {
  value: function (depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  },
});
