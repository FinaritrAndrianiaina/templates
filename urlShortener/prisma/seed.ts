import { PrismaClient } from '@prisma/client'
import * as faker from 'faker'

const NUMBER_OF_USERS = 4
const MAX_NUMBER_OF_LINKS = 5

const data = Array.from({ length: NUMBER_OF_USERS }).map(() => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  links: Array.from({
    length: faker.datatype.number({
      min: 0,
      max: MAX_NUMBER_OF_LINKS,
    }),
  }).map(() => ({
    url: faker.internet.url(),
    shortUrl: faker.internet.domainWord(),
  })),
}))

export async function seed() {
  const prisma = new PrismaClient()

  try {
    for (let entry of data) {
      await prisma.user.create({
        data: {
          name: entry.name,
          email: entry.email,
          links: {
            create: entry.links,
          },
        },
      })
    }
  } catch (e) {
    await prisma.$disconnect()
    throw e
  } finally {
    await prisma.$disconnect()
  }
}
