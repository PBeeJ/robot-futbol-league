import React from "react";
import { Container, Grid } from "@material-ui/core";

import { H2 } from "./styledComponents";

import BotCard from "./botCard";

export default function BotCards({ bots }) {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ justifyContent: "center" }}>
          <H2>Robots</H2>
        </Grid>
        {bots.map((bot) => (
          <Grid item key={bot.name}>
            <BotCard bot={bot} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
