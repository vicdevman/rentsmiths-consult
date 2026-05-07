import { Reveal } from "./Reveal";
import breakImg from "@/assets/break.jpg";

export function BreakImage() {
  return (
    <Reveal y={40}>
      <section className="container-x">
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <img
            src={breakImg.src}
            alt="Consultants reviewing student documents"
            loading="lazy"
            className="h-[60vh] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 max-w-xl text-cream sm:bottom-12 sm:left-12">
            <p className="font-display text-3xl leading-tight sm:text-5xl">
              "Every student we guide is a future leader of their generation."
            </p>
            <p className="mt-4 text-sm text-cream/75">— Rentsmiths Founders</p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
