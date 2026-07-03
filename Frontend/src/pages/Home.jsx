import { Hero } from "../components/Hero";
import { Approach } from "../components/Approach";
import { Portfolio } from "../components/Portfolio";
import { Statement } from "../components/Statement";
import { Services } from "../components/Services";
import { CTA } from "../components/CTA";

export function Home() {
  return (
    <>
      <Hero />
      <Approach />
      <Portfolio />
      <Statement />
      <Services />
      <CTA />
    </>
  );
}
