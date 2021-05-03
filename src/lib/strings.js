// Works like template!! "my ${somevar}".interpolate({somevar:1234})

String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
};

String.prototype.similarity = function(b) {
  var lengthA = this.length;
  var lengthB = b.length;
  var equivalency = 0;
  var minLength = this.length > b.length ? b.length : this.length;
  var maxLength = this.length < b.length ? b.length : this.length;
  for (var i = 0; i < minLength; i++) {
    if (this[i] == b[i]) {
      equivalency++;
    }
  }

  var weight = equivalency / maxLength;
  return weight * 100;
};
