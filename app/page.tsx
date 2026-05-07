import { Hero } from "@/components/site/Hero";
import { TrustedBar } from "@/components/site/TrustedBar";
import { Barriers } from "@/components/site/Barriers";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { BreakImage } from "@/components/site/BreakImage";
import { Stats } from "@/components/site/Stats";
import { Industries } from "@/components/site/Industries";



export default function Index() {
  return (
    <>
      <Hero />
      <TrustedBar />
      <Barriers />
      <Services limit={3} />
      <Process />
      <BreakImage />
      <Stats />
      <Industries />
     
    </>
  );
}