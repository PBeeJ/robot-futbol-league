import React from "react";
import { connect } from "react-redux";
import { Container } from "@material-ui/core";

import { BotTable } from "components/botTable";
const Admin = ({ gameState }) => (
  <Container>
    <h1>Admin Page</h1>
    <p>
      If you found this accidentally while hacking, congrats! But the
      game-controller isn't going to accept any update commands that come from
      IP addresses other than those it recognizes as admin.
    </p>
    <BotTable bots={gameState.bots} />
  </Container>
);

const mapStateToProps = ({ gameState }) => ({
  gameState,
});

export default connect(mapStateToProps /*, mapDispatchToProps*/)(Admin);
