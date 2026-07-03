import { useState } from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../data/projects";
import "./Portfolio.css";

const CATEGORIES = ["All", "Residential", "Commercial"];

export function Portfolio() {
  const [category, setCategory] = useState("All");

  const projects =
    category === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === category);

  return (
    <section className="portfolio-page">
      <div className="container">
        <p className="eyebrow">Portfolio</p>
        <h1 className="portfolio-page__heading">Selected work, in full.</h1>
        <p className="portfolio-page__intro">
          A wider look at projects across residential and commercial spaces —
          filter by category, or browse everything.
        </p>

        <div className="portfolio-page__filters" role="group" aria-label="Filter by category">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={
                "portfolio-page__filter" +
                (category === item ? " is-active" : "")
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="portfolio-page__grid">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/portfolio/${project.slug}`}
              className="portfolio-page__item"
            >
              <div className="portfolio-page__image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="portfolio-page__caption">
                <h3>{project.title}</h3>
                <span>
                  {project.category} · {project.year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
