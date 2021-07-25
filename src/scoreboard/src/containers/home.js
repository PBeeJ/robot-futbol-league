import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { Grid } from "@material-ui/core";
import { green, purple } from "@material-ui/core/colors";

import ScoreBoard from "./scoreBoard";
import GameField from "./gameField";
import { H1 } from "../components/styledComponents";

const Home = () => (
  <OurContainer>
    <Title>Robot Futbol League</Title>
    <ScoreBoard />
    <GameField />
  </OurContainer>
);

const OurContainer = styled(Grid)`
  background-color: ${green[100]};
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr;
`;

const Title = styled(H1)`
  text-align: center;
  padding: 30px;
  font-family: SoccerLeague !important;
  color: white;
  letter-spacing: 0em !important;
  text-shadow: 0 3px 5px #8c8c8c;
  -webkit-text-stroke: 2px ${purple[400]};
`;

const mapStateToProps = ({ gameState }) => ({
  gameState: gameState,
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(Home);
