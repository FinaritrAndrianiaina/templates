import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: Boolean(process.env.CI),
      compiler: 'ttypescript',
    },
  },
}

export default config;