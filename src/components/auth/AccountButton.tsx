"use client";

import Button from "@/components/atomic/Button";
import Image from "@/components/atomic/Image";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function AccountButton() {
  const session = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const dropdownRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const signedIn = session && session.status === "authenticated";

  if (!signedIn) {
    return <Button onClick={() => signIn("google")}>sign in</Button>;
  }

  const { user } = session.data;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="m-2 h-8 w-8 overflow-hidden rounded-full"
        onClick={toggleDropdown}
      >
        <Image
          src={user?.image ?? `https://via.placeholder.com/40`}
          width={40}
          height={40}
          alt={`${user?.name} pfp`}
          className="h-full w-full object-cover"
          priority
          quality={100}
        />
      </div>
      <div
        className={`transition-100 absolute right-0 flex flex-col divide-y overflow-hidden border-2 border-primary bg-background text-primary transition-colors hover:text-text disabled:border-foreground disabled:text-foreground ${
          showDropdown ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          className="hover:bg-theme-600 whitespace-nowrap px-3 py-2"
          onClick={() => signOut()}
        >
          sign out
        </button>
      </div>
    </div>
  );
}
