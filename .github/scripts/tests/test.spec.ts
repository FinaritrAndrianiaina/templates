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
    /**
     * cd to template
     * install dependencies
     * migrate reset
     * db push,
     * seed, 
     * run dev script
     */
    const options = { cwd: `../../${templateName}` }

    execa.commandSync(` yarn`, options)

    execa.commandSync(`yarn prisma migrate reset --force`, options)

    const dbPush = execa.commandSync(`yarn prisma db push --schema prisma/schema.prisma`, options)
    expect(dbPush.exitCode).toBe(0)

    const seed = execa.commandSync(`yarn prisma db seed --preview-feature --schema prisma/schema.prisma`, options)
    expect(seed.exitCode).toBe(0)

    const script = execa.commandSync(`yarn run dev`, options)
    expect(script.exitCode).toBe(0)
  })
})
