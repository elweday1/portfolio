import satori, { type SatoriOptions } from "satori";
import { SITE } from "@config";
import { Resvg } from "@resvg/resvg-js";
import generateOG from "./og-templates/cover";
import siteOgImage from "./og-templates/site";
import { type Collection } from "../types"; 

const fetchFonts = async () => {
  // Regular Font
  var enc = new TextEncoder(); // always utf-8
  const {default: logoFontFile} = await import("/fonts/batman.ttf?raw");
  const logoFont: ArrayBuffer = enc.encode(logoFontFile).buffer;

  const {default: textFontRegularFile} = await import("/fonts/Kalam-Regular.ttf?raw");
  const textFontRegular: ArrayBuffer = enc.encode(textFontRegularFile).buffer;

  const {default:textFontBoldFile} = await import("/fonts/Kalam-Bold.ttf");
  const textFontBold: ArrayBuffer = enc.encode(textFontBoldFile).buffer;

  return { logoFont, textFontRegular, textFontBold };
};

const { logoFont, textFontRegular, textFontBold } = await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "batman",
      data: logoFont,
      weight: 400,
      style: "normal",
    },
    {
      name: "kalam",
      data: textFontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "kalam-bold",
      data: textFontBold,
      weight: 700,
      style: "normal",
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOGImage(entry: Collection) {
  const svg = await satori(await generateOG(entry), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
