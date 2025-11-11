import { useBookCover } from "../../utils";
import Loading from "./Loading";

const BookCover: React.FC<{ coverId: number }> = ({ coverId }) => {
  const { data: coverUrl, isLoading, error } = useBookCover(coverId);

  if (isLoading) return <Loading />;
  if (error || !coverUrl)
    return (
      <img
        src="../assets/defaultBook.jpeg"
        alt="Default cover"
        className="w-full h-full object-cover"
      />
    );
  return (
    <img
      src={coverUrl}
      alt="Book cover"
      className="w-full  object-cover rounded-xl shadow-xl"
    />
  );
};
export default BookCover;
