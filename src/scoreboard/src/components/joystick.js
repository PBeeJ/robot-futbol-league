import React, { useState, useRef } from "react";
import styled from "styled-components";

import { red } from "@material-ui/core/colors";

import { sendManualThrottle } from "../websockets";

export default function Joystick({botIndex}) {
  const [relativeX, setRelativeX] = useState(0);
  const [relativeY, setRelativeY] = useState(0);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const containerRef = useRef();

  const handleMouseDown = (event) => {
    setMouseIsDown(true);
    setRelativePosition(event.clientX, event.clientY);
  };

  const handleMouseMove = (event) => {
    if (mouseIsDown) {
      console.log("mouseMove", { event });
      setRelativePosition(event.clientX, event.clientY);
    }
  };

  const handleMouseUp = () => {
    setMouseIsDown(false);
    setRelativeX(0);
    setRelativeY(0);
  };

  const setRelativePosition = (clientX, clientY) => {
    const offsetLeft = clientX - containerRef.current.offsetLeft - 100;
    const offsetTop = clientY - containerRef.current.offsetTop - 100;
    console.log("computed offsets", { offsetLeft, offsetTop });
    setRelativeX(offsetLeft);
    setRelativeY(offsetTop);

    const rawThrottle = 0.6 * (offsetTop / 100);
    const throttleLeft
    sendManualThrottle(botIndex, rawThrottle, rawThrottle);
  };

  console.log({ relativeX, relativeY });
  return (
    <OurContainer
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <OurPosition $relativeX={relativeX} $relativeY={relativeY} />
    </OurContainer>
  );
}

const OurContainer = styled.div`
  position: relative;
  height: 200px;
  width: 200px;
  border: 1px solid black;
`;

const OurPosition = styled.div`
  position: absolute;
  top: ${(props) => 100 + props.$relativeY - 5}px;
  left: ${(props) => 100 + props.$relativeX - 5}px;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${red[600]};
`;
