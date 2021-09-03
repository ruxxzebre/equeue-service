const { DateTime } = require('luxon');
const _ = require('lodash');
// const { createRange } = require("../utils/misc");
const { lispNotationToJSArrays } = require('./jlisp');

console.log('Filter LISP Parser.');

const dayToCommonFormat = (date) => {
  const { day, month, year } = date;
  return `${day}-${month < 10 ? `0${month}` : month}-${year}`;
};

const parseDate = (str) => {
  if (!str) return null;
  let dateArray = str.split("-");
  if (dateArray.length !== 3) return null;
  if (
    !(
      dateArray[0].length === 2 &&
      dateArray[1].length === 2 &&
      dateArray[2].length === 4
    )
  )
    return null;
  dateArray = dateArray.map(parseFloat);
  if (dateArray.filter(Boolean).length < 3) return null;
  return DateTime.fromObject({
    day: dateArray[0],
    month: dateArray[1],
    year: dateArray[2],
  });
};

const wrapLibFn = (name, fn) => ({ name, fn });

/**
 * @typedef CommonInstruction
 * @property {string} name
 * @property {any} type
 */

/**
 *
 * @param {CommonInstruction[]} instructions
 * @return {any}
 */
const mapSetterStateInstructions = (instructions, ctx) => {
  if (!Array.isArray(instructions)) return {};
  const obj = {};
  instructions.forEach((i) => obj[i.name] = (arg) => {
    if (i.argRequired && !arg && !i.default) {
      throw new Error(`Argument(s) for ${i.name} is required`);
    }
    if (i.argRequired && !arg && i.default) {
      return ctx.state[i.name] = i.default;
    }
    if (arg && typeof arg === i.argType) {
      return ctx.state[i.name] = arg;
    }
    throw new Error(`Invalid argument type in ${i.name}`);
  });
  return obj;
};

const HIGH_PRIORITY_LIB_FNS = {
  HIGHEST: "include",
  HIGH: "exclude",
};

const runAllFns = (...args) =>
  (input) => {
    const prior1 = args.findIndex(({ name }) => name === HIGH_PRIORITY_LIB_FNS.HIGHEST);
    if (args[prior1] && args[prior1].fn(input)) {
      return true;
    } else {
      delete args[prior1];
    }
    args = args.filter(Boolean);

    return args.reduce((a, c) => {
      const res = c.fn(input);
      return a + res;
    }, 0) === args.length;
  };

/**
 * Sets default state values
 * @param {object} ctx - sharedContext
 * @param {object} ctx.state - state object to map
 */
const mapDefaults = (ctx) => {
  if (!ctx.state.currentDay) ctx.state.currentDay = DateTime.now().day;
  if (!ctx.state.currentMonth) ctx.state.currentMonth = DateTime.now().month;
  if (!ctx.state.currentYear) ctx.state.currentYear = DateTime.now().year;
  if (!ctx.state.entries) ctx.state.entries = [];
}

/**
 * Wrap some outputs into according nested objects
 * @param {object} ctx - sharedContext
 * @param {object} ctx.state - state object to map
 */
const mapContextLocalWrappers = (ctx) => {
  const clone = _.cloneDeep(ctx);
  const stateInEntryForm = Object.entries(clone.state);

  const wrappers = {
    timeRange: ["dayStartsAt", "dayEndsAt", "minuteInterval", "unavailableTimes"],
  };

  for (let wrapperName in wrappers) {
    const wrapper = wrappers[wrapperName];
    ctx.state[wrapperName] = {};
    stateInEntryForm.forEach((entry) => {
      if (wrapper.includes(entry[0]) && entry[1]) {
        ctx.state[wrapperName][entry[0]] = entry[1];
        delete ctx.state[entry[0]];
      }
    });
  }
}

