import { FaAlignLeft } from "react-icons/fa";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import Navlinks from "./Navlinks";
import { useDispatch } from "react-redux";
import { setTheme } from "../../slice/themeSlice";
import { LuGlasses } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTheme = () => {
    dispatch(setTheme());
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchTerm("");
  };
  return (
    <nav className="bg-base-200 shadow-sm ">
      <div className="navbar  mx-auto max-w-7xl px-8">
        <div className="navbar-start ">
          <NavLink
            to="/"
            className="hidden lg:flex text-primary text-4xl items-center"
          >
            Book<span className="text-secondary text-4xl">App</span>
          </NavLink>
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <FaAlignLeft className="h-6 w-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2  shadow bg-base-200 rounded-box w-52"
            >
              <Navlinks />
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            <Navlinks />
          </ul>
        </div>
        <div className="navbar-end flex gap-3 ">
          <label className="swap swap-rotate">
            <input type="checkbox" onChange={handleTheme} />
            {/* sun icon*/}
            <BsSunFill className="swap-on h-6 w-6" />
            {/* moon icon*/}
            <BsMoonFill className="swap-off h-6 w-6" />
          </label>
          <form
            className="flex gap-2 items-stretch max-w-2xl "
            onSubmit={handleSearch}
          >
            <input
              type="search"
              placeholder={searchTerm}
              className="input input-bordered w-46 md:w-auto"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
            <button className=" btn p-1 rounded">
              <LuGlasses className="size-6 " />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
