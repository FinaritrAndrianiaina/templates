import execa from 'execa'

const log = console.log
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
     * create working folder called templates
     * copy files to templates/
     * install dependencies 
     * db push, seed, run dev script
     * delete working folder
     */
    const changeDir = `cd ../${templateName} &&`

    log('create dir')
    execa.commandSync(`mkdir -p ../${templateName}`)
    log('copy contents')
    execa.commandSync(`rsync -avr --exclude="../../${templateName}/node_modules" ../../${templateName} ../`)
    log('change dir and install deps')
    execa.commandSync(`${changeDir} yarn`)

    // execa.commandSync(`${changeDir} yarn prisma migrate reset --force --schema prisma/schema.prisma`)

    log('db push')
    const dbPush = execa.commandSync(`${changeDir} yarn prisma db push --schema prisma/schema.prisma`)
    expect(dbPush.exitCode).toBe(0)

    const seed = execa.commandSync(`${changeDir} yarn prisma db seed --preview-feature --schema prisma/schema.prisma`)
    expect(seed.exitCode).toBe(0)

    const script = execa.commandSync(`${changeDir} npm run dev`)
    expect(script.exitCode).toBe(0)

    const delDir = execa.commandSync(`rm -rf ../`)
    expect(delDir.exitCode).toBe(0)
  })
})
