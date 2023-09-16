import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col gap-8 text-lg">
      <div className="flex flex-col gap-3">
        <h2 className="text-4xl font-semibold">About</h2>
        <p>
          scavcase.watch is dedicated to players who want to optimize their Scav
          Case usage, gain valuable insights, and contribute to this
          player-sourced database.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-3xl font-semibold">FAQ</h3>
        <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
          <div className="relative">
            <dt className="border-b pb-1 text-2xl font-semibold leading-7">
              Why Should I use scavcase.watch?
            </dt>
            <dd>
              scavcase.watch is your strategic companion for maximizing your
              Scav Case investments. Whether you want to make data-driven
              decisions, track drop rates, or understand market values, our
              platform has you covered.
            </dd>
          </div>
          <div className="relative">
            <dt className="border-b pb-1 text-2xl font-semibold leading-7">
              Why Sign In?
            </dt>
            <dd>
              Signing in not only verifies you are a real person but also helps
              us maintain the integrity of our reports. It allows you to
              contribute your own Scav Case data while preventing spam or
              duplicate submissions. We value your gaming experience, and
              signing in ensures that the information you receive is accurate
              and reliable.
            </dd>
          </div>
          <div className="relative">
            <dt className="border-b pb-1 text-2xl font-semibold leading-7">
              How often can I report my Scav Cases?
            </dt>
            <dd>
              To maintain data accuracy and prevent misuse, users can report
              their Scav Cases every {process.env.NEXT_PUBLIC_REPORT_RATE_LIMIT}{" "}
              minutes. This limitation helps us provide the most reliable
              information to our community.
            </dd>
          </div>
          <div className="relative">
            <dt className="border-b pb-1 text-2xl font-semibold leading-7">
              How does scavcase.watch know the value of items?
            </dt>
            <dd>
              We source item data from the{" "}
              <Link
                className="underline hover:text-primary"
                href="https://tarkov.dev"
              >
                tarkov.dev API
              </Link>
              , ensuring that our information is up-to-date and reflective of
              the in-game experience.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
