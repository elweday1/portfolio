import { SITE } from "@config";
import { type Collection } from "../../types";



function calcFontSize(titleStr: string, descriptionStr: string) {
  const baseFontSize = 1.5;
  const charCountTitle = titleStr.length;
  const charCountDescription = descriptionStr.length;

  const minFontSizeTitle = 1.2;
  const minFontSizeDescription = 0.8; 

  const scalingFactorTitle = 0.02;
  const scalingFactorDescription = 0.004;

  const calculatedFontSizeTitle = baseFontSize * 2 - (charCountTitle * scalingFactorTitle);
  const calculatedFontSizeDescription = baseFontSize - (charCountDescription * scalingFactorDescription);

  const fontSizeTitle = Math.max(calculatedFontSizeTitle, minFontSizeTitle);
  const fontSizeDescription = Math.max(calculatedFontSizeDescription, minFontSizeDescription);

  return {
      titleSize: `${fontSizeTitle}rem`,
      descSize: `${fontSizeDescription}rem`,
  }
}


export default async (entry: Collection) => {

  const parsedUrl = new URL(entry.data.cover.src, 'https://example.com/'); // Base URL is needed for relative paths
  const pathname = parsedUrl.pathname;
  const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
  const cover = SITE.website + "/assets/media/" + filename;
  const { titleSize, descSize } = calcFontSize(entry.data.title, entry.data.description);
  return (
    <div style={{ color: "rgba(255,255,255)", fontFamily: "kalam", width: "100%", height: "100%", position: "relative", display: "flex", backgroundColor: "black" }}>
      <img style={{ objectFit: "fill", width: "100%", height: "75%" }} alt="dsds" src={cover} />

      <div style={{
        position: "absolute",
        display: "flex",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "55%",
        background: "linear-gradient(to top, black 45%, transparent 100%)", 
        
        fontFamily: "kalam",
      }}>
        <img
          style={{
            position: "relative",
            aspectRatio: "1/1",
            height: "100%",
            transform: "scaleX(-1)",
          }}
          alt="dsds"
          src={SITE.website + "/assets/404.png"}
        />
      <div style={{  display: "flex", paddingTop : "80px", paddingLeft: "40px",  gap: "0", flexDirection: "column", fontWeight: "bold", width: "60%", justifyContent: "center" }} >
        <h2 style={{ fontSize: titleSize, marginBottom: "-15px", fontFamily: "kalam-bold", fontWeight: "bolder" }}>{entry.data.title}</h2>
        <h3 style={{ fontSize: descSize }}>{entry.data.description}</h3>
      </div>
      </div>
      <h1 style={{ position: "absolute", top: "0", right: "50px", fontFamily: "batman", fontWeight: "bold", color:"#b31c26" }} >{SITE.title + " | " + (entry.collection === "blog" ? "Article" : "Project")}</h1>
    </div>
  );
};
