/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-alert */
import React, { useState } from "react";

import useMeasure from "react-use-measure";
import { sendManualThrottle } from "../websockets";

export default function Joystick({ botIndex }) {
  const [relativeX, setRelativeX] = useState(0);
  const [relativeY, setRelativeY] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [containerRef, bounds] = useMeasure();
  const JOYSTICK_WIDTH = bounds.width;

  const handleMouseDown = (event) => {
    event.preventDefault();
    setMouseIsDown(true);
    setRelativePosition(event.clientX, event.clientY);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    if (mouseIsDown) {
      setRelativePosition(event.clientX, event.clientY);
    }
  };

  const handleMouseUp = () => {
    setMouseIsDown(false);
    setRelativeX(0);
    setRelativeY(0);
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    setMouseIsDown(true);
    setRelativePosition(event.touches[0].clientX, event.touches[0].clientY);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    if (mouseIsDown) {
      setRelativePosition(event.touches[0].clientX, event.touches[0].clientY);
    }
  };

  const setRelativePosition = (clientX, clientY) => {
    const offsetLeft = clientX - bounds.left - (JOYSTICK_WIDTH / 2);
    const offsetTop = clientY - bounds.top - (JOYSTICK_WIDTH / 2) - 50;
    setRelativeX(offsetLeft);
    setRelativeY(offsetTop);

    const rawThrottle = (offsetTop / (JOYSTICK_WIDTH / 2)) * -1;

    sendManualThrottle(botIndex, rawThrottle, rawThrottle);
  };

  return (
    <div
      style={{
        marginTop: 20,
        position: "relative",
        height: JOYSTICK_WIDTH || "100%",
        width: JOYSTICK_WIDTH || "100%",
        border: "1px dashed #444",
        maxWidth: 600,
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div
        style={{
         position: "absolute",
         top: (JOYSTICK_WIDTH / 2) + relativeY - 20,
         left: (JOYSTICK_WIDTH / 2) + relativeX - 12,
         height: 20,
         width: 20,
         borderRadius: 10,
         backgroundColor: "white",
        }}
      />
    </div>
  );
}
