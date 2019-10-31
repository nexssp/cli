//await sleep(100)

module.exports.invert = function(obj) {
  var new_obj = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }

  return new_obj;
};

const sleep = require("util").promisify(setTimeout);

// must be function not () => {}, to work this

Object.defineProperty(Object.prototype, "findByProp", {
  enumerable: false,
  value: function(location, prop, value) {
    return this[location]
      ? this[location].find(e => {
          return e[prop] && e[prop].indexOf(value) === 0;
        })
      : undefined;
  }
});

Object.defineProperty(Object.prototype, "push", {
  enumerable: false,
  value: function push(location, what) {
    if (!this[location]) {
      this[location] = [];
    }

    if (!Array.isArray(this[location])) {
      // if this is not array convert to array to add new value
      this[location] = [this[location]];
    }

    this[location].push(what);
  }
});

Object.defineProperty(Object.prototype, "deleteByProp", {
  enumerable: false,
  value: function(location, prop, value) {
    const found = this[location] && this[location].find(e => e[prop] === value);
    if (found) {
      this[location] = this[location].filter(e => e[prop] !== value);
      return found;
    }
  }
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
  }
});

module.exports.sleep = sleep;
