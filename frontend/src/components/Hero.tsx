import hero1 from "../assets/Hero-1.jpg";

const Hero = () => {
  return (
    <div className=" grid lg:grid-cols-2 gap-24 items-center">
      <div>
        <h1 className="text-max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl ">
          Helping you keep Track of your Novels, New and Old
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8">
          📚 Never lose track of your literary journey. Organize your library,
          discover new reads, and stay inspired—your personal bookshelf, always
          one click away.
        </p>
      </div>
      <div className="hidden lg:flex h-[28rem] p-4 space-x-4 bg-neutral rounded-box item center">
        <img
          src={hero1}
          alt="afro boy reading a book"
          className="rounded-box h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
