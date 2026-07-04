import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SERVICES } from "../data/services";
import { useToast } from "../components/toast/ToastContext";
import "./RequestService.css";

const BUDGET_RANGES = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $75,000",
  "$75,000 – $200,000",
  "$200,000+",
];

const PROPERTY_TYPES = ["House", "Apartment / Condo", "Office", "Retail", "Other"];

export function RequestService() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const { showSuccess } = useToast();

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    console.log("Request a service submission:", data);
    setSubmitted(true);
    showSuccess("Request received!");
  }

  if (submitted) {
    return (
      <section className="request-page">
        <div className="container">
          <div className="request-page__confirmation">
            <p className="eyebrow">Request received</p>
            <h1>Thanks — we've got your request.</h1>
            <p>
              A member of the team will reach out within two business days
              to talk through next steps.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="request-page">
      <div className="container">
        <p className="eyebrow">Request a Service</p>
        <h1 className="request-page__heading">Tell us about your project</h1>
        <p className="request-page__intro">
          The more detail you can give us up front, the faster we can come
          back with a useful response.
        </p>

        <form className="form-grid request-page__form" onSubmit={handleSubmit}>
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
          <div className="field">
            <label htmlFor="service">Service type</label>
            <select
              id="service"
              name="service"
              defaultValue={preselectedService}
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICES.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="propertyType">Property type</label>
            <select id="propertyType" name="propertyType" defaultValue="" required>
              <option value="" disabled>
                Select a property type
              </option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="budget">Budget range</label>
            <select id="budget" name="budget" defaultValue="" required>
              <option value="" disabled>
                Select a budget range
              </option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div className="field field--full">
            <label htmlFor="description">Project description</label>
            <textarea
              id="description"
              name="description"
              placeholder="What are you hoping to change, and what's prompting the project now?"
              required
            />
          </div>

          <div className="field field--full">
            <label>Preferred contact method</label>
            <div className="field__radio-group">
              <label className="field__radio-option">
                <input
                  type="radio"
                  name="preferredContact"
                  value="email"
                  defaultChecked
                />
                Email
              </label>
              <label className="field__radio-option">
                <input type="radio" name="preferredContact" value="phone" />
                Phone
              </label>
            </div>
          </div>

          <div className="field--full">
            <button type="submit" className="btn btn-solid">
              Submit request
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
