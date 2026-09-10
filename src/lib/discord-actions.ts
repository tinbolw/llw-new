/**
 * Returns the guilds the user is in.
 * @param accessToken
 * @returns
 */
export async function getGuilds(accessToken: string): Promise<({ id: string } & Record<string, unknown>)[]> {
  const endpoint = "https://discord.com/api/v10/users/@me/guilds";
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return [];

  return await response.json();
}
