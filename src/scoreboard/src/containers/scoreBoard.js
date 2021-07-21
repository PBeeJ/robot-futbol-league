import React from "react";
import { connect } from "react-redux";
import { Container } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import styled from "styled-components";

import { GAME_STATE_LABELS } from "../selectors/enums";
import {
  gameStateStateSelector,
  secondsRemainingSelector,
  scoresSelector,
} from "selectors/gameState";

import { SevenSegmentClock } from "../components/sevenSegmentClock";
import {
  H3,
  H4,
  FlexRow,
  FlexColumn,
  FlexCell,
} from "components/styledComponents";
import { SevenSegmentNumber } from "../components/sevenSegmentNumber";

const ScoreBoard = ({ gameStateState, secondsRemaining, scores }) => {
  return (
    <OurContainer>
      <FlexRow>
        <FlexCell>
          <FlexColumn>
            <H3>Blue</H3>
            <H4>{scores[0]}</H4>
          </FlexColumn>
        </FlexCell>
        <FlexCell>
          <FlexColumn>
            <H3>
              <SevenSegmentClock seconds={secondsRemaining} />
            </H3>
            <H4>{GAME_STATE_LABELS[gameStateState]}</H4>
          </FlexColumn>
        </FlexCell>
        <FlexCell>
          <FlexColumn>
            <H3>Red</H3>
            <H4>{scores[1]}</H4>
          </FlexColumn>
        </FlexCell>
      </FlexRow>
    </OurContainer>
  );
};

const OurContainer = styled(Container)`
  background-color: ${purple[400]};
  max-width: 600px;
  padding: 20px 20px;
  text-align: center;
  margin-bottom: 30px;
`;

const mapStateToProps = (state) => ({
  gameStateState: gameStateStateSelector(state),
  secondsRemaining: secondsRemainingSelector(state),
  scores: scoresSelector(state),
});

export default connect(mapStateToProps)(ScoreBoard);
