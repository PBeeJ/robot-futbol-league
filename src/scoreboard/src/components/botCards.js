import React, { useState } from "react";
import { Container, Grid } from "@material-ui/core";

import { yellow } from "@material-ui/core/colors";
import { H2 } from "./styledComponents";

import BotCard from "./botCard";
import BotDialog from "./botDialog";

export default function BotCards({ bots }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);

  const handleOnClose = () => setIsDialogOpen(false);
  const handleBotClick = (bot) => {
    setSelectedBot(bot);
    setIsDialogOpen(true);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ justifyContent: "center" }}>
          <H2 style={{ color: yellow[800] }}>Robots</H2>
        </Grid>
        {bots.map((bot) => (
          <Grid item key={bot.name} style={{ gridGap: 20 }}>
            <BotCard bot={bot} onClick={handleBotClick} />
          </Grid>
        ))}
      </Grid>
      <BotDialog
        bot={selectedBot}
        isOpen={isDialogOpen}
        onClose={handleOnClose}
      />
    </Container>
  );
}
