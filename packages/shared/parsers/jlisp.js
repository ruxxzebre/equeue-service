var env0 = Object.create(null),
  QUOTE = Symbol.for("quote"),
  PROGN = Symbol.for("progn"),
  SETQ = Symbol.for("setq"),
  IF = Symbol.for("if"),
  LAMBDA = Symbol.for("lambda");

ev([], []);
function ev(x, env) {
  if (x && x.constructor === Symbol) {
    return env[x][0];
  } else if (x && x.constructor === Array) {
    if (x[0] === QUOTE) return x[1];
    if (x[0] === PROGN) {
      let res = undefined;
      for (let i=1; i<x.length; i++) {
        res = ev(x[i], env);
      }
      return res;
    }
    if (x[0] === SETQ) return (env[x[1]] || (env0[x[1]]=[]))[0] = ev(x[2], env);
    if (x[0] === IF) return ev(x[1], env) ? ev(x[2], env) : ev(x[3], env);
    if (x[0] === LAMBDA) return function(...args) {
      let ne = Object.create(env);
      x[1].forEach((s, i)=>{ ne[s] = [args[i]]; });
      let res = undefined;
      for (let i=2; i<x.length; i++) {
        res = ev(x[i], ne);
      }
      return res;
    }
    return ev(x[0], env).apply(null, x.slice(1).map(y=>ev(y, env)));
  } else {
    return x;
  }
}

class Source {
  constructor(s) {
    this.s = s;
    this.i = 0;
  }
  curr() {
    return this.s[this.i];
  }
  next() {
    return this.s[this.i++];
  }
}

const spaces = "\t\n\r ";
const stopchars = spaces + "()";

const err = (...args) => {
  throw new Error(args.join(" "));
}

function skipSpaces(s) {
  while(spaces.indexOf(s.curr()) >= 0) {
    s.next();
  }
}

function readList(s) {
  if (s.curr() === "(") {
    s.next();
    let res = [];
    for(;;) {
      skipSpaces(s);
      if (!s.curr() || s.curr() === ")") break;
      res.push(read(s));
    }
    if (!s.curr()) err("')' expected", s);
    s.next();
    return res;
  } else {
    err("List expected", s);
  }
}

function readString(s) {
  if (s.curr() === "\"") {
    let res = s.next();
    while (s.curr() && s.curr() !== "\"") {
      if (s.curr() === "\\") res += s.next();
      res += s.next();
    }
    if (!s.curr()) err("'\"' expected", s);
    res += s.next();
    return JSON.parse(res.replace(/\n/g, "\\n"));
  } else {
    err("String expected", s);
  }
}

function readSymbolOrNumber(s) {
  let res = "";
  while (s.curr() && stopchars.indexOf(s.curr()) === -1) {
    res += s.next();
  }
  if (res === "") err("Symbol or number expected", s);
  let v = parseFloat(res);
  // return isNaN(v) ? Symbol.for(res) : v;
  return isNaN(v) ? res : v;
}

const read_table = { "(": readList,
  "\"": readString }

function read(s) {
  skipSpaces(s);
  return (read_table[s.curr()] || readSymbolOrNumber)(s);
}

env0[Symbol.for("+")] = [(x, y) => x + y];
env0[Symbol.for("-")] = [(x, y) => x - y];
env0[Symbol.for("<")] = [(x, y) => x < y];

let text = `
(progn
  (setq fibo (lambda (x)
                (if (< x 2)
                    1
                    (+ (fibo (- x 1))
                       (fibo (- x 2))))))
  (fibo 10))
`;
text;
// let source = new Source(text);
// let test = read(source);

const lispNotationToJSArrays = (text) => read(new Source(text));
const JSArraysToJSON = (arr) => {
  const obj = {};
  if (!Array.isArray(arr)) {
    return arr;
  }
  arr.forEach((item) => {
    if (Array.isArray(item[0])) {
      return;
    } else {
      obj[item[0]] = item.length - 2 === 1 ? item[1] : [...JSArraysToJSON(item.slice(1))];
    }
  });
};

module.exports.lispNotationToJSArrays = lispNotationToJSArrays;
module.exports.JSArraysToJSON = JSArraysToJSON;
