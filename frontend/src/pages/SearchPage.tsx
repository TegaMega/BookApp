import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log("serarcparms" + searchParams);
  const term = searchParams.get("term")?.trim() || "";
  console.log("term is " + term);
  const {
    data: books,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", term],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/search/${term}`,
        {
          withCredentials: true,
        }
      );
      return data.content;
    },
    enabled: !!term,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        Search Results for <span className="text-primary">"{term}"</span>
      </h2>

      {isLoading && <Loading />}

      {error && (
        <div className="alert alert-error shadow-lg">
          <span>
            Oops! Something went wrong. Please try again.{""}
            {error.message}
          </span>
        </div>
      )}

      {!isLoading && books?.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No books found for <strong>"{term}"</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.map((book: any) => (
          <div
            key={book.id}
            className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <figure className="h-60 overflow-hidden">
              <img
                src={book.coverImage || "../assets/defaultBook.jpeg"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-lg">{book.title}</h3>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <p className="text-sm mt-2">
                {book.description?.slice(0, 100)}...
              </p>
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`${book.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
