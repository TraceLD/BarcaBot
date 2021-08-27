import logger from "../logger";
import fetch, { Response } from "node-fetch";
import { apiFootballConfig } from "../config.json";
import { NonOkResponseError } from "./api-errors";

const baseUrl = "https://api-football-v1.p.rapidapi.com/v3/";
const defaultHeaders = {
  "x-rapidapi-key": apiFootballConfig.token,
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

export const ids = {
  laLiga: 140,
  ucl: 2,
  cdr: 143,
  barca: 529,
};
export const barcaLogo = "https://media.api-sports.io/football/teams/529.png";

export async function get<T>(uri: string): Promise<T> {
  const fetchResponse: Response = await fetch(baseUrl + uri, {
    method: "GET",
    headers: defaultHeaders,
  });

  if (!fetchResponse.ok) {
    throw new NonOkResponseError(
      `API responded with non-OK code: ${fetchResponse.status}`,
      fetchResponse.status,
    );
  }

  const responseRoot: IResponse<T> = await fetchResponse.json();

  logger.log({
    level: "info",
    message: "Received a fresh value from API-Football.",
    endpoint: uri,
  });

  return responseRoot.response;
}

export async function getPaged<T>(uri: string, uriContainsParams: boolean): Promise<T[]> {
  let currentPage = 1;
  let maxPage: number = Number.MAX_SAFE_INTEGER;
  let data: T[] = [];

  while (currentPage <= maxPage) {
    const pageParam = uriContainsParams ? `&page=${currentPage}` : `?page=${currentPage}`;
    const fetchResponse: Response = await fetch(baseUrl + uri + pageParam, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!fetchResponse.ok) {
      throw new NonOkResponseError(
        `API responded with non-OK code: ${fetchResponse.status}`,
        fetchResponse.status,
      );
    }

    const responseRoot: IResponse<T[]> = await fetchResponse.json();
    const newData: T[] = responseRoot.response;

    currentPage += 1;
    maxPage = +responseRoot.paging.total;
    data = [...data, ...newData];
  }

  logger.log({
    level: "info",
    message: "Received a fresh paged value from API-Football.",
    endpoint: uri,
    length: data.length,
  });

  return data;
}

interface IResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: {
    current: string;
    total: string;
  };
  response: T;
}

export interface ILeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}

export interface ITeam {
  id: number;
  name: string;
  logo: string;
}

export interface IHATStatistics {
  home: number;
  away: number;
  total: number;
}

export interface IHATAverageStatistics {
  home: string;
  away: string;
  total: string;
}

export interface IGoalStatistics {
  total: IHATStatistics;
  average: IHATAverageStatistics;
}
