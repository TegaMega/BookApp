import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import type { AppDispatch, RootState } from "../store";
import {
  addToBookshelf,
  deleteFromBookshelf,
} from "../../slice/bookshelfSlice";
import { useDispatch, useSelector } from "react-redux";
import BookCover from "../components/BookCover";

type Author = {
  author: { key: string };
};

type BookData = {
  description?: string | { value: string };
  authors?: Author[];
  title: string;
  covers?: number[];
};

const singleBookQuery = (id: string) => ({
  queryKey: ["Book", id],
  queryFn: async (): Promise<BookData> => {
    const { data } = await axios.get(
      `https://openlibrary.org/works/${id}.json`
    );
    return data;
  },
});

const SingleBook: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const bookshelf = useSelector(
    (state: RootState) => state.bookshelf.bookshelf || []
  );
  const navigate = useNavigate();

  const isInBookshelf = bookshelf.some((book) => book.olKey === id);

  if (!id) return <div>Invalid book ID</div>;

  const { data, isLoading, error } = useQuery(singleBookQuery(id));

  const [authorNames, setAuthorNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (!data?.authors) return;
      const names = await Promise.all(
        data.authors.map(async (a) => {
          const authorId = a.author.key.replace("/authors/", "");
          try {
            const response = await axios.get(
              `https://openlibrary.org/authors/${authorId}.json`
            );
            return response.data?.name || "Unknown";
          } catch {
            return "Unknown";
          }
        })
      );
      setAuthorNames(names);
    };
    fetchAuthors();
  }, [data?.authors]);

  const addBookToshelfs = async (id: string) => {
    await dispatch(addToBookshelf(id));
  };
  const handleDelete = async (id: string) => {
    await dispatch(deleteFromBookshelf(id));
    navigate("/bookshelf");
  };
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error loading book. {error.message}</div>;
  if (!data) return <div>No book data found.</div>;

  // Handle description type
  const maxWords = 80;
  const descriptionText =
    typeof data.description === "string"
      ? data.description
      : data.description?.value ?? "No description";
  const shortDescription =
    descriptionText.split(" ").slice(0, maxWords).join(" ") +
    (descriptionText.split(" ").length > maxWords ? "..." : "");
  // const coverId = data?.covers?.[0];
  // const {
  //   data: coverUrl,
  //   isLoading: isCoverLoading,
  //   error: coverError,
  // } = useBookCover(coverId ?? undefined);

  return (
    <div className="m-0">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-4xl md:mb-8 sm:mx-auto">
        {data.title} By{" "}
        {authorNames.length
          ? authorNames.map((name, i) => (
              <span key={i} className="text-xl text-center">
                {name}
                {i < authorNames.length - 1 ? ", " : ""}
              </span>
            ))
          : "Unknown"}
      </h2>
      <div className="grid lg:grid-cols-2 gap-24 ">
        <div className="bg-neutral p-4 rounded-xl shadow-xl">
          {data?.covers ? (
            <BookCover coverId={data?.covers?.[0]} />
          ) : (
            <img
              src="../assets/defaultBook.jpeg"
              alt="Default cover"
              className="w-full object-cover h-full"
            />
          )}
        </div>
        <div className="bg-ghost rounded-xl bg-neutral p-4 shadow-xl">
          <p className="mb-2 h-full tracking-widest text-2xl md:text-3xl py-6 px-3">
            {shortDescription}
          </p>
          {isInBookshelf ? (
            <button
              className="btn btn-ghost text-amber-50 hover:underline capitalize my-8 text-xl tracking-normal"
              onClick={() => handleDelete(id)}
            >
              Remove from bookshelf
            </button>
          ) : (
            <button
              className="btn btn-ghost text-neutral hover:underline capitalize my-8 text-xl tracking-normal"
              onClick={() => addBookToshelfs(id)}
            >
              Add to bookshelf
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
