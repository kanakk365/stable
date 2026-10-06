import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { Testimonial } from "@/components/sections/Testimonial";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

// First release: hero, products, and the MN8 testimonial.
export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Products />
        <Testimonial />
      </main>
      <Footer />
    </>
  );
}
