const parse = (data) => {
  return JSON.parse(data, function (k, v) {
    if (typeof v === "string" && v.startsWith("function(") && v.endsWith("}")) {
      return eval("(" + v + ")");
    }
    return v;
  });
};

const stringify = (content, pretty) =>
  JSON.stringify(
    content,
    (k, v) => (typeof v === "function" ? "" + v : v),
    pretty
  );

function streamData2json(chunk, encoding, callback) {
  if (chunk !== null && typeof chunk === "object") {
    try {
      chunk = JSON.stringify(chunk);
    } catch (e) {
      callback(e);
    }
  }
  callback(null, chunk);
}

function streamJson2data(chunk, encoding, callback) {
  if (encoding === "buffer") {
    chunk = chunk.toString();
  }
  if (chunk === "undefined") chunk = undefined;
  try {
    chunk = JSON.parse(chunk);
  } catch (e) {
    console.error(e);
  }
  callback(null, chunk);
}

function isJson(item) {
  item = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === "object" && item !== null) {
    return true;
  }

  return false;
}

module.exports = { parse, stringify, streamData2json, streamJson2data, isJson };
