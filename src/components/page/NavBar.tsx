import logo from "@/../public/icon.svg";
import Image from "@/components/atomic/Image";
import AccountButton from "@/components/auth/AccountButton";
import Link from "next/link";

const ICON_SIZE = 50;

export default function NavBar({ title }: { title: string }) {
  return (
    <div className="relative flex w-full justify-between px-4 py-2 mb-2 shadow-lg  bg-background">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={logo}
          height={ICON_SIZE}
          width={ICON_SIZE}
          alt="scavcase icon"
        />
        <h1 className="text-3xl font-bold text-theme-600">{title}</h1>
      </Link>
      <AccountButton />
    </div>
  );
}
