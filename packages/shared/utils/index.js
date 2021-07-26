const enumIncludes = (object, value) => {
  if (typeof object !== "object") return false;
  return Object.values(object).includes(value);
}

module.exports.enumIncludes = enumIncludes;
