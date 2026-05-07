import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";

export default function ServicesPage() {
  return (
    <>
      <section className="container-x pt-40 pb-12 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl text-5xl sm:text-7xl">
            Every stage of your global journey, expertly handled.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Six core services, designed to plug into wherever you are right now — whether that's a
            blank page or a final visa interview.
          </p>
        </Reveal>
      </section>
      <Services />
      <Process />
    </>
  );
}
