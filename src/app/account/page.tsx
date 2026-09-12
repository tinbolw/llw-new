import Spinner from "@/components/ui/spinner";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LoginButton, LogoutButton } from "@/components/account/buttons";
import Image from "next/image";
import Header from "@/components/ui/header";
import LinkButton from "@/components/ui/linkbutton";
import { getUser } from "@/lib/discord-actions";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  weight: "variable",
});

export default function Page() {
  return (
    <div>
      <main>
        <Header>Account</Header>
        <div className="flex flex-col items-center">
          <Suspense fallback={<Spinner />}>
            <AccountCard />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function AccountCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const accounts = await auth.api.listUserAccounts({
      headers: await headers(),
    });
    const discordAccount = accounts.find((a) => a.providerId === "discord");

    const { accessToken } = await auth.api.getAccessToken({
      body: {
        accountId: discordAccount!.id,
        userId: session.user.id,
      },
    });

    const user = await getUser(accessToken);
    const nameplate = user.collectibles?.nameplate ? (
      <video
        src={`https://cdn.discordapp.com/assets/collectibles/${user.collectibles.nameplate.asset}asset.webm`}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover -z-10 w-auto h-auto"
      />
    ) : null;
    const avatarDecoration = user.avatar_decoration_data ? (
      <Image
        className="object-contain h-9.5 w-9.5 absolute z-10"
        src={`https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`}
        alt="Avatar dectoration"
        width={38}
        height={38}
      />
    ) : null;

    return (
      <div className="flex flex-col gap-2">
        <div
          className={`${rubik.className} relative size-fit overflow-hidden pr-8 pl-2 rounded-lg shadow w-62 h-10.5 gap-y-0.5 bg-[#2B2D31] z-0`}
        >
          {nameplate}
          <div className="relative z-10 flex flex-row h-full items-center">
            <div className="w-9.5 h-9.5 grid place-items-center me-3">
              {avatarDecoration}
              <Image
                className="rounded-full object-cover h-8 w-8 absolute z-0"
                src={session.user.image!}
                width={32}
                height={32}
                alt="Profile picture"
                priority
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <p className="text-base">{session.user.name}</p>
              {session.user.inGuild ? (
                <p className="text-xs text-green-400">Authorized</p>
              ) : (
                <p className="text-xs text-red-600">Unauthorized</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          {session.user.inGuild ? (
            <div className="w-full">
              <LinkButton href="/">Home</LinkButton>
              <LogoutButton />
            </div>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-2">
        <PlaceholderCard />
        <LoginButton />
      </div>
    );
  }
}

function PlaceholderCard() {
  const nameplate = (
    <video
      src={`https://cdn.discordapp.com/assets/collectibles/nameplates/nameplates_v3/bonsai/asset.webm`}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 object-cover -z-10 w-auto h-auto"
    />
  );

  return (
    <div className={`${rubik.className} grid place-items-center`}>
      <p className="absolute z-10">You are not logged in.</p>
      <div className="relative size-fit overflow-hidden pr-8 pl-2 rounded-lg shadow w-62 h-10.5 gap-y-0.5 blur-sm z-0 bg-[#2B2D31]">
        {nameplate}
        <div className="relative z-10 flex flex-row h-full items-center">
          <div className="w-9.5 h-9.5 grid place-items-center me-3">
            <Image
              className="rounded-full object-cover h-8 w-8 absolute z-0"
              src="https://cdn.discordapp.com/embed/avatars/0.png"
              width={32}
              height={32}
              alt="Profile picture"
              priority
            />
          </div>
          <div className="flex flex-col -space-y-1">
            <p className="text-base">Username</p>
          </div>
        </div>
      </div>
    </div>
  );
}
