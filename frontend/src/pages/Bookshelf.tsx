import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LuTrash2, LuLoaderPinwheel } from "react-icons/lu";
import Loading from "../components/Loading";
import type { RootState, AppDispatch } from "../store";
import { getBookshelf, deleteFromBookshelf } from "../../slice/bookshelfSlice";
import { Link } from "react-router-dom";

const Bookshelf = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.user);
  const books = useSelector((state: RootState) => state.bookshelf.bookshelf);
  const isLoading = useSelector(
    (state: RootState) => state.bookshelf.isFetchingBookshelf
  );
  const error = useSelector((state: RootState) => state.bookshelf.error);
  const deletingBookId = useSelector(
    (state: RootState) => state.bookshelf.deletingBookId
  );

  useEffect(() => {
    dispatch(getBookshelf());
  }, []);

  const handleDelete = async (olKey: string) => {
    await dispatch(deleteFromBookshelf(olKey));
    dispatch(getBookshelf());
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-error mt-10">
        ❌ There was an error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 p-6 m-0">
      <h1 className="text-3xl font-bold text-center mb-8">
        Welcome {user?.username || "Reader"} 📚
      </h1>

      {books?.length === 0 ? (
        <div className="text-center text-lg text-gray-500 ">
          Your bookshelf is empty. Time to add some stories!
        </div>
      ) : (
        <div className="w-full grid auto-rows-fr md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {books?.map((book) => (
            <Link
              key={book.olKey}
              to={`${book.olKey}`}
              className="card w-72 bg-base-100 shadow-xl relative  p-4 sm:justify-center sm:mx-auto h-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {/* 🗑️ Trash Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent bubbling to Link
                  e.preventDefault(); // prevent navigation
                  handleDelete(book.olKey);
                }}
                className="absolute top-2 right-2 btn btn-xs btn-circle btn-error"
                disabled={deletingBookId === book.olKey}
                title="Remove from bookshelf"
              >
                {deletingBookId === book.olKey ? (
                  <LuLoaderPinwheel className="w-4 h-4 animate-spin" />
                ) : (
                  <LuTrash2 className="w-4 h-4" />
                )}
              </button>

              {book.cover_id && (
                <figure>
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                    alt={book.title}
                    className="rounded-xl w-full h-50 md:h-60 object-cover overflow-hidden"
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">{book.title}</h2>
                <p className="text-sm text-gray-600">
                  by{" "}
                  {Array.isArray(book.authors)
                    ? book.authors.join(", ")
                    : "Unknown"}
                </p>
                {book.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {book.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookshelf;
