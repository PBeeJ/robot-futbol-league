/* eslint-disable no-alert */
import React, { useState } from "react";

import { red } from "@material-ui/core/colors";
import useMeasure from "react-use-measure";
import { sendManualThrottle } from "../websockets";

export default function Joystick({ botIndex }) {
  const [relativeX, setRelativeX] = useState(0);
  const [relativeY, setRelativeY] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [containerRef, bounds] = useMeasure();
  const JOYSTICK_WIDTH = bounds.width;

  const handleMouseDown = (event) => {
    console.log("event: ", event.clientX);
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
    const offsetTop = clientY - bounds.top - (JOYSTICK_WIDTH / 2);
    setRelativeX(offsetLeft);
    setRelativeY(offsetTop);

    const rawThrottle = (offsetTop / (JOYSTICK_WIDTH / 2)) * -1;

    sendManualThrottle(botIndex, rawThrottle, rawThrottle);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{
        position: "relative",
        height: JOYSTICK_WIDTH || "100%",
        width: JOYSTICK_WIDTH || "100%",
        border: "1px solid black",
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
         top: (JOYSTICK_WIDTH / 2) + relativeY - 5,
         left: (JOYSTICK_WIDTH / 2) + relativeX - 5,
         height: 10,
         width: 10,
         borderRadius: 5,
         backgroundColor: red[600],
        }}
      />
    </div>
  );
}
