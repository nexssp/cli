//await sleep(100)

module.exports.invert = function (obj) {
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

// Below was for NodeJS 10
// if (!Array.prototype.flat) {
//   Array.prototype.flat = function (depth) {
//     var flattend = [];
//     (function flat(array, depth) {
//       for (let el of array) {
//         if (Array.isArray(el) && depth > 0) {
//           flat(el, depth - 1);
//         } else {
//           flattend.push(el);
//         }
//       }
//     })(this, Math.floor(depth) || 1);
//     return flattend;
//   };
// }

module.exports.sleep = sleep;
