import "./About.css";

// TODO: These are stand-in Unsplash photos (free license, no attribution
// required) so the team grid has real faces. Swap in real team photography
// in src/assets/images/, and swap in the real team roster/roles.
import team1 from "../assets/images/team-1.jpg";
import team2 from "../assets/images/team-2.jpg";
import team3 from "../assets/images/team-3.jpg";
import team4 from "../assets/images/team-4.jpg";

const TEAM = [
  { name: "Aline Uwimana", role: "Founder & Principal Designer", photo: team1 },
  { name: "Claudine Ingabire", role: "Senior Interior Designer", photo: team2 },
  { name: "Eric Mugisha", role: "Project & Sourcing Lead", photo: team3 },
  { name: "Patrick Niyonzima", role: "Design Associate", photo: team4 },
];

export function About() {
  return (
    <>
      <section className="about-story">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 className="about-story__heading">
            We started Space Design Group because most renovations don't
            fail at the design stage — they fail at the handoff.
          </h1>
          <p className="about-story__body">
            Space Design Group was founded to close that gap: one team
            carrying a project from first floor plan through final styling,
            so nothing gets lost in translation between designer, contractor,
            and client. Over the years that's meant working across full home
            renovations, single-room refreshes, and commercial fit-outs —
            always with the same approach: understand how a space gets used
            before deciding how it should look.
          </p>
        </div>
      </section>

      <section className="about-philosophy">
        <div className="container">
          <p className="eyebrow">Studio Philosophy</p>
          <h2 className="about-philosophy__heading">
            Good design disappears into daily life.
          </h2>
          <p className="about-philosophy__body">
            We measure a finished room by how it holds up a year in, not how
            it photographs on handover day. That means prioritizing storage
            that actually gets used, materials that age well, and layouts
            that don't need a redesign the moment life changes around them.
          </p>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <p className="eyebrow">Team</p>
          <h2 className="about-team__heading">The people behind the work</h2>
          <div className="about-team__grid">
            {TEAM.map((member) => (
              <div key={member.name} className="about-team__member">
                <div className="about-team__photo">
                  <img src={member.photo} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
