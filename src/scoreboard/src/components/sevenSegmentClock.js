import React from "react";

import { SevenSegmentNumber } from "./sevenSegmentNumber";

// Found on the interwebs: https://codepen.io/jonrohan/pen/qJzqXw
export function SevenSegmentClock({ seconds }) {
  const displayMinutes = Math.floor(seconds / 60)
    .toString()
    .split("");
  const displaySeconds = (seconds % 60).toString().split("");

  if (displayMinutes.length == 1) {
    displayMinutes.splice(0, 0, "0");
  }

  if (displaySeconds.length == 1) {
    displaySeconds.splice(0, 0, "0");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        padding: "20px 30px 20px 20px",
      }}
    >
      <SevenSegmentNumber value={displayMinutes[0]} />
      <SevenSegmentNumber value={displayMinutes[1]} />
      <Colon blink />
      <SevenSegmentNumber value={displaySeconds[0]} />
      <SevenSegmentNumber value={displaySeconds[1]} />
    </div>
  );
}

const Colon = (props) => {
  return <div className={`Colon ${props.blink ? "Colon--blink" : ""}`} />;
};
