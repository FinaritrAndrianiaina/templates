import { PrismaClient } from "@prisma/client";
import * as faker from "faker";
const prisma = new PrismaClient();

const data = Array.from({ length: 4 }).map(() => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  links: Array.from({
    length: faker.datatype.number({
      min: 1,
      max: 5,
    }),
  }).map(() => ({
    url: faker.internet.url(),
    shortUrl: faker.internet.domainWord(),
  })),
}));

export const seed = async () => {
  for (let entry of data) {
    await prisma.user.create({
      data: {
        name: entry.name,
        email: entry.email,
        links: {
          create: entry.links,
        },
      },
    });
  }
};
