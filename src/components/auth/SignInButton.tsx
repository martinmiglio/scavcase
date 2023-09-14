"use client";

import Button from "@/components/atomic/Button";
import {
  faGoogle,
  faDiscord,
  faTwitch,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientSafeProvider, signIn } from "next-auth/react";

const iconMap = new Map<string, IconDefinition>();
iconMap.set("Google", faGoogle);
iconMap.set("Discord", faDiscord);
iconMap.set("Twitch", faTwitch);

export default function SignInButton({
  provider,
}: {
  provider: ClientSafeProvider;
}) {
  const deviceIcon = iconMap.get(provider.name) ?? faRightToBracket;
  return (
    <Button
      onClick={() => signIn(provider.id)}
      className="mx-auto flex w-full min-w-fit max-w-sm items-center justify-center gap-2"
      data-umami-event="Signin with provider button"
      data-umami-event-provider={provider.name}
    >
      <FontAwesomeIcon icon={deviceIcon} className="h-6 w-6" />
      <div className="flex-1">Sign in with {provider.name}</div>
    </Button>
  );
}
