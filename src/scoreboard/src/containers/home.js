import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { Container } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

import ScoreBoard from "./scoreBoard";
import { H1 } from "../components/styledComponents";

const Home = (props) => (
  <OurContainer>
    <Title>Robot Futbol League</Title>
    <ScoreBoardWrapper>
      <ScaledWrapper>
        <ScoreBoard large />
      </ScaledWrapper>
    </ScoreBoardWrapper>
  </OurContainer>
);

const OurContainer = styled(Container)`
  background-color: ${green[100]};
  position: absolute;
  height: 100%;
`;

const Title = styled(H1)`
  text-align: center;
  margin: 40px !important;
`;

const ScoreBoardWrapper = styled.div`
  height: 300px;
`;

const ScaledWrapper = styled.div`
  transform: scale(1.5);
  transform-origin: top;
`;

const mapStateToProps = ({ gameState }) => ({
  gameState: gameState,
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(Home);
