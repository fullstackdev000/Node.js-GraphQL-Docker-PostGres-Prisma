export function randomBoolean () {
  return Math.random() >= 0.5
}

export function randomMaybe<T> (value: T): T | undefined {
  return randomBoolean() ? value : undefined
}

export function randomInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomArrayValue<T> (array: T[]): T {
  return array[randomInt(0, array.length - 1)]
}

export function randomEnum<E> (e: { [enumValue: number]: string }): E {
  const keys = Object.keys(e)
  return keys[randomInt(0, keys.length - 1)] as unknown as E
}

export function randomMapValue<T> (map: { [key: string]: T }): T {
  const keys = Object.keys(map)
  return map[randomArrayValue(keys)]
}
