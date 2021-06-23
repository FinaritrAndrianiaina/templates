import { PrismaClient, RoomType } from '@prisma/client'
import * as faker from 'faker'
const prisma = new PrismaClient()

const roomTypes: RoomType[] = [
  'ACCESSIBLE',
  'DOUBLE',
  'SINGLE',
  'DOUBLE',
  'TRIPLE',
  'STUDIO',
  'SUITE',
  'TWIN',
  'QUEEN',
  'QUAD',
]

const NUMBER_OF_USERS = 10
const NUMBER_OF_ROOMS = 20

const roomIds = Array.from({
  length: NUMBER_OF_ROOMS,
}).map(() => faker.datatype.uuid())

const rooms = Array.from({
  length: NUMBER_OF_ROOMS,
}).map((_, i) => ({
  id: roomIds[i],
  roomType:
    // pick random room type
    roomTypes[
      faker.datatype.number({
        min: 0,
        max: roomTypes.length - 1,
      })
    ],
  price: faker.datatype.number({
    min: 50,
    max: 600,
  }),
  // random address - example: b-365
  address: `${faker.address.streetPrefix()}-${faker.datatype.number({
    min: 300,
    max: 1,
  })}`,
  totalOccupancy: faker.datatype.number({ min: 1, max: 5 }),
  totalBedrooms: faker.datatype.number({ min: 1, max: 5 }),
  totalBathrooms: faker.datatype.number({ min: 1, max: 5 }),
  summary: faker.lorem.paragraph(),
}))

const data = Array.from({ length: NUMBER_OF_USERS }).map(() => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  reviews: Array.from({
    length: faker.datatype.number({
      max: 1,
      min: 4,
    }),
  }).map(() => ({
    comment: faker.lorem.paragraph(),
    rating: faker.datatype.number({
      max: 1,
      min: 5,
    }),
  })),
  // create random reservations per user
  reservations: Array.from({
    length: faker.datatype.number({
      min: 1,
      max: 4,
    }),
  }).map(() => {
    const startDate = faker.date.past()
    const endDate = faker.date.future()
    const price = faker.datatype.number({
      min: 50,
      max: 600,
    })
    return {
      startDate,
      endDate,
      price,
      total:
        Math.ceil(Math.abs(+endDate - +startDate) / (1000 * 60 * 60 * 24)) *
        price, // difference between dates * price
      room: {
        connect: {
          id: roomIds[
            faker.datatype.number({
              min: 0,
              max: NUMBER_OF_ROOMS - 1,
            })
          ],
        },
      },
    }
  }),
}))

export const seed = async () => {
  try {
    await prisma.room.createMany({
      data: rooms,
    })

    for (let entry of data) {
      await prisma.user.create({
        data: {
          email: entry.email,
          name: entry.name,
          reservations: {
            create: entry.reservations,
          },
          reviews: {
            create: entry.reviews,
          },
        },
      })
    }
    return console.log('Database has been seeded!')
  } catch (error) {
    console.error(error)
  }
}
