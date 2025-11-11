import BookSlider from "../components/BookSlider";
import Hero from "../components/Hero";
import SectionTile from "../components/SectionTile";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <SectionTile text="Love" />
      <BookSlider term={"love"} />
      <SectionTile text="Adventure" />
      <BookSlider term={"adventure"} />
    </>
  );
};

export default LandingPage;
