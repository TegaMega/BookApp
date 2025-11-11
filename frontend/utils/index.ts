import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const productionUrl = "https://openlibrary.org/search.json";
const imageUrl = " https://covers.openlibrary.org/a/olid";

export const customFetch = axios.create({
  baseURL: productionUrl,
});

export const customImgFetch = axios.create({
  baseURL: imageUrl,
});

export const useBookCover = (cover_id?: number) => {
  return useQuery({
    queryKey: ["book-cover", cover_id],
    queryFn: async () => {
      if (!cover_id) return null;
      const url = `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Image not found");
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!cover_id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useAuthorName = (id: string) => {
  return useQuery({
    queryKey: ["Author", id],
    queryFn: async () => {
      const response = await axios.get(
        `https://openlibrary.org/authors/${id}.json`
      );
      return response.data?.name || "unknown author";
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};
