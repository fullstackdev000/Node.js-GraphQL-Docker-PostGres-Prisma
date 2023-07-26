/* tslint:disable:no-console */

export enum Level {
  All = 0,
  Debug,
  Warn,
  Error,
  None
}

let _level: Level = Level.All

function _init (level: Level) {
  _level = level
}

export function init (levelName: string) {
  const levelsMap: { [name: string]: Level } = {
    ALL: Level.All,
    DEBUG: Level.Debug,
    ERROR: Level.Error,
    NONE: Level.None,
    WARN: Level.Warn
  }

  const level = levelsMap[levelName]
  // tslint:disable-next-line:strict-type-predicates TSLint bug =(
  if (level != null) {
    _init(level)
    debug(`Log level set to ${levelName} (${level})`)
  } else {
    _init(Level.None)
    error('Unknown log level')
  }
}

export function debug (message?: any, ...optionalParams: any[]) {
  if (Level.Debug >= _level) {
    console.log.call(console, ...arguments)
  }
}

export function warn (message?: any, ...optionalParams: any[]) {
  if (Level.Warn >= _level) {
    console.warn.call(console, ...arguments)
  }
}

export function error (message?: any, ...optionalParams: any[]) {
  if (Level.Error >= _level) {
    console.error.call(console, ...arguments)
  }
}
