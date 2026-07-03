import "./Approach.css";

const STEPS = [
  {
    number: "01",
    title: "Listen",
    body: "We start with how you actually live — the routines, the clutter points, the rooms you avoid.",
  },
  {
    number: "02",
    title: "Draft",
    body: "Spatial plans, material boards, and lighting studies, refined together until the layout feels obvious.",
  },
  {
    number: "03",
    title: "Build",
    body: "We manage trades, sourcing, and installation, so the only thing you do is watch it come together.",
  },
];

export function Approach() {
  return (
    <section id="approach" className="approach">
      <div className="container">
        <p className="eyebrow">Our Approach</p>
        <h2 className="approach__heading">
          Design that starts with how a room is lived in, not how it
          photographs.
        </h2>
        <ol className="approach__steps">
          {STEPS.map((step) => (
            <li key={step.number} className="approach__step">
              <span className="approach__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
