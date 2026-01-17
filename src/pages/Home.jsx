import Banner from "../components/Home/Banner";
import FAQ from "../components/Home/FAQ";
import TopScholarships from "../components/Home/TopScholarships";
import SuccessStories from "../components/Home/SuccessStories";
import { useLocation } from "react-router";
import { useEffect } from "react";
import ScholarStreamSections from "../components/ScholarStreams Sections";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "contact") {
      const contactSection = document.getElementById("contact");
      contactSection?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div>
      <Banner />
      <TopScholarships />
      <SuccessStories />
      <ScholarStreamSections/>
      <FAQ />
    </div>
  );
};

export default Home;
