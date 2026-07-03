import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";
import "./Services.css";

export function Services() {
  return (
    <section className="services-page">
      <div className="container">
        <p className="eyebrow">Services</p>
        <h1 className="services-page__heading">What we take on</h1>
        <p className="services-page__intro">
          Four ways to work with us, from a single consultation to a full
          home or commercial fit-out.
        </p>

        <div className="services-page__list">
          {SERVICES.map((service) => (
            <article key={service.slug} className="services-page__item">
              <h2>{service.title}</h2>
              <div className="services-page__copy">
                <p className="services-page__description">
                  {service.description}
                </p>
                <p className="services-page__ideal">
                  <strong>Ideal for:</strong> {service.idealFor}
                </p>
              </div>
              <Link
                to={`/request?service=${service.slug}`}
                className="btn btn-solid"
              >
                Request this service
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
