/**
 * Returns filter function by rule name
 * @param {string} rule
 */
module.exports.parseFilterRule = (rule) => {
  /**
   * Date should be a Luxon instance
   * @param {DateTime} date
   */
  let parser = null;

  switch (rule) {
    case "weekend": {
      parser = (date) => {
        return [6, 7].includes(date.weekday)
      };
      return parser;
    }
    case "weekend:1": {
      parser = (date) => {
        return [6].includes(date.weekday)
      };
      return parser;
    }
    case "weekend:2": {
      parser = (date) => {
        return [7].includes(date.weekday)
      };
      return parser;
    }
    default: return parser;
  }
}
