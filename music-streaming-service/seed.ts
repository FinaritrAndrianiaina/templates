import { PrismaClient } from '@prisma/client'
import * as faker from 'faker'
const prisma = new PrismaClient()

const MAX_NUMBER_OF_SONGS_PER_ARTIST = 5
const NUMBER_OF_ARTISTS = 5
const NUMBER_OF_USERS = 10

const userIds = Array.from({
  length: NUMBER_OF_USERS,
}).map(() => faker.datatype.uuid())

export const seed = async () => {
  try {
    // create artists
    await prisma.artist.createMany({
      data: Array.from({ length: NUMBER_OF_ARTISTS }).map(() => ({
        name: faker.name.firstName(),
      })),
    })

    const artists = await prisma.artist.findMany()

    // create songs for each artist
    artists.forEach(
      async (artist) =>
        await prisma.album.create({
          data: {
            cover: faker.image.imageUrl(),
            name: faker.random.words(2),
            artists: {
              connect: {
                id: artist.id,
              },
            },
            songs: {
              create: Array.from({
                length: faker.datatype.number({
                  min: 2,
                  max: MAX_NUMBER_OF_SONGS_PER_ARTIST,
                }),
              }).map(() => ({
                artistId: artist.id,
                fileUrl: faker.internet.url(),
                length: faker.datatype.float(),
                name: faker.name.firstName(),
              })),
            },
          },
        }),
    )

    const songs = await prisma.song.findMany()

    // create users
    userIds.forEach(
      async (id) =>
        await prisma.user.create({
          data: {
            id,
            email: faker.internet.email(),
            name: faker.name.firstName(),
            interactions: {
              create: Array.from({
                length: faker.datatype.number({
                  min: 3,
                  max: songs.length,
                }),
              }).map(() => ({
                playCount: faker.datatype.number({ min: 1, max: 1000 }),
                songId:
                  songs[
                    faker.datatype.number({ min: 0, max: songs.length - 1 })
                  ].id,
                // random boolean
                isLiked: Math.random() < 0.5,
              })),
            },
          },
        }),
    )

    userIds.forEach(
      async (id) =>
        await prisma.playlist.create({
          data: {
            name: faker.random.words(2),
            user: {
              connect: {
                id,
              },
            },
            // userId: id,
            // each playlist will have a random list of songs G
            songs: {
              connect: songs
                .slice(
                  0,
                  faker.datatype.number({ min: 1, max: songs.length - 1 }),
                )
                .map(({ id }) => ({ id })),
            },
          },
        }),
    )

    await prisma.$disconnect()
  } catch (error) {
    console.log(error)
    await prisma.$disconnect()
  }
}
