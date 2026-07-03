import "./Portfolio.css";

// TODO: These are stand-in Unsplash photos (free license, no attribution
// required). Swap in real Space Design Group project photography, named
// for the actual projects (src/assets/images/).
import project1 from "../assets/images/project-1.jpg";
import project2 from "../assets/images/project-2.jpg";
import project3 from "../assets/images/project-3.jpg";
import project4 from "../assets/images/project-4.jpg";

const PROJECTS = [
  { id: "riverside", title: "Riverside Loft", year: "2024", image: project1 },
  { id: "maple", title: "Maple Residence", year: "2023", image: project2 },
  { id: "hartwell", title: "Hartwell House", year: "2023", image: project3 },
  { id: "birchgrove", title: "Birchgrove Studio", year: "2022", image: project4 },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <p className="eyebrow">Portfolio</p>
        <h2 className="portfolio__heading">Selected projects</h2>
        <div className="portfolio__grid">
          {PROJECTS.map((project) => (
            <a key={project.id} href="#" className="portfolio__item">
              <div className="portfolio__image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="portfolio__caption">
                <h3>{project.title}</h3>
                <span>{project.year}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