const fns = (ctx) => ({
  dayPreferences: (...args) => {
    ctx.dayReducer = runAllFns(...args);
  },
  /**
   * Result of state instructions output (and temporary
   * the others).
   * Actually accepts the arguments,
   * but all we need is in context, so it's fine to
   * ignore that.
   * @return {*}
   */
  stateDefine: () => {
    mapDefaults(ctx);
    mapContextLocalWrappers(ctx);
    return ctx;
  },
  statePreferences: {
    ...mapSetterStateInstructions([
      { name: "bookingMaxPerEntry", argType: "number", argRequired: false, default: 1 },
      { name: "minuteInterval", argType: "number", argRequired: false, default: 10 },
    ], ctx),
    dayTimeRange: (from, to) =>
      ctx.state = { dayStartsAt: from, dayEndsAt: to, ...ctx.state },
    availableDay: (from, to) => ctx.state = {
      availableDayFrom: from,
      availableDayTo: to,
      ...ctx.state,
    },
  },
  timeGeneratorPreferences: {},
  dayGeneratorPreferences: {
    /**
     *
     * @param {string} indate
     * @return {(function(DateTime): void)|*}
     */
    include: (...indate) => wrapLibFn("include", (date) => {
      const fmt = dayToCommonFormat(date);
      return indate.includes(fmt);
    }),
    exclude: (...indate) => wrapLibFn("exclude",(date) => {
      const fmt = dayToCommonFormat(date);
      return !indate.includes(fmt);
    }),
    notToday: () => wrapLibFn("exclude",(date) => {
      return date.toLocaleString() !== DateTime.now().toLocaleString();
    }),
    /**
     * Checks if date is weekend
     * @param {1 | 2 | undefined} num - saturday (1) or sunday (2)
     * @return {function(DateTime): boolean}
     */
    weekend: (arg) =>
      wrapLibFn("weekend",(date) => {
        if (!isNaN(parseFloat(arg))) {
          const num = arg;
          return (
            [1,2].includes(num) ? [num] : [6, 7]
          ).includes(date.weekday);
        }
        if (arg === "true" || arg === "false") {
          arg = arg === "true";
          return [6, 7].includes(date.weekday) ^ !arg;
        }
    }),
    /**
     * Checks if date's day is in specific range
     * @return {function(DateTime): boolean}
     */
    dayRange: (from, to) =>
      wrapLibFn("dayRange", (date) => {
      return from <= date.day && to < date.day;
    }),
    /**
     * Checks if date is in specific range
     * @return {function(DateTime): boolean}
     */
    dateRange: (from, to) => wrapLibFn("dateRange", (date) => {
      from = parseDate(from);
      to = parseDate(to);
      return from.day <= date.day
        && to.day >= date.day
        && from.month <= date.month
        && to.month >= date.month
        && from.year <= date.year
        && to.year >= date.year;
    }),
    /**
     * Checks if date is in specific range
     * @return {function(DateTime): boolean}
     */
    weekday: (num) => wrapLibFn("weekday", (date) => {
      return date.weekday === num;
    }),
  }
});

const makeCompiler = () => {
  return {
    ctx: null,
    stdlib: null,
    initSTDLib (functionsExpr) {
      if (typeof functionsExpr !== "function") {
        throw new Error("Invalid stdlib.");
      }
      this.stdlib = functionsExpr(this.ctx);
    },
    initCTX (barebone = {}) {
      this.ctx = barebone;
    },
    getLib (name) {
      if (!this.stdlib) {
        throw new Error('STDLIB is not initialized.');
      }
      let fn;
      fn = this.stdlib[name];
      if (!fn) {
        const oneLevelNested = _.get(this.stdlib, _.findKey(this.stdlib, name) + "." + name);
        if (!oneLevelNested)
          throw new Error(`Instruction '${name}' does not exist.`);
        return oneLevelNested;
      }
      return fn;
    },
    convert(q) {
      return lispNotationToJSArrays(q);
    },
    parseInstruction(ins) {
      let { getLib, parseInstruction } = this;
      getLib = getLib.bind(this);
      parseInstruction = parseInstruction.bind(this);
      if (!Array.isArray(ins)) return ins;
      const [fn, ...args] = ins;
      return getLib(fn)(...args.map(parseInstruction));
    },
    compile(q) {
      return this.parseInstruction.call(this, this.convert(q));
    },
  }
};

// eslint-disable-next-line no-unused-vars
const query = `
  (dayPreferences
    (dateRange "12-08-2021" "29-08-2021")
    (weekend)
  )
`;

// TODO: write unit tests

// eslint-disable-next-line no-unused-vars
const stateDefinedByTaskQuery = `
  (stateDefine
    (bookingMaxPerEntry 1)
    (minuteInterval 10)
    (dayTimeRange "09:00" "17:50")
    /* (availableDay "16-08-2021" "16-09-2021") */
    (dayPreferences
      (dateRange "12-08-2021" "29-08-2021")
      (exclude "24-08-2021" "25-08-2021" "27-08-2021")
      (include "29-08-2021")
      (weekend false)
    )
    /* TODO
    (timePreferences
      (timeRange "9:00" "17:50")
      (unavailableTimeRanges
        (time "14:00" "15:00")
        (time "11:00" "12:00")
      )
      (minuteInterval 10)
    )
    */
    (availableDay "16-08-2021" "16-09-2021")
  )
`;

const compiler = makeCompiler();
compiler.initCTX({
  state: {},
});
compiler.initSTDLib(fns);

const output = compiler.compile(stateDefinedByTaskQuery);
console.log(output);
// console.log(lispNotationToJSArrays(stateDefinedByTaskQuery));

// console.log(output.dayReducer(DateTime.now()));

// console.log(compiler.compile(query)(DateTime.now()));
//
// module.exports.getFilter = (q) => parseInstruction(translateInstruction(q));

module.exports.makeCompiler = makeCompiler;
module.exports.compiler = compiler;
module.exports.fns = fns;
