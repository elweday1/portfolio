import satori, { type SatoriOptions } from "satori";
import { SITE } from "@config";
import { Resvg } from "@resvg/resvg-js";
import generateOG from "./og-templates/cover";
import siteOgImage from "./og-templates/site";
import { type Collection } from "../types"; 

const fontFileRegular = await fetch(
  'https://www.1001fonts.com/download/font/kalam.ttf'
)

async function fetchFont(fontUrl: string){
  const res = await fetch(fontUrl);
  const font = await res.arrayBuffer();
  return font;
}

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "batman",
      data: await fetchFont("https://www.1001fonts.com/download/font/kalam.ttf"),
      weight: 400,
      style: "normal",
    },
    {
      name: "kalam",
      data: await fetchFont("https://www.1001fonts.com/download/font/kalam.bold.ttf"),
      weight: 400,
      style: "normal",
    },
    {
      name: "kalam-bold",
      data: await fetchFont("https://www.1001fonts.com/download/font/kalam.ttf"),
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
