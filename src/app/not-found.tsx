import Button from "@/components/atomic/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[50vh] flex-col items-center gap-4">
      <h2 className="text-2xl">Page not found</h2>
      <pre className="w-full bg-dark p-2">
        404: The bronze pocket watch isn&apos;t here.
      </pre>
      <Link href="/" className="text-theme-500 hover:underline">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
