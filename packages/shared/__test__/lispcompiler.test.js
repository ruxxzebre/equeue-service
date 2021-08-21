const { makeCompiler, fns } = require("../parsers/flisp");

describe('Task', () => {
  let compiler;
  beforeEach(() => {
    compiler = makeCompiler();
    compiler.initCTX({
      state: {},
    });
    compiler.initSTDLib(fns);
  });

  test('Compile state config with root instruction and single nested one', () => {
    const lispString = `
      (stateDefine (bookingMaxPerEntry 2))
    `;
    const compilationResult = compiler.compile(lispString);
    expect(compilationResult).toEqual(
      { state: { bookingMaxPerEntry: 2 } }
    );
  });

  test('Compile state config with root instruction and single nested one with invalid argument type', () => {
    const lispString = `
      (stateDefine (bookingMaxPerEntry "flex"))
    `;
    expect(() => compiler.compile(lispString)).toThrow(
      Error(`Invalid argument type in bookingMaxPerEntry`)
    );
  });

  test('Throw error on unknown instruction entry', () => {
    const lispString = `(stateDefine (checkmate))`;
    expect(() => compiler.compile(lispString)).toThrow(Error("Instruction 'checkmate' does not exist."));
  });

});
