import logo from "@/../public/icon.svg";
import AccountButton from "@/components/auth/AccountButton";
import Image from "next/image";
import Link from "next/link";

const ICON_SIZE = 50;

export default function NavBar({ title }: { title: string }) {
  return (
    <nav className="relative mb-2 flex w-full justify-between bg-background px-4 py-2 shadow-lg">
      <Link href="/">
        <header className="flex items-center gap-2">
          <Image
            src={logo}
            height={ICON_SIZE}
            width={ICON_SIZE}
            alt="scavcase icon"
            priority
          />
          <h1 className="text-3xl font-bold">{title}</h1>
        </header>
      </Link>
      <AccountButton />
    </nav>
  );
}
