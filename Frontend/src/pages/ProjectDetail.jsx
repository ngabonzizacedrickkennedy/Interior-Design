import { Link, useParams } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import "./ProjectDetail.css";

export function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <section className="project-detail">
        <div className="container">
          <p className="eyebrow">Portfolio</p>
          <h1 className="project-detail__heading">Project not found</h1>
          <Link to="/portfolio" className="btn">
            Back to portfolio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="project-detail">
      <div className="container">
        <Link to="/portfolio" className="project-detail__back">
          ← Back to portfolio
        </Link>

        <p className="eyebrow">
          {project.category} · {project.year}
        </p>
        <h1 className="project-detail__heading">{project.title}</h1>
        <p className="project-detail__summary">{project.summary}</p>

        <div className="project-detail__cover">
          <img src={project.image} alt={project.title} />
        </div>

        <p className="project-detail__body">{project.body}</p>

        <div className="project-detail__gallery">
          {project.gallery.map((image, index) => (
            <div key={index} className="project-detail__gallery-item">
              <img src={image} alt={`${project.title} detail ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="project-detail__cta">
          <p>Interested in something similar?</p>
          <Link to="/request" className="btn btn-solid">
            Request a service
          </Link>
        </div>
      </div>
    </section>
  );
}
