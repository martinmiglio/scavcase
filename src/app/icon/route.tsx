import config from "@/../tailwind.config.js";
import { ImageResponse } from "next/server";
import { z } from "zod";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

const schema = z.object({
  VERCEL_URL: z.string(),
});

const env = schema.parse(process.env);

export const runtime = "edge";

const { colors } = config.theme;

const ICON_SIZE = 50;

export async function GET() {
  return new ImageResponse(
    (
      <div
        tw={`flex bg-[${colors.background}] overflow-hidden rounded-xl h-[64px] w-[64px]`}
      >
        <div tw="m-auto flex">
          <img
            src={env.VERCEL_URL + "/icon.svg"}
            height={ICON_SIZE}
            width={ICON_SIZE}
          />
        </div>
      </div>
    ),
    {
      width: 64,
      height: 64,
    },
  );
}
