module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  moduleNameMapper:  {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/web/fileMock.tsx',
    '#veewme/(.*)': '<rootDir>/src/$1',
    '#veewme/gen/(.*)': '<rootDir>/build/gen/$1',
    '#veewme/graphql/types': '<rootDir>/build/gen/graphqlTypes.tsx'
  },
  preset: 'ts-jest',
  // testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts']
}
