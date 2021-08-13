import { PrismaClient } from '@prisma/client'
import * as faker from 'faker'

const NUMBER_OF_USERS = 4
const NUMBER_OF_INVITES = 4

const data = Array.from({ length: NUMBER_OF_USERS }).map(() => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  account: {
    stripeCustomerId: faker.datatype.uuid(),
    stripeSubscriptionId: faker.datatype.uuid(),
    isActive: true,
  },
  invites: Array.from({
    length: faker.datatype.number({ min: 0, max: NUMBER_OF_INVITES }),
  }).map(() => ({
    email: faker.internet.email(),
    dateSent: faker.date.future(),
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
          account: {
            create: {
              stripeCustomerId: entry.account.stripeCustomerId,
              stripeSubscriptionId: entry.account.stripeSubscriptionId,
              isActive: true,
              invites: {
                create: entry.invites,
              },
            },
          },
        },
      })
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

seed()