import execa from 'execa'

/**
 * TODO: Set up mysql test.yml
 * TODO: setup matrix for databases from env
 * TODO: Create lookup for different database
 * TODO: make run dynamic - modify provider to mysql
 * TODO: make run dynamic - modify provider to sqlserver and add previewFeatures
 * TODO: add type-safety to this
 */
const projects = [
  {
    templateName: 'musicStreamingService',
  },
  {
    templateName: 'rentalsPlatform',
  },
  {
    templateName: 'saas',
  },
  {
    templateName: 'urlShortener',
  },
]

describe('Seed and run script', () => {
  test.each(projects)('$templateName against Postgres', async ({ templateName }) => {
    const execaConfig:execa.SyncOptions = { cwd: `../../${templateName}` }

    execa.commandSync(` yarn`, execaConfig)

    execa.commandSync(`yarn prisma migrate reset --force`, execaConfig)

    const dbPush = execa.commandSync(`yarn prisma db push --schema prisma/schema.prisma`, execaConfig)
    expect(dbPush.exitCode).toBe(0)

    const seed = execa.commandSync(`yarn ts-node ./prisma/seed.ts`, execaConfig)
    expect(seed.exitCode).toBe(0)

    const script = execa.commandSync(`yarn run dev`, execaConfig)
    expect(script.exitCode).toBe(0)
  })
})
