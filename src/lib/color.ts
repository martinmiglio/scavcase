import Color from "colorjs.io";

/** Overloaded function type helpers */
type OverloadProps<TOverload> = Pick<TOverload, keyof TOverload>;

type OverloadUnionRecursive<
  TOverload,
  TPartialOverload = unknown,
> = TOverload extends (...args: infer TArgs) => infer TReturn
  ? TPartialOverload extends TOverload
    ? never
    :
        | OverloadUnionRecursive<
            TPartialOverload & TOverload,
            TPartialOverload &
              ((...args: TArgs) => TReturn) &
              OverloadProps<TOverload>
          >
        | ((...args: TArgs) => TReturn)
  : never;

type OverloadUnion<TOverload extends (...args: any[]) => any> = Exclude<
  OverloadUnionRecursive<(() => never) & TOverload>,
  TOverload extends () => never ? never : () => never
>;

type OverloadParameters<T extends (...args: any[]) => any> = Parameters<
  OverloadUnion<T>
>;

/** Extracted ColorTypes */
type ColorTypes = Extract<OverloadParameters<(typeof Color)["get"]>, [any]>[0];

export function makeInterpolatedSteps(
  steps: number,
  colorA: ColorTypes,
  colorB: ColorTypes,
  format: "hex" | "rgb" | "rgba" | "color" | undefined = "hex",
) {
  const color = new Color(colorA);
  const color2 = new Color(colorB);
  const gradient = color.range(color2);
  const list = [];
  for (let i = 0; i < steps; i++) {
    list.push(gradient(i / steps).toString({ format: format }));
  }
  return list;
}

export function makeHueRotationSteps(
  steps: number,
  color: ColorTypes,
  totalRotation: number = 360,
  format: "hex" | "rgb" | "rgba" | "color" | undefined = "hex",
) {
  const color1 = new Color(color);

  const startingHue = color1.hwb.h;

  const list = [];
  for (let i = steps; i >= 0; i--) {
    const hue = (startingHue + (i / steps) * totalRotation) % 360;
    color1.hwb.h = hue;
    list.push(color1.toString({ format: format }));
  }

  return list;
}
