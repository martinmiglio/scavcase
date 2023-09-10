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
      className="w-[25%] flex items-center gap-2 mx-auto justify-center"
    >
      <FontAwesomeIcon icon={deviceIcon} className="w-6 h-6" />
      <div className="flex-1">Sign in with {provider.name}</div>
    </Button>
  );
}
