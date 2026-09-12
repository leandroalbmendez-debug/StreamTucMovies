import axios from "axios";

const API_KEY = "623f8974fa432183192f1c13b24e1df3";
const BASE_URL = "https://api.themoviedb.org/3/";

export const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const fetchMovies = async () => {
  const { data } = await api.get("movie/popular");
  return data.results;
};   