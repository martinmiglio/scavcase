import localFont from "next/font/local";

export const font = localFont({
  src: [
    {
      path: "./fonts/bender.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/bender-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/bender-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/bender-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/bender-black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/bender-black-italic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "./fonts/bender-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/bender-light-italic.woff2",
      weight: "300",
      style: "italic",
    },
  ],
});
