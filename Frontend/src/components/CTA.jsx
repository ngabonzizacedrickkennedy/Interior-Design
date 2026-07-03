import { Link } from "react-router-dom";
import "./CTA.css";

export function CTA() {
  return (
    <section id="cta" className="cta">
      <div className="container cta__inner">
        <h2 className="cta__heading">
          Have a space that's not working yet?
        </h2>

        <div className="cta__actions">
          <Link to="/request" className="btn btn-solid">
            Start a project
          </Link>

          <div className="cta__portal">
            <p>Already a client?</p>
            <Link to="/portal/login" className="cta__portal-link">
              Sign in to your portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
