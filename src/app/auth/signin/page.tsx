import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import SignInButton from "@/components/auth/SignInButton";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/");
  }

  const providers = (await getProviders()) ?? [];

  return (
    <div className="flex flex-col gap-2">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <SignInButton provider={provider} />
        </div>
      ))}
    </div>
  );
}
