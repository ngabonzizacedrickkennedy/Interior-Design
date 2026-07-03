import "./Services.css";

const SERVICES = [
  {
    title: "Full Interior Design",
    body: "End-to-end design and project management, from first sketch to final styling.",
  },
  {
    title: "Space Planning",
    body: "Layouts that resolve flow, storage, and light before a single finish is chosen.",
  },
  {
    title: "Renovation Direction",
    body: "On-site coordination with architects and trades to keep a renovation on design.",
  },
  {
    title: "Furniture & Sourcing",
    body: "Curated sourcing across vintage, custom, and ready-made pieces within your budget.",
  },
];

export function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <p className="eyebrow">Services</p>
        <h2 className="services__heading">What we take on</h2>
        <div className="services__grid">
          {SERVICES.map((service) => (
            <div key={service.title} className="services__item">
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
