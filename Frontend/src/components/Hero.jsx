import { useAutoRotate } from "../hooks/useAutoRotate";
import "./Hero.css";

// TODO: These are stand-in Unsplash photos (free license, no attribution
// required) so the walkthrough has real imagery to feel out the effect.
// Swap in actual Space Design Group project photography in
// src/assets/images/ when it's available, keeping the same filenames or
// updating the imports below.
import exteriorHouse from "../assets/images/exterior-house.jpg";
import roomLiving from "../assets/images/room-living.jpg";
import roomKitchen from "../assets/images/room-kitchen.jpg";
import roomBedroom from "../assets/images/room-bedroom.jpg";
import roomBath from "../assets/images/room-bath.jpg";

const FRAMES = [
  { id: "exterior", label: "The House", image: exteriorHouse },
  { id: "living", label: "Living Room", image: roomLiving },
  { id: "kitchen", label: "Kitchen", image: roomKitchen },
  { id: "bedroom", label: "Bedroom", image: roomBedroom },
  { id: "bath", label: "Bathroom", image: roomBath },
];

const SLIDE_INTERVAL_MS = 1000;

export function Hero() {
  const { activeIndex, goTo } = useAutoRotate({
    count: FRAMES.length,
    intervalMs: SLIDE_INTERVAL_MS,
  });

  return (
    <section className="hero">
      <div className="hero__intro container">
        <p className="eyebrow">Space Design Group</p>
        <h1 className="hero__title">
          Step inside.
          <br />
          Keep scrolling.
        </h1>
      </div>

      <div className="hero__stage" aria-hidden="true">
        {FRAMES.map((frame, index) => (
          <div
            key={frame.id}
            className={
              "hero__card" + (index === activeIndex ? " is-active" : "")
            }
          >
            <img src={frame.image} alt="" />
          </div>
        ))}
        <div className="hero__vignette" />
      </div>

      <div className="hero__meta container">
        <span className="hero__room-label">{FRAMES[activeIndex].label}</span>
        <div className="hero__dots">
          {FRAMES.map((frame, index) => (
            <button
              key={frame.id}
              type="button"
              className={
                "hero__dot" + (index === activeIndex ? " is-active" : "")
              }
              aria-label={`Show ${frame.label}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
