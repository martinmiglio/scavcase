import logo from "@/../public/icon.svg";
import Image from "@/components/atomic/Image";
import AccountButton from "@/components/auth/AccountButton";
import Link from "next/link";

const ICON_SIZE = 50;

export default function NavBar({ title }: { title: string }) {
  return (
    <div className="relative flex w-full justify-between py-2">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={logo}
          height={ICON_SIZE}
          width={ICON_SIZE}
          alt="scavcase icon"
        />
        <h1 className="text-3xl font-bold text-theme-600">{title}</h1>
      </Link>

      <div className="py-2">
        {/* <div className="absolute flex gap-4 left-0">
          <button className="hover:underline">sign button</button>
        </div> */}
        <div className="absolute flex gap-4 right-0">
          {/* <Link className="hover:underline" href="/whoKnow">
            link button
          </Link> */}
          <AccountButton />
        </div>
      </div>
    </div>
  );
}
