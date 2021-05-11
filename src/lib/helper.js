//await sleep(100)

const sleep = require("util").promisify(setTimeout);

// must be function not () => {}, to work this

Object.defineProperty(Object.prototype, "findByProp", {
  enumerable: false,
  value: function (location, prop, value) {
    return this[location]
      ? this[location].find((e) => {
          return e[prop] && e[prop].indexOf(value) === 0;
        })
      : undefined;
  },
});

Object.defineProperty(Object.prototype, "deleteByProp", {
  enumerable: false,
  value: function (location, prop, value) {
    const found =
      this[location] && this[location].find((e) => e[prop] === value);
    if (found) {
      this[location] = this[location].filter((e) => e[prop] !== value);
      return found;
    }
  },
});

Object.defineProperty(Object.prototype, "pushUnique", {
  enumerable: false,
  value: function dataAddUnique(location, uniqueProp, what) {
    // console.log("UNIQUE PUSH", uniqueProp, what, location);
    if (this.findByProp(location, uniqueProp, what[uniqueProp])) {
      throw new Error(
        `There is already '${what[uniqueProp]}' in the ${location}`
      );
    }
    this[uniqueProp] = what;
  },
});

module.exports.sleep = sleep;
