// Day 16: Chronal Classification
import { parseFile } from './helpers';

const regex = new RegExp('\\d+', 'g');

type Operation = {
  code?: number;
  op: (input: Array<number>, instruction: { A: number; B: number }) => number;
};

export type OperationsByCode = {
  [index: string]: Operation;
};

const part1 = (content: string[]) => {
  const samples = content
    .join('-')
    .split('----')[0]
    .split('--');

  let matchingSamples = 0;

  const operations = Object.values(opcodes);

  samples.forEach(sample => {
    sample.split('-');
    const [reg0, reg1, reg2, reg3, , A, B, C, ...output] = sample
      .match(regex)
      .map(i => parseInt(i, 10));

    const register = [reg0, reg1, reg2, reg3];

    let opcodesMatchesCount = 0;

    for (const opcode of operations) {
      opcodesMatchesCount += opcode(register, { A, B }) === output[C] ? 1 : 0;

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
  const samples = input[0].split('--').map(sample => {
    sample.split('-');
    return sample.match(regex).map(i => parseInt(i, 10));
  });
  const operations = Object.entries(opcodes);

  const operationsByCode: OperationsByCode = operations.reduce(
    (operations, [opcode, op]) => ({
      ...operations,
      [opcode]: {
        op,
      },
    }),
    {}
  );

  // try to match each opcode with its id number
  while (
    Object.values(operationsByCode).filter(
      ({ code }) => typeof code !== 'undefined'
    ).length < 16
  ) {
    // bypass samples with opcode already matched
    const remainingSamples = samples.filter(
      ([, , , , opcode]) =>
        !Object.values(operationsByCode).find(({ code }) => code === opcode)
    );

    remainingSamples.forEach(
      ([reg0, reg1, reg2, reg3, opcode, A, B, C, ...output]) => {
        const input = [reg0, reg1, reg2, reg3];

        operations.reduce((matchingOps, [code, op], index) => {
          const matchingOp = op(input, { A, B }) === output[C];

          if (matchingOp) {
            matchingOps.push(code);
          }

          if (index === operations.length - 1) {
            // filtering out the operations already matched to their code
            const notYetMatchedOpcodes = matchingOps.filter(
              matchingOpcode =>
                !Object.entries(operationsByCode).find(
                  ([code, value]) =>
                    matchingOpcode === code && typeof value.code !== 'undefined'
                )
            );

            // current sample has only one possible matching opcode
            if (notYetMatchedOpcodes.length === 1) {
              operationsByCode[notYetMatchedOpcodes[0]].code = opcode;
            }
          }
          return matchingOps;
        }, []);
      }
    );
  }

  const instructions = input[1]
    .split('-')
    .map(sample => sample.match(regex))
    .map(operation => operation.map(i => parseInt(i, 10)));

  const result = instructions.reduce(
    (input, [opcode, A, B, C]) => {
      const op = Object.entries(operationsByCode).find(
        ([, { code }]) => code === opcode
      )[1].op;
      input[C] = op(input, { A, B });
      return input;
    },
    [0, 0, 0, 0]
  );

  return result;
};

// addr -- add register
const addr = (input: Array<number>, { A, B }): number => input[A] + input[B];

// addi -- add immediate
const addi = (input: Array<number>, { A, B }): number => input[A] + B;

// mulr -- multiply register
const mulr = (input: Array<number>, { A, B }): number => input[A] * input[B];

// muli -- multiply immediate
const muli = (input: Array<number>, { A, B }): number => input[A] * B;

// banr -- bitwise AND register
const banr = (input: Array<number>, { A, B }): number => input[A] & input[B];

// bani --  bitwise AND immediate
const bani = (input: Array<number>, { A, B }): number => input[A] & B;

// borr -- bitwise OR register
const borr = (input: Array<number>, { A, B }): number => input[A] | input[B];

// bori --  bitwise OR immediate
const bori = (input: Array<number>, { A, B }): number => input[A] | B;

// setr -- set register
const setr = (input: Array<number>, { A }): number => input[A];

// seti -- set immediate
const seti = (input: Array<number>, { A }): number => A;

// gtir -- greainputter-than immediate/register
const gtir = (input: Array<number>, { A, B }): number => (A > input[B] ? 1 : 0);

// gtri -- greater-than register/immediate
const gtri = (input: Array<number>, { A, B }): number => (input[A] > B ? 1 : 0);

// gtrr -- greater-than register/register
const gtrr = (input: Array<number>, { A, B }): number =>
  input[A] > input[B] ? 1 : 0;

// eqir -- equal immediate/register
const eqir = (input: Array<number>, { A, B }): number =>
  A === input[B] ? 1 : 0;

// eqri -- equal register/immediate
const eqri = (input: Array<number>, { A, B }): number =>
  input[A] === B ? 1 : 0;

// eqrr -- equal register/register
const eqrr = (input: Array<number>, { A, B }): number =>
  input[A] === input[B] ? 1 : 0;

const opcodes = {
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
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day16.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
