// Day 16: Chronal Classification
import { parseFile } from './helpers';

const regex = new RegExp('\\d+', 'g');

export type OpcodesByNumber = {
  1?: {
    i: number;
    op: object;
  };
  2?: {
    i: number;
    op: object;
  };
  3?: {
    i: number;
    op: object;
  };
  4?: {
    i: number;
    op: object;
  };
  5?: {
    i: number;
    op: object;
  };
  6?: {
    i: number;
    op: object;
  };
  7?: {
    i: number;
    op: object;
  };
  8?: {
    i: number;
    op: object;
  };
  9?: {
    i: number;
    op: object;
  };
  10?: {
    i: number;
    op: object;
  };
  11?: {
    i: number;
    op: object;
  };
  12?: {
    i: number;
    op: object;
  };
  13?: {
    i: number;
    op: object;
  };
  14?: {
    i: number;
    op: object;
  };
  15?: {
    i: number;
    op: object;
  };
  16?: {
    i: number;
    op: object;
  };
};

const part1 = (content: string[]) => {
  const samples = content
    .join('-')
    .split('----')[0]
    .split('--');

  let matchingSamples = 0;

  samples.forEach(sample => {
    sample.split('-');
    const [
      reg0,
      reg1,
      reg2,
      reg3,
      opcode,
      A,
      B,
      C,
      output0,
      output1,
      output2,
      output3,
    ] = sample.match(regex).map(i => parseInt(i, 10));

    const register = [reg0, reg1, reg2, reg3];
    const output = [output0, output1, output2, output3];

    let opcodesMatchesCount = 0;

    for (const opcode of opcodes) {
      opcodesMatchesCount += opcode(register, { A, B, C }, output) ? 1 : 0;

      if (opcodesMatchesCount === 3) {
        matchingSamples++;
        break;
      }
    }
  });

  return matchingSamples;
};

const part2 = (content: string[]) => {
  const input = content.join('-').split('----');
  const samples = input[0].split('--');
  const testProgram = input[1];
  const opcodesByNumber: OpcodesByNumber = {};

  let j = 0;
  // try to match each opcode with its id number
  while (Object.keys(opcodesByNumber).length < 16) {
    samples.some(sample => {
      sample.split('-');
      const [
        reg0,
        reg1,
        reg2,
        reg3,
        opcode,
        A,
        B,
        C,
        output0,
        output1,
        output2,
        output3,
      ] = sample.match(regex).map(i => parseInt(i, 10));

      const register = [reg0, reg1, reg2, reg3];
      const output = [output0, output1, output2, output3];
      let matchingOp;
      let tempMatches;

      if (!opcodesByNumber[opcode]) {
        for (let i = 0; i < opcodes.length; i++) {
          if (Object.values(opcodesByNumber).find(op => op.i === i)) {
            continue;
          }
          tempMatches = opcodes[i](register, { A, B, C }, output)
            ? { i, op: opcodes[i] }
            : null;

          if (tempMatches && matchingOp) {
            break;
          }
          matchingOp = tempMatches ? tempMatches : matchingOp;
          tempMatches = null;

          // current sample has only one possible matching opcode
          if (i === opcodes.length - 1) {
            opcodesByNumber[opcode] = matchingOp;
            console.log(opcodesByNumber);
          }
        }
      }

      return Object.keys(opcodesByNumber).length === 16;
    });
  }

  return Object.entries(opcodesByNumber);
};

// addr -- add register
const addr = (register, { A, B, C }, output) =>
  register[A] + register[B] === output[C];

// addi -- add immediate
const addi = (register, { A, B, C }, output) => register[A] + B === output[C];

// mulr -- multiply register
const mulr = (register, { A, B, C }, output) =>
  register[A] * register[B] === output[C];

// muli -- multiply immediate
const muli = (register, { A, B, C }, output) => register[A] * B === output[C];

// banr -- bitwise AND register
const banr = (register, { A, B, C }, output) =>
  (register[A] & register[B]) === output[C];

// bani --  bitwise AND immediate
const bani = (register, { A, B, C }, output) => (register[A] & B) === output[C];

// borr -- bitwise OR register
const borr = (register, { A, B, C }, output) =>
  (register[A] | register[B]) === output[C];

// bori --  bitwise OR immediate
const bori = (register, { A, B, C }, output) => (register[A] | B) === output[C];

// setr -- set register
const setr = (register, { A, B, C }, output) => register[A] === output[C];

// seti -- set immediate
const seti = (register, { A, B, C }, output) => A === output[C];

// gtir -- greater-than immediate/register
const gtir = (register, { A, B, C }, output) =>
  (A > register[B] ? 1 : 0) === output[C];

// gtri -- greater-than register/immediate
const gtri = (register, { A, B, C }, output) =>
  (register[A] > B ? 1 : 0) === output[C];

// gtrr -- greater-than register/register
const gtrr = (register, { A, B, C }, output) =>
  (register[A] > register[B] ? 1 : 0) === output[C];

// eqir -- equal immediate/register
const eqir = (register, { A, B, C }, output) =>
  (A === register[B] ? 1 : 0) === output[C];

// eqri -- equal register/immediate
const eqri = (register, { A, B, C }, output) =>
  (register[A] === B ? 1 : 0) === output[C];

// eqrr -- equal register/register
const eqrr = (register, { A, B, C }, output) =>
  (register[A] === register[B] ? 1 : 0) === output[C];

const opcodes = [
  addr,
  addi,
  mulr,
  muli,
  banr,
  bani,
  borr,
  bori,
  setr,
  seti,
  gtir,
  gtri,
  gtrr,
  eqir,
  eqri,
  eqrr,
];

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day16.txt';
  const content = parseFile(filePath);
  // console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
