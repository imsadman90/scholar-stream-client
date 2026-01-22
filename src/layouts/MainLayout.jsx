import { Outlet } from "react-router-dom";
import NavBar from "../components/shared/NavBar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/ScrolToTop/ScrolToTop";

const MainLayout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <ScrollToTop />
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
