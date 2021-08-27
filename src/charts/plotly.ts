import fetch, { Response } from "node-fetch";
import { plotlyConfig } from "../config.json";
import { NonOkResponseError } from "../errors/api-errors";

const auth: string = Buffer.from(`${plotlyConfig.username}:${plotlyConfig.key}`).toString("base64");
const defaultHeaders = {
  Authorization: `Basic ${auth}`,
  "Content-Type": "application/json",
  "Plotly-Client-Platform": "node",
};

export const defaultLayout = {
  title: {
    text: "",
  },
  showLegend: true,
  colorway: [
    "#636efa",
    "#EF553B",
    "#00cc96",
    "#ab63fa",
    "#19d3f3",
    "#e763fa",
    "#fecb52",
    "#ffa15a",
    "#ff6692",
    "#b6e880",
  ],
  paper_bgcolor: "#1a1a23",
  plot_bgcolor: "#1a1a23",
  font: {
    color: "#ebebeb",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPlot(body: any): Promise<ArrayBuffer> {
  const res: Response = await fetch("https://api.plot.ly/v2/images/", {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new NonOkResponseError(`API responded with non-OK code: ${res.status}`, res.status);
  }

  return await res.arrayBuffer();
}
