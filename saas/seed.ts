import { PrismaClient, PlanType } from "@prisma/client";
import * as faker from "faker";
const prisma = new PrismaClient();

const plans: PlanType[] = ["FREE", "PREMIUM"];

const data = Array.from({ length: 2 }).map(() => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  account: {
    plan: plans[Math.floor(Math.random() * plans.length)], // pick random plan
    stripeCustomerId: faker.datatype.uuid(),
    stripeSubscriptionId: faker.datatype.uuid(),
    isActive: true,
  },
  invites: Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(
    () => ({
      email: faker.internet.email(),
      dateSent: faker.date.future(),
    })
  ),
}));

export const seed = async () => {
  for (let entry of data) {
    await prisma.user.create({
      data: {
        name: entry.name,
        email: entry.email,
        account: {
          create: {
            plan: entry.account.plan,
            stripeCustomerId: entry.account.stripeCustomerId,
            stripeSubscriptionId: entry.account.stripeSubscriptionId,
            isActive: true,
            invites: {
              create: entry.invites,
            },
          },
        },
      },
    });
  }
};
