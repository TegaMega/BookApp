const About = () => {
  return (
    <>
      <section className="text-center py-10">
        <div className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center">
          <h1 className="text-4xl sm:text-6xl font-bold leading-none tracking-tight py-3.5">
            Why We love
          </h1>
          <div className="stats bg-primary shadow rounded-lg px-4 py-2">
            <div className="stat">
              <div className="stat-title text-primary-content text-4xl font-bold tracking-widest">
                BookApp
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto text-base-content tracking-widest">
          <span className="font-semibold text-primary">BookApp</span> is your
          personal library companion—designed for readers who want to track
          every book they love and discover their next favorite read
          effortlessly. Whether you're into thrillers, romance, or deep
          nonfiction, BookApp keeps your bookshelf organized and your reading
          journey inspired. With smart recommendations and seamless tracking,
          it’s more than an app—it’s the ultimate tool for passionate readers
          who never want to lose sight of a great story.
        </p>
      </section>
    </>
  );
};
export default About;
