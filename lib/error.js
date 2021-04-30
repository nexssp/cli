module.exports.stack = (err, line = 1) => {
  let stack = new Error(red(`Argument key ${err} does not exist`)).stack;
  let arr = stack.split("\n");
  // Remove first line as it this handler
  arr.splice(1, 1);
  arr[line] = greyBG(bold(yellow(arr[line])));
  // Color the important line
  stack = arr.join("\n");
  console.error(stack);
};
