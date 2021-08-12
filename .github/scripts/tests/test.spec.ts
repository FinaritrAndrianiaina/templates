import execa from 'execa'
/**
 * TODO: Set up mysql test.yml
 * TODO: setup matrix for databases from env
 * TODO: fetch env values from run
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

describe('Seed and run script against Postgres', () => {
  test.each(projects)('$templateName', async ({ templateName }) => {
    /**
     * create working folder
     * copy files to /
     * install dependencies 
     * db push, seed, run dev script
     * delete working folder
     */
    const changeDir = `--cwd=../${templateName}`

    execa.commandSync(`rsync -avr --exclude="../../${templateName}/node_modules" ../../${templateName} ../`)
    execa.commandSync(` yarn ${changeDir}`)
    execa.commandSync('ls -1pa ../')
    const dbPush = execa.commandSync(` yarn ${changeDir} prisma db push --schema prisma/schema.prisma`)
    expect(dbPush.exitCode).toBe(0)

    const seed = execa.commandSync(`yarn ${changeDir} prisma db seed --preview-feature --schema prisma/schema.prisma`)
    expect(seed.exitCode).toBe(0)

    const script = execa.commandSync(`yarn ${changeDir} run dev`)
    expect(script.exitCode).toBe(0)

    const delDir = execa.commandSync(`rm -rf ../${templateName}`)
    expect(delDir.exitCode).toBe(0)
  })
})
