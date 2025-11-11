import { Link } from "react-router-dom";
import { useBookCover } from "../../utils/index";
import Loading from "./Loading";

type Author = {
  name: string;
};

type Work = {
  key: string;
  title: string;
  cover_id?: number;
  cover_edition_key?: string;
  authors?: Author[];
};

type BookProps = {
  data: Work[];
};

const Book: React.FC<BookProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Loading />;
  }

  return (
    <div className=" pt-12 flex gap-4 ">
      {data?.map((work) => {
        const { key, title, cover_id, authors } = work;
        const { data: coverUrl, isLoading } = useBookCover(cover_id);

        return (
          <Link
            key={key}
            to={`${key}`}
            className="card w-72 sm:w-60  shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            {cover_id ? (
              <figure className="px-4 pt-4 rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="h-64 md:h-48 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <img
                    src={coverUrl || "../assets/defaultBook.jpeg"}
                    alt={title}
                    className="rounded-xl h-64 md:h-48 w-full object-cover"
                  />
                )}
              </figure>
            ) : (
              <img
                src={coverUrl || "../assets/defaultBook.jpeg"}
                alt={title}
                className="rounded-xl h-64 md:h-48 w-full object-cover"
              />
            )}
            <div className="card-body items-center text-center">
              <h2 className="card-title capitalize tracking-wider">{title}</h2>
              <p>
                {authors && authors.length > 0
                  ? `By ${authors.map((a) => a.name).join(", ")}`
                  : "Unknown Author"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Book;
