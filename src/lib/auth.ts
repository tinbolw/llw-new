import { betterAuth } from "better-auth";
import { Redis } from "ioredis";
import { redisStorage } from "@better-auth/redis-storage";

const redis = new Redis(process.env.REDIS_URL!);

export const auth = betterAuth({
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      disableDefaultScope: true,
      scope: ["identify", "email", "guilds"],
    },
  },
  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: "better-auth:",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
