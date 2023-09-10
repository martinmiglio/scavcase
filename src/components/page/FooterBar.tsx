import Link from "next/link";

export default function FooterBar() {
  return (
    <footer className="mt-2 flex w-full flex-row flex-wrap items-center justify-between bg-dark px-4 py-6 text-sm  opacity-60">
      <div>
        Item data from{" "}
        <Link href="https://tarkov.dev/" className="hover:underline">
          tarkov.dev
        </Link>
      </div>
      <div>
        © 2023{" "}
        <Link href="https://martinmiglio.dev/" className="hover:underline">
          Martin Miglio
        </Link>
      </div>
    </footer>
  );
}
