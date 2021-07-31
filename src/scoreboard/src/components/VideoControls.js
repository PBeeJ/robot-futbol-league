import React from "react";
import { Button, Container, Grid } from "@material-ui/core";

import { yellow, red } from "@material-ui/core/colors";
import { H2 } from "./styledComponents";

import { playVideo } from "../websockets";

export default function VideoControls() {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ justifyContent: "center" }}>
          <H2 style={{ color: yellow[800] }}>Videos</H2>
          <Button
            style={{ marginTop: 15, marginRight: 15, backgroundColor: yellow[900] }}
            onClick={() => playVideo("videos/test.mp4")}
          >
            Play test
          </Button>
          <Button
            style={{ marginTop: 15, marginRight: 15, backgroundColor: yellow[900] }}
            onClick={() => playVideo("videos/welcome.mov")}
          >
            Play welcome
          </Button>
          <Button
            style={{ marginTop: 15, marginRight: 15, backgroundColor: red[900] }}
            onClick={() => playVideo(null)}
          >
            Stop video
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
