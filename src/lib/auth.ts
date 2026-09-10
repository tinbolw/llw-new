import { betterAuth, type BetterAuthOptions } from "better-auth";
import { Redis } from "ioredis";
import { redisStorage } from "@better-auth/redis-storage";
import { getGuilds } from "@/lib/discord-actions";
import { customSession } from "better-auth/plugins";
import { Pool } from "pg";

const redis = new Redis(process.env.REDIS_URL!);
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING!,
  max: 1,
});

const options = {
  database: pool,
  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: "better-auth:",
  }),
  user: {
    additionalFields: {
      inGuild: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false,
      },
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      disableDefaultScope: true,
      scope: ["identify", "email", "guilds"],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    customSession(async ({ user, session }) => {
      const custom = { user, session };
      if (!session) return custom;

      const cacheKey = `guild-check:${user.id}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        custom.user.inGuild = JSON.parse(cached).inGuild;
        return custom;
      } else {
        const { rows } = await pool.query(
          `SELECT id FROM account WHERE "userId" = $1 AND "providerId" = 'discord' LIMIT 1`,
          [user.id],
        );
        const account = rows[0];

        if (!account) {
          custom.user.inGuild = false;
          return custom;
        }

        const { accessToken } = await auth.api.getAccessToken({
          body: { accountId: account.id, userId: user.id },
        });

        const guilds = await getGuilds(accessToken);
        const inGuild =
          guilds.filter((guild) => guild.id == process.env.GUILD_ID!).length !=
          0;
        custom.user.inGuild = inGuild;
        const timeout = 30 * 60;
        await redis.set(cacheKey, JSON.stringify({ inGuild }), "EX", timeout);
        return custom;
      }
    }, options),
  ],
});
