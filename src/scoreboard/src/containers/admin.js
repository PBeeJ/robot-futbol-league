import React from "react";
import { connect } from "react-redux";
import { Container } from "@material-ui/core";

import GameControls from "containers/gameControls";
import ScoreBoard from "containers/scoreBoard";

import { BotCards } from "components/botCards";
import { H1, P } from "components/styledComponents";

const Admin = ({ gameState }) => (
  <Container>
    <H1>Admin Page</H1>
    <P>
      If you found this accidentally while hacking, congrats! But the
      game-controller isn't going to accept any update commands that come from
      IP addresses other than those it recognizes as admin.
    </P>
    <GameControls />
    <ScoreBoard />
    <BotCards bots={gameState.bots} />
  </Container>
);

const mapStateToProps = ({ gameState }) => ({
  gameState,
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(Admin);
