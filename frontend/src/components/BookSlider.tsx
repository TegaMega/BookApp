import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Book from "./Book";
import Loading from "./Loading";
import { useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type BookSliderProps = {
  term: string;
};

const BookSlider = ({ term }: BookSliderProps) => {
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const url = `http://localhost:3000/api/home/${term}`;
  const { data, error, isLoading } = useQuery({
    queryKey: ["books", term],
    queryFn: async () => {
      try {
        const response = await axios.get(url, {
          withCredentials: true,
        });
        return response.data.content;
      } catch (err: unknown) {
        throw new Error("Failed to fetch books");
      }
    },
  });
  useEffect(() => {
    if (data) {
      console.log(term);
      console.log("API response:", data);
    }
  }, [data]);
  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error)
    return (
      <div>
        Error loading books, {error.name} {error.message}
      </div>
    );

  return (
    <div
      className=" text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div
        className=" flex space-x-4 overflow-x-scroll scrollbar-hide "
        ref={sliderRef}
      >
        <Book data={data} />
      </div>
      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-accent bg-opacity-50 hover:bg-opacity-75 text-white z-10
            "
            onClick={scrollLeft}
          >
            <LuChevronLeft size={24} />
          </button>

          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-accent bg-opacity-50 hover:bg-opacity-75 text-white z-10
            "
            onClick={scrollRight}
          >
            <LuChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};
export default BookSlider;
