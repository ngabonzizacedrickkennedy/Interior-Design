import { useState } from "react";
import "./Contact.css";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    // TODO: send `data` to the contact API endpoint once it exists.
    console.log("Contact form submission:", data);
    setSubmitted(true);
  }

  return (
    <section className="contact-page">
      <div className="container contact-page__layout">
        <div className="contact-page__details">
          <p className="eyebrow">Contact</p>
          <h1 className="contact-page__heading">Let's talk about your space</h1>
          <p className="contact-page__intro">
            Reach out directly, or use the form and we'll get back to you
            within two business days.
          </p>

          <dl className="contact-page__info">
            <div>
              <dt>Studio</dt>
              <dd>KG 548 St, House 1, Kacyiru, Kigali, Rwanda</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:hello@spacedesigngroup.com">
                  hello@spacedesigngroup.com
                </a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href="tel:+250788123456">+250 788 123 456</a>
              </dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>Monday – Friday, 9am – 6pm</dd>
            </div>
          </dl>

          {/* TODO: Swap the query below for the studio's exact address once
              finalized — this currently pins KG 548 St, Kacyiru, Kigali. */}
          <iframe
            className="contact-page__map"
            title="Space Design Group studio location"
            src="https://www.google.com/maps?q=KG+548+St,+Kacyiru,+Kigali,+Rwanda&z=17&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="contact-page__form-wrap">
          {submitted ? (
            <div className="contact-page__confirmation">
              <h2>Thanks — message received.</h2>
              <p>We'll be in touch within two business days.</p>
            </div>
          ) : (
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" />
              </div>
              <div className="field field--full">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
              <div className="field--full">
                <button type="submit" className="btn btn-solid">
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
