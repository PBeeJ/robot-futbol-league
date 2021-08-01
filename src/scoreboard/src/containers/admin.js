import React from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { brown, yellow } from "@material-ui/core/colors";

import GameControls from "./gameControls";
import ScoreBoard from "./scoreBoard";
import GameField from "./gameField";

import BotCards from "../components/botCards";
import VideoControls from "../components/VideoControls";
import VideoPlayer from "../components/VideoPlayer";
import { H1, P } from "../components/styledComponents";

const Admin = ({ gameState, videoState }) => (
  <Grid style={{
      display: "flex",
      flexDirection: "column",
      gridTemplateRows: "auto 1fr 1fr 1fr 5fr",
      justifyItems: "center",
      alignItems: "center",
      backgroundColor: brown[700],
      padding: "0 20px",
      position: "relative",
    }}
  >
    <div style={{ display: "grid", justifyItems: "center", alignItems: "center" }}>
      <H1 style={{ color: yellow[700], marginTop: 20 }}>Admin Page</H1>
      <P style={{ color: "white", fontSize: "1.2em" }}>
        If you found this accidentally while hacking, congrats! But the
        game-controller isn&apos;t going to accept any update commands that come from
        IP addresses other than those it recognizes as admin.
      </P>
    </div>
    <GameControls />
    <ScoreBoard />
    <Grid style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
      <BotCards bots={gameState.bots} />
      <VideoControls />
      <VideoPlayer video={videoState.video} />
    </Grid>
    <GameField showControls botIndex={0} />
  </Grid>
  );

const mapStateToProps = ({ gameState, videoState }) => ({
  gameState,
  videoState,
});

export default connect(mapStateToProps /* , mapDispatchToProps */)(Admin);
