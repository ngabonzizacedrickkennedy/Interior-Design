import { useEffect, useReducer, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { wizardReducer, initialWizardState } from "./wizardReducer";
import { createDraftRequest, updateDraftRequest, submitRequest, getRequestById } from "../../api/actions/requests";
import { WizardProgressBar } from "./WizardProgressBar";
import { StepRoomPhotos } from "./steps/StepRoomPhotos";
import { StepDimensions } from "./steps/StepDimensions";
import { StepBudget } from "./steps/StepBudget";
import { StepStylePreferences } from "./steps/StepStylePreferences";
import { StepSpaceUsage } from "./steps/StepSpaceUsage";
import { StepExistingFurniture } from "./steps/StepExistingFurniture";
import { StepLighting } from "./steps/StepLighting";
import { StepTimeline } from "./steps/StepTimeline";
import { StepAvoidAndLocation } from "./steps/StepAvoidAndLocation";
import { StepReview } from "./steps/StepReview";
import "../PortalLayout.css";
import "./wizard.css";

const STEPS = [
  { key: "roomPhotos", label: "Room Photos", Component: StepRoomPhotos },
  { key: "dimensions", label: "Dimensions", Component: StepDimensions },
  { key: "budget", label: "Budget", Component: StepBudget },
  { key: "style", label: "Style", Component: StepStylePreferences },
  { key: "usage", label: "Space Usage", Component: StepSpaceUsage },
  { key: "furniture", label: "Existing Furniture", Component: StepExistingFurniture },
  { key: "lighting", label: "Lighting", Component: StepLighting },
  { key: "timeline", label: "Timeline", Component: StepTimeline },
  { key: "avoid", label: "Avoid & Location", Component: StepAvoidAndLocation },
  { key: "review", label: "Review", Component: StepReview },
];

function buildWizardPayload(fields) {
  return {
    roomType: fields.roomType || null,
    requestDetails: fields.requestDetails || null,
    lengthMeters: fields.lengthMeters === "" ? null : Number(fields.lengthMeters),
    widthMeters: fields.widthMeters === "" ? null : Number(fields.widthMeters),
    ceilingHeightMeters: fields.ceilingHeightMeters === "" ? null : Number(fields.ceilingHeightMeters),
    spatialNotes: fields.spatialNotes || null,
    budgetMin: fields.budgetMin === "" ? null : Number(fields.budgetMin),
    budgetMax: fields.budgetMax === "" ? null : Number(fields.budgetMax),
    styleTags: fields.styleTags,
    worksFromHome: fields.worksFromHome,
    entertainsOften: fields.entertainsOften,
    hasKids: fields.hasKids,
    hasPets: fields.hasPets,
    storageNeeds: fields.storageNeeds || null,
    windowDirection: fields.windowDirection || null,
    naturalLightLevel: fields.naturalLightLevel || null,
    artificialLightingNotes: fields.artificialLightingNotes || null,
    timeline: fields.timeline || null,
    avoidNotes: fields.avoidNotes || null,
    sourcingLocation: fields.sourcingLocation || null,
  };
}

export function NewRequestWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const navigate = useNavigate();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    async function init() {
      try {
        const request = draftId ? await getRequestById(draftId) : await createDraftRequest();
        dispatch({ type: "HYDRATE", request });
      } catch (err) {
        dispatch({ type: "SET_ERROR", error: err.message });
        dispatch({ type: "SET_LOADING", value: false });
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setField(field, value) {
    dispatch({ type: "SET_FIELD", field, value });
  }

  async function saveDraft() {
    dispatch({ type: "SET_SAVING", value: true });
    dispatch({ type: "SET_ERROR", error: null });
    try {
      await updateDraftRequest(state.requestId, buildWizardPayload(state.fields));
    } finally {
      dispatch({ type: "SET_SAVING", value: false });
    }
  }

  async function goNext() {
    try {
      await saveDraft();
      dispatch({ type: "SET_STEP", step: Math.min(state.step + 1, STEPS.length - 1) });
    } catch (err) {
      dispatch({ type: "SET_ERROR", error: err.message });
    }
  }

  function goBack() {
    dispatch({ type: "SET_STEP", step: Math.max(state.step - 1, 0) });
  }

  async function handleSubmit() {
    if (state.saving) return;
    dispatch({ type: "SET_SAVING", value: true });
    dispatch({ type: "SET_ERROR", error: null });
    try {
      await updateDraftRequest(state.requestId, buildWizardPayload(state.fields));
      await submitRequest(state.requestId);
      navigate("/portal/dashboard");
    } catch (err) {
      dispatch({ type: "SET_ERROR", error: err.message });
      dispatch({ type: "SET_SAVING", value: false });
    }
  }

  if (state.loading) {
    return <p className="portal-loading">Loading...</p>;
  }

  const StepComponent = STEPS[state.step].Component;
  const isLastStep = state.step === STEPS.length - 1;

  return (
    <div>
      <h1 className="portal-page-title">New Interior Design Request</h1>
      <p className="portal-page-sub">
        Tell us everything about your space so we can put together the right plan for you.
      </p>

      {state.error && <p className="portal-error">{state.error}</p>}

      <WizardProgressBar steps={STEPS} currentStep={state.step} />

      <section className="portal-section">
        <StepComponent state={state} setField={setField} dispatch={dispatch} requestId={state.requestId} />

        <div className="wizard-nav">
          <button type="button" className="btn" onClick={goBack} disabled={state.step === 0 || state.saving}>
            Back
          </button>
          {isLastStep ? (
            <button type="button" className="btn btn-solid" onClick={handleSubmit} disabled={state.saving}>
              {state.saving ? "Submitting..." : "Submit Request"}
            </button>
          ) : (
            <button type="button" className="btn btn-solid" onClick={goNext} disabled={state.saving}>
              {state.saving ? "Saving..." : "Next"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
