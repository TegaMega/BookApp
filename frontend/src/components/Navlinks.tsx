import { NavLink } from "react-router-dom";

type NavLink = {
  id: number;
  title: string;
  path: string;
};

const links: NavLink[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
  },
  {
    id: 2,
    title: "About",
    path: "/about",
  },
  {
    id: 3,
    title: "Bookshelf",
    path: "/bookshelf",
  },
];
const Navlinks = () => {
  return (
    <>
      {links.map((link) => {
        const { id, title, path } = link;
        return (
          <li key={id}>
            <NavLink className="capitalize" to={path}>
              {title}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};

export default Navlinks;
