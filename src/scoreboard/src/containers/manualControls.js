import React from "react";
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

  const botIndex = parseInt(search.replace("?bot=", ""), 10);

  const isBluePlayer = !botIndex;

  return (
    <div style={{
      backgroundColor: isBluePlayer ? blue[100] : red[100],
       height: "100%",
      display: "grid",
      gridTemplateRows: "auto auto 1fr",
      }}
    >
      <Title>{isBluePlayer ? "Blue player" : "Red player" }</Title>
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
