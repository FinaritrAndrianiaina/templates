import execa from 'execa';

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
    path: '../../musicStreamingService',
  },
  {
    templateName: 'rentalsPlatform',
    path: '../../rentalsPlatform',
  },
  {
    templateName: 'saas',
    path: '../../saas',
  },
  {
    templateName: 'urlShortener',
    path: '../../urlShortener',
  },
]

describe('Seed and run script', () => {
  test.each(projects)('$project.templateName', async (project) => {
    
    execa.commandSync(`cd ${project.path} && npm install`)

    const dbPush = execa.commandSync('npx prisma db push')
    expect(dbPush.exitCode).toBe(0)

    const seed = execa.commandSync('npx prisma db seed --preview-feature')

    expect(seed.exitCode).toBe(0)

    const runScript = execa.commandSync('npm run dev')
    expect(runScript.exitCode).toBe(0)
  })
})
