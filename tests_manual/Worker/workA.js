console.log("WORKING!!!!!!!!!");
console.log("args!!", process.argv.slice(2));

console.log(xxxx);
(async () => {
  setTimeout(() => {
    console.log("works!!! after 500");
  }, 500);
})();

(async () => {
  setTimeout(() => {
    console.log("works!!! after 100");
  }, 100);
})();

(async () => {
  setTimeout(() => {
    console.log("works!!! after 1000");
  }, 1000);
})();
