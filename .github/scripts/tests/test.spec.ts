import execa from 'execa'

/**
 * TODO: Set up mysql test.yml
 * TODO: setup matrix for databases from env
 * TODO: fetch env values from run
 * TODO: Create lookup for different database
 * TODO: make run dynamic - modify provider to mysql
 * TODO: make run dynamic - modify provider to sqlserver and add previewFeatures
 * TODO: add type-safety to this thing
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

describe('Seed and run script against Postgres', () => {
  test.each(projects)('$templateName', async ({ templateName }) => {
    /**
     * create working folder
     * copy files to folder
     * install deps 
     * db push -> assertion
     * seed -> assertion
     * run script -> assertion
     * delete working folder
     */
    const changeDir = `cd ../templates/${templateName} &&`

    execa.commandSync(`mkdir -p ../templates/${templateName}`)
    execa.commandSync(`rsync -avr --exclude="../../${templateName}/node_modules" ../../${templateName} ../templates`)
    execa.commandSync(`${changeDir} yarn`)

    execa.commandSync(`${changeDir} yarn prisma migrate reset --force --schema prisma/schema.prisma`)

    const dbPush = execa.commandSync(`${changeDir} yarn prisma db push --schema prisma/schema.prisma`)
    expect(dbPush.exitCode).toBe(0)

    const seed = execa.commandSync(`${changeDir} yarn prisma db seed --preview-feature --schema prisma/schema.prisma`)
    expect(seed.exitCode).toBe(0)

    const script = execa.commandSync(`${changeDir} npm run dev`)
    expect(script.exitCode).toBe(0)

    const delDir = execa.commandSync(`rm -rf ../templates`)
    expect(delDir.exitCode).toBe(0)
  })
})
