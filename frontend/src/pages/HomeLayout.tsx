import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const HomeLayout = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <section className="mx-auto max-w-7xl p-15">
        <Outlet />
      </section>
    </div>
  );
};

export default HomeLayout;
