import React from "react";
import { connect } from "react-redux";
import { Container, Grid, Fab } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import styled from "styled-components";

import { GAME_STATES } from "../selectors/enums";
import { gameStateStateSelector } from "selectors/gameState";
import {
  sendGameStart,
  sendGameStop,
  sendGamePause,
  sendGameResume,
  sendReturnToHome,
} from "../websockets";

import { H3 } from "components/styledComponents";

/*
  Things the human referee most urgently needs to do:
  - Start Game
  - When Game is running:
    - Pause Game
  - When Game is Paused:
    - Reset to Home Positions
    - Resume Game
    - Quit Game (reset clock)

  Things human needs needs to see:
  - gameState.gameStatus.state
  - gameState.gameStatus.secondsRemaining
  - Where positioning system thinks bots are at
    imposed on a graphical playing field
  - Confirmation that bots are online

*/
const GameControls = ({ gameStateState }) => {
  const GameOnButton = () => (
    <Grid item>
      <BigAssButton onClick={() => sendGameStart()}>
        <H3>Game On!</H3>
      </BigAssButton>
    </Grid>
  );

  const PauseButton = () => (
    <Grid item>
      <BigAssButton onClick={() => sendGamePause()}>
        <H3>Pause Game</H3>
      </BigAssButton>
    </Grid>
  );

  const ResumeButton = () => (
    <Grid item>
      <BigAssButton onClick={() => sendGameResume()}>
        <H3>Resume Game</H3>
      </BigAssButton>
    </Grid>
  );

  const ReturnToHomeButton = () => (
    <Grid item>
      <BigAssButton onClick={() => sendReturnToHome()}>
        <H3>Return to Home</H3>
      </BigAssButton>
    </Grid>
  );

  const EndGameButton = () => (
    <Grid item>
      <BigAssButton onClick={() => sendGameStop()}>
        <H3>End Game</H3>
      </BigAssButton>
    </Grid>
  );

  const Buttons = () => {
    const buttons = [];
    switch (gameStateState) {
      case GAME_STATES.game_over:
        buttons.push(<GameOnButton />);
        break;
      case GAME_STATES.game_on:
        buttons.push(<PauseButton />);
        break;
      case GAME_STATES.game_paused:
        buttons.push(<ResumeButton />);
        buttons.push(<ReturnToHomeButton />);
        buttons.push(<EndGameButton />);
        break;
      case GAME_STATES.return_home:
        buttons.push(<PauseButton />);
        break;
      default:
        return `Invalid gameStatus.state ${gameStateState}`;
    }
    return buttons;
  };

  return (
    <Container>
      <Grid container justify="center">
        <Grid item>
          <Buttons />
        </Grid>
      </Grid>
    </Container>
  );
};

const BigAssButton = styled(Fab).attrs((props) => ({
  size: "large",
  variant: "extended",
  ...props,
}))`
  margin: 40px;
  padding: 22px;
  background-color: ${green["A400"]};
`;

const mapStateToProps = (state) => ({
  gameStateState: gameStateStateSelector(state),
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(GameControls);
