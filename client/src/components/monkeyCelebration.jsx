import { useEffect, useState } from "react";
import happyMonkey from "../assets/happy-monkey.png";

export default function MonkeyCelebration({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter -> shoot -> exit

  useEffect(() => {
    const shootTimer = setTimeout(() => setPhase("shoot"), 600);
    const exitTimer = setTimeout(() => setPhase("exit"), 1800);
    const doneTimer = setTimeout(() => onDone(), 2600);
    return () => {
      clearTimeout(shootTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className="monkey-celebration-overlay">
      {phase === "shoot" && (
        <>
          <div className="bullet bullet-1" />
          <div className="bullet bullet-2" />
          <div className="bullet bullet-3" />
          <div className="bang-text">BANG!</div>
        </>
      )}
      <img
        src={happyMonkey}
        alt="happy monkey"
        className={`celebration-monkey celebration-monkey--${phase}`}
      />
    </div>
  );
}
