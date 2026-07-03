import "../components/Statement.css";
import "./Testimonials.css";

// TODO: Replace with real client testimonials once collected.
const TESTIMONIALS = [
  {
    quote:
      "They asked more questions about how we actually live than any designer we'd talked to before. The result is the first home that's felt finished the moment we moved back in.",
    attribution: "Emmanuel & Diane Habimana — Riverside Loft",
  },
  {
    quote:
      "We needed our office redesigned without shutting the studio down for weeks. Space Design Group phased the whole thing around our deadlines and it barely disrupted a single workday.",
    attribution: "Solange Mukamana — Birchgrove Studio",
  },
  {
    quote:
      "I came in for a single consultation about a living room I'd been stuck on for two years. Walked out with a plan I actually executed in a weekend.",
    attribution: "Jean-Paul Niyonsenga — Design Consultation client",
  },
  {
    quote:
      "Hartwell House had so much original character we were scared to touch it. They worked with the building instead of against it, which is exactly what we needed.",
    attribution: "The Nshimiyimana Family — Hartwell House",
  },
];

export function Testimonials() {
  return (
    <section className="testimonials-page">
      <div className="container">
        <p className="eyebrow">Testimonials</p>
        <h1 className="testimonials-page__heading">What clients say</h1>

        <div className="testimonials-page__list">
          {TESTIMONIALS.map((testimonial, index) => (
            <figure key={index} className="testimonials-page__item">
              <blockquote className="statement__quote">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="statement__attribution">
                — {testimonial.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
