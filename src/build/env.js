/* tslint:disable:no-console */

const appRootPath = require('app-root-path')
const dotenv = require('dotenv')
const dotenvParseVariables = require('dotenv-parse-variables')
const fs = require('fs')

function readEnvFile (fileName) {
  if (fs.existsSync(appRootPath.resolve(fileName))) {
    const file = fs.readFileSync(appRootPath.resolve(fileName), { encoding: 'utf8' })
    return dotenv.parse(file)
  } else {
    return {}
  }
}

function getRawEnv (allowedKeys) {
  const nodeEnv = process.env.NODE_ENV || 'production'
  const envDefault = readEnvFile('.env')
  const envCurrent = readEnvFile(`.env.${nodeEnv}`)
  const envLocal = readEnvFile(`.env.${nodeEnv}.local`)
  const envKeys = allowedKeys
    ? Object.keys(envDefault).filter(key => allowedKeys.includes(key))
    : Object.keys(envDefault)

  let env = {}
  for (const key of envKeys) {
    if (process.env.hasOwnProperty(key)) {
      env[key] = process.env[key]
    } else if (envLocal.hasOwnProperty(key)) {
      env[key] = envLocal[key]
    } else if (envCurrent.hasOwnProperty(key)) {
      env[key] = envCurrent[key]
    } else {
      env[key] = envDefault[key]
    }
  }

  return env
}

function getEnv (allowedKeys) {
  return dotenvParseVariables(getRawEnv(allowedKeys))
}

function printEnv () {
  const env = getEnv()
  const envKeys = Object.keys(env).sort()
  for (const key of envKeys) {
    console.log(`${key}=${env[key]}`)
  }
}

function stringifyEnv (env) {
  return Object.assign(...Object.entries(env).map(([key, value]) => ({
    [key]: JSON.stringify(value)
  })))
}

module.exports = {
  getEnv,
  getRawEnv,
  printEnv,
  stringifyEnv
}
