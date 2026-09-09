"use client";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const {
    data: session,
  } = authClient.useSession();

  return (
    <div className="flex justify-center">
      <main>
        <h1>Account</h1>
        { session ? <LogoutButton/> : <LoginButton/> }
        <h1>{session?.user.name}</h1>
      </main>
    </div>
  );
}

function LoginButton() {
  return (
    <button
      onClick={async () => {
        await authClient.signIn.social({
          provider: "discord",
          callbackURL: "/account",
          errorCallbackURL: "/account/error",
        });
      }}
    >
      Login
    </button>
  );
}

function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await authClient.signOut({});
      }}
    >Logout</button>
  );
}
