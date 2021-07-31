import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { blue, red, purple } from "@material-ui/core/colors";

import { useLocation } from "react-router";
import ScoreBoard from "./scoreBoard";
import GameField from "./gameField";
import { H1 } from "../components/styledComponents";
import VideoPlayer from "../components/VideoPlayer";

const ManualControls = ({ videoState }) => {
  const { search } = useLocation();
  const [xPox, setXPox] = useState(false);

  const botIndex = parseInt(search.replace("?bot=", ""), 10);

  const isBluePlayer = botIndex === 1;

  function handleOrientation(event) {
    setXPox(event.alpha);
    // updateFieldIfNotNull('Orientation_a', event.alpha);
    // updateFieldIfNotNull('Orientation_b', event.beta);
    // updateFieldIfNotNull('Orientation_g', event.gamma);
  }

  useEffect(() => {
    // Check for permissions
    if (
      window.DeviceMotionEvent
      && typeof window.DeviceMotionEvent.requestPermission === "function"
    ) {
      window.DeviceMotionEvent.requestPermission();

      window.addEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  const suffix = xPox ? ` player (${xPox})` : " player";

  return (
    <div style={{
      backgroundColor: isBluePlayer ? blue[100] : red[100],
       height: "100%",
      display: "grid",
      gridTemplateRows: "auto auto 1fr",
      }}
    >
      <Title>{`${isBluePlayer ? "Blue" : "Red"}${suffix}` }</Title>
      <ScoreBoard />
      <GameField enableDragging={false} botIndex={botIndex} />
      <VideoPlayer video={videoState.video} isFullScreen />
    </div>
);
 };

const Title = styled(H1)`
  text-align: center;
  padding: 30px;
  font-family: SoccerLeague !important;
  color: white;
  letter-spacing: 0em !important;
  text-shadow: 0 3px 5px #8c8c8c;
  -webkit-text-stroke: 2px ${purple[400]};
`;

const mapStateToProps = ({ gameState, videoState }) => ({
  gameState,
  videoState,
});

export default connect(mapStateToProps /* , mapDispatchToProps */)(ManualControls);
