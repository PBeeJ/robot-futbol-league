import React from "react";
import { Container, Grid } from "@material-ui/core";

import { H2 } from "components/styledComponents";

import { BotCard } from "components/botCard";

export function BotCards(props) {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ justifyContent: "center" }}>
          <H2>Robots</H2>
        </Grid>
        {props.bots.map((bot) => (
          <Grid item>
            <BotCard bot={bot} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
