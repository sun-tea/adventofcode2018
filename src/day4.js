// Day 4: Repose Record
import { parseFile } from 'helpers';

const getMatchingShiftId = (schedule, guardId, day, month, year) =>
  schedule.findIndex(row => {
    const rowMonth = row.date.getMonth() + 1;
    return (
      row.guardId === guardId &&
      (`${row.date.getDate() > 9 ? '' : '0'}${row.date.getDate()}` === day &&
        `${rowMonth > 9 ? '' : '0'}${rowMonth}` === month &&
        row.date.getFullYear().toString() === year)
    );
  });

const part1 = content => {
  const timeRegex = new RegExp(
    '^\\[(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2})\\].*$'
  );
  content.sort((prev, next) => {
    const [, yearP, monthP, dayP, hourP, minuteP] = timeRegex
      .exec(prev)
      .map(i => parseInt(i, 10));
    const [, yearN, monthN, dayN, hourN, minuteN] = timeRegex
      .exec(next)
      .map(i => parseInt(i, 10));
    return (
      yearP - yearN ||
      monthP - monthN ||
      dayP - dayN ||
      hourP - hourN ||
      minuteP - minuteN
    );
  });

  const shiftRegex = new RegExp(
    '^\\[(\\d{4})-(\\d{2})-(\\d{2}) (\\d{2}):(\\d{2})\\] (falls asleep|wakes up|Guard #(\\d+) begins shift)$'
  );

  let lastGuardId;
  let guardsBoard = [];
  const schedule = content.reduce((schedule, line) => {
    const [, year, month, day, hours, minutes, type, guardId] = shiftRegex.exec(
      line
    );

    if (type.startsWith('Guard')) {
      lastGuardId = guardId;
      if (!guardsBoard[guardId]) {
        guardsBoard[guardId] = 0;
      }
      let date = new Date(`${year}-${month}-${day}`);
      if (hours === '23') {
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
        lastGuardId,
        day,
        month,
        year
      );
      if (matchingShiftId !== -1) {
        for (let i = minutes; i < 60; i++) {
          schedule[matchingShiftId].minutes[i] = type.startsWith('falls')
            ? 1
            : 0;
        }
      }
      return schedule;
    }
  }, []);

  schedule.forEach(shift => {
    guardsBoard[shift.guardId] += shift.minutes.filter(m => m === 1).length;
  });

  let mostAsleepGuard;
  let highestNap = 0;
  for (let guardBoardId in guardsBoard) {
    if (highestNap < guardsBoard[guardBoardId]) {
      highestNap = guardsBoard[guardBoardId];
      mostAsleepGuard = guardBoardId;
    }
  }

  let timesheet = new Array(60).fill(0);
  schedule
    .filter(shift => shift.guardId === mostAsleepGuard)
    .forEach(shift => {
      shift.minutes.forEach((minute, i) => {
        timesheet[i] += minute || 0;
      });
    });

  const maxOccurencesAsleep = Math.max(...timesheet);
  return (
    mostAsleepGuard *
    timesheet.findIndex(minute => maxOccurencesAsleep === minute)
  );
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day4.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
