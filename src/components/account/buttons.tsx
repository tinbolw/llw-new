"use client";

import { ComponentProps } from "react";
import { useState } from "react";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LoginButton({ ...props }: ComponentProps<"button">) {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Button
      disabled={isDisabled}
      onClick={async () => {
        setIsDisabled(true);
        await authClient.signIn.social({
          provider: "discord",
          callbackURL: "/account",
          errorCallbackURL: "/account/error",
        });
      }}
      {...props}
    >
      Login
    </Button>
  );
}

export function LogoutButton({ ...props }: ComponentProps<"button">) {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Button
      disabled={isDisabled}
      onClick={async () => {
        setIsDisabled(true);
        await authClient.signOut({});
        router.refresh();
      }}
      {...props}
    >
      Logout
    </Button>
  );
}
