import { FlyerLayoutName, MeQuery } from '#veewme/gen/graphqlTypes'
import * as React from 'react'
import flyerLayoutIcons from './flyerIcons'

// preserve newline. Source: https://www.npmjs.com/package/react-truncate
export const formatLines = (text: string) => {
  return text.split('\n').map((textLine, i, arr) => {
    const line = <span key={i}>{textLine}</span>
    if (i === arr.length - 1) {
      return line
    } else {
      return [line, <br key={i + 'br'} />]
    }
  })
}

export function getPixels (cssDimension: string): number {
  // regexp source https://stackoverflow.com/a/2671528/846957
  const match = cssDimension.match(/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/)
  if (match && match.length === 3) {
    const unit = match[2]
    const value = parseFloat(match[1])
    if (!isNaN(value) && isFinite(value) && unit === 'px') {
      return value
    }
  }
  throw new Error(`Couldn't convert '${cssDimension}' to pixels`)
}

export const createImage: (url: string) => Promise<HTMLImageElement> = (url: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.src = url
  })
}

// https://stackoverflow.com/a/6860916
export function guidGenerator () {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) // tslint:disable-line
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

// TypeScript filter out nulls from an array
// https://github.com/Microsoft/TypeScript/issues/16069
// https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array/46700791#46700791
export function isNotNullOrUndefined<T> (value: null | undefined | T): value is T {
  return value !== null && value !== undefined
}

// https://github.com/Microsoft/TypeScript/issues/20245
export function isLayoutName (key: string): key is FlyerLayoutName {
  return Object.keys(flyerLayoutIcons).includes(key)
}

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export type NoNullableFields<T> = T extends Array<infer U> ?
  Array<{ [P in keyof U]-?: NoNullableFields<NonNullable<U[P]>> }> : T extends object ?
     { [P in keyof T]-?: NoNullableFields<NonNullable<T[P]>>} : T

export type NoNullableArrayItems<T> = T extends Array<infer U> ? Array<NonNullable<U>> : never
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export const wrapLinkUrl = (url?: string) => {
  if (url) {
    if (/(http(s?)):\/\//i.test(url)) {
      return url
    } else {
      return `http://${url}`
    }
  } else {
    return
  }
}

type AffiliateAccount = Extract<MeQuery['me']['account'], { __typename?: 'Affiliate' }>
export const isAffiliateAccount = (accountData: MeQuery['me']['account']): accountData is AffiliateAccount => accountData.__typename === 'Affiliate'
