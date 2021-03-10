const warnLevel = 0b010;
const errorLevel = 0b100;
const infoLevel = 0b001;

let logLevel = 0;

export function closeLog() {
  logLevel = 0;
}

export function openLog(level = warnLevel | errorLevel | infoLevel) {
  logLevel = level;
}

export function logInfo(...args: any[]) {
  if ((infoLevel & logLevel) === infoLevel) {
    console.log(...args);
  }
}

export function logWarn(...args: any[]) {
  if ((warnLevel & logLevel) === warnLevel) {
    console.warn(...args);
  }
}
export function logError(...args: any[]) {
  if ((errorLevel & logLevel) === errorLevel) {
    console.error(...args);
  }
}
