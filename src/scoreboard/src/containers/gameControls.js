import React from "react";
import styled from "styled-components";

import { connect } from "react-redux";
import { Container, Grid, Fab } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

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
const GameControls = ({ gameState }) => (
  <Container>
    <Grid container justify="center">
      <Grid item>
        <BigAssButton>
          <H3>Game On!</H3>
        </BigAssButton>
      </Grid>
    </Grid>
  </Container>
);

const BigAssButton = styled(Fab).attrs((props) => ({
  size: "large",
  variant: "extended",
  ...props,
}))`
  margin: 40px;
  padding: 22px;
  background-color: ${green["A400"]};
`;

const mapStateToProps = ({ gameState }) => ({
  gameState,
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(GameControls);
