import config from "@/../tailwind.config.js";
import { ImageResponse } from "next/og";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

export const runtime = "edge";

const { colors } = config.theme;

export async function GET() {
  try {
    const fontDataBold = await fetch(
      new URL("../../styles/fonts/bender-bold.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());
    const fontDataRegular = await fetch(
      new URL("../../styles/fonts/bender.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          tw={`w-full h-full flex flex-col bg-[${colors.background}] text-[${colors.primary}] `}
        >
          <div tw="flex flex-col items-center my-auto">
            <div tw="flex items-center">
              <img
                src="https://www.scavcase.watch/icon.svg"
                height={200}
                width={200}
              />
              <h1
                style={{
                  fontFamily: '"Bold"',
                }}
                tw={`py-8 text-[125px] ml-8`}
              >
                scavcase.watch
              </h1>
            </div>
            <h2
              style={{
                fontFamily: '"Regular"',
              }}
              tw={`text-6xl w-[70%] text-center leading-normal`}
            >
              Track and share scav case values in Escape from Tarkov
            </h2>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Bold",
            data: fontDataBold,
            style: "normal",
          },
          {
            name: "Regular",
            data: fontDataRegular,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
