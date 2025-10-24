import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import HomePage from "../shop/HomePage";

export default function MainLayout({numCartItems}) {
  return (
    <>
      <Navbar numCartItems={numCartItems}/>
      <HomePage />
      <Footer />
    </>
  );
}
