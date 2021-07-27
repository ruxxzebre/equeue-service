const enumIncludes = (object, value) => {
  if (typeof object !== "object") return false;
  return Object.values(object).includes(value);
}

function createRange(from, to) {
  if (to <= from) return [];
  return Array(to + 1 - from)
    .fill(0)
    .map((_, idx) => from + idx);
}

module.exports.enumIncludes = enumIncludes;
module.exports.createRange = createRange;
