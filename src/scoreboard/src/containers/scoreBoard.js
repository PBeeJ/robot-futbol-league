import React from "react";
import { connect } from "react-redux";
import { Container } from "@material-ui/core";
import styled from "styled-components";
import { red, blue } from "@material-ui/core/colors";

import { Link } from "react-router-dom";
import { GAME_STATE_LABELS } from "../selectors/enums";
import {
  gameStateStateSelector,
  secondsRemainingSelector,
  scoresSelector,
} from "../selectors/gameState";

import SevenSegmentClock from "../components/sevenSegmentClock";
import {
  H3,
  H4,
  FlexColumn,
  FlexCell,
} from "../components/styledComponents";
// import { SevenSegmentNumber } from '../components/sevenSegmentNumber';

function Score({ botIndex, name, score, color }) {
  return (
    <FlexCell>
      <Link to={`/play?bot=${botIndex}`} style={{ textDecoration: "none" }}>
        <FlexColumn style={{ backgroundColor: color, borderRadius: 2, padding: 5 }}>
          <H3 style={{ color: "white" }}>{name}</H3>
          <H4 style={{ color: "white" }}>{score}</H4>
        </FlexColumn>
      </Link>
    </FlexCell>
  );
}

const ScoreBoard = ({ gameStateState, secondsRemaining, scores }) => (
  <OurContainer>
    <div style={{
      display: "grid",
      gridTemplateColumns: "120px 1fr 120px",
      gridGap: 20,
    }}
    >
      <Score botIndex={1} name="Blue" score={scores[0]} color={blue[400]} />
      <FlexCell>
        <FlexColumn>
          <H3>
            <SevenSegmentClock seconds={secondsRemaining} />
          </H3>
          <H4 style={{ marginTop: 10 }}>{GAME_STATE_LABELS[gameStateState]}</H4>
        </FlexColumn>
      </FlexCell>
      <Score botIndex={2} name="Red" score={scores[1]} color={red[400]} />
    </div>
  </OurContainer>
);

const OurContainer = styled(Container)`
  background-color: rgba(255,255,255,0.25);
  max-width: 600px;
  text-align: center;
  border-radius: 10px;
`;

const mapStateToProps = (state) => ({
  gameStateState: gameStateStateSelector(state),
  secondsRemaining: secondsRemainingSelector(state),
  scores: scoresSelector(state),
});

export default connect(mapStateToProps)(ScoreBoard);
