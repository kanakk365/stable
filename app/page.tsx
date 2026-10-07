import { Cta } from "@/components/sections/Cta";
import { Hero } from "@/components/sections/Hero";
import { Insights } from "@/components/sections/Insights";
import { Problem } from "@/components/sections/Problem";
import { Products } from "@/components/sections/Products";
import { Stats } from "@/components/sections/Stats";
import { Subscribe } from "@/components/sections/Subscribe";
import { Testimonial } from "@/components/sections/Testimonial";
import { Why } from "@/components/sections/Why";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Products />
        <Testimonial />
        <Insights />
        <Problem />
        <Stats />
        <Why />
        <Cta />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
