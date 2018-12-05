// Day 4: Repose Record
import { parseFile } from 'helpers';

type Shift = {
  date: Date;
  guardId: number;
  minutes: number[];
};

const timeRegex = new RegExp(
  '^\\[(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2})\\].*$'
);
const shiftRegex = new RegExp(
  '^\\[(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2})\\] (falls asleep|wakes up|Guard #(\\d+) begins shift)$'
);

const getMatchingShiftId = (
  schedule: Shift[],
  guardId: number,
  day: number,
  month: number,
  year: number
): number =>
  schedule.findIndex((row) => {
    const rowMonth = row.date.getMonth() + 1;
    return (
      row.guardId === guardId &&
      (parseInt(
        `${row.date.getDate() > 9 ? '' : '0'}${row.date.getDate()}`,
        10
      ) === day &&
        parseInt(`${rowMonth > 9 ? '' : '0'}${rowMonth}`, 10) === month &&
        row.date.getFullYear() === year)
    );
  });

const sortSchedule = (prev, next) => {
  const [, yearP, monthP, dayP, hourP, minuteP] = timeRegex
    .exec(prev)
    .map((i) => parseInt(i, 10));
  const [, yearN, monthN, dayN, hourN, minuteN] = timeRegex
    .exec(next)
    .map((i) => parseInt(i, 10));
  return (
    yearP - yearN ||
    monthP - monthN ||
    dayP - dayN ||
    hourP - hourN ||
    minuteP - minuteN
  );
};

const createSchedule = (content): Shift[] => {
  let lastGuardId;

  return content.reduce((schedule: Shift[], line) => {
    const [, year, month, day, hours, minutes, type, guardId] = shiftRegex
      .exec(line)
      .map((e, i) => (i !== 6 ? parseInt(e, 10) : e));

    if ((<string>type).startsWith('Guard')) {
      lastGuardId = guardId;
      let date = new Date(`${year}-${month}-${day}`);
      if (hours === 23) {
        date.setDate(date.getDate() + 1);
      }
      return [
        ...schedule,
        {
          date,
          guardId,
          minutes: [],
        },
      ];
    } else {
      const matchingShiftId = getMatchingShiftId(
        schedule,
        <number>lastGuardId,
        <number>day,
        <number>month,
        <number>year
      );
      if (matchingShiftId !== -1) {
        for (let i = <number>minutes; i < 60; i++) {
          schedule[matchingShiftId].minutes[i] = (<string>type).startsWith(
            'falls'
          )
            ? 1
            : 0;
        }
      }
      return schedule;
    }
  }, []);
};

const createGuardsBoard = (schedule: Shift[]) =>
  schedule.reduce((guardsBoard, shift) => {
    if (!guardsBoard[shift.guardId]) {
      return {
        ...guardsBoard,
        [shift.guardId]: 0,
      };
    } else {
      return guardsBoard;
    }
  }, {});

const part1 = (content) => {
  content.sort(sortSchedule);
  const schedule = createSchedule(content);
  const guardsBoard = createGuardsBoard(schedule);

  schedule.forEach((shift) => {
    guardsBoard[shift.guardId] += shift.minutes.filter((m) => m === 1).length;
  });

  let mostAsleepGuard: number;
  let highestNap = 0;
  for (let guardBoardId in guardsBoard) {
    if (highestNap < guardsBoard[guardBoardId]) {
      highestNap = guardsBoard[guardBoardId];
      mostAsleepGuard = parseInt(guardBoardId, 10);
    }
  }

  let timesheet = new Array(60).fill(0);
  schedule
    .filter((shift) => shift.guardId === mostAsleepGuard)
    .forEach((shift) => {
      shift.minutes.forEach((minute, i) => {
        timesheet[i] += minute || 0;
      });
    });

  const maxOccurencesAsleep = Math.max(...timesheet);
  return (
    mostAsleepGuard *
    timesheet.findIndex((minute) => maxOccurencesAsleep === minute)
  );
};

const part2 = (content) => {
  content.sort(sortSchedule);
  const schedule = createSchedule(content);

  const mergedSchedule = schedule.reduce((acc, shift) => {
    let existingMergedShifts = acc[shift.guardId] || [];
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push((existingMergedShifts[i] || 0) + (shift.minutes[i] || 0));
    }
    return {
      ...acc,
      [shift.guardId]: minutes,
    };
  }, {});

  let sleepiestGuard;
  let sleepiestMinute;
  let sleepiestMinuteOccurences = 0;
  for (let i = 0; i < 60; i++) {
    for (let scheduleId in mergedSchedule) {
      if (sleepiestMinuteOccurences < mergedSchedule[scheduleId][i]) {
        sleepiestGuard = scheduleId;
        sleepiestMinute = i;
        sleepiestMinuteOccurences = mergedSchedule[scheduleId][i];
      }
    }
  }

  return sleepiestGuard * sleepiestMinute;
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day4.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
