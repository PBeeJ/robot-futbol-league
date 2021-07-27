import React from "react";
import styled from "styled-components";

import { P, Em, FlexRow, Card, FlexCell } from "./styledComponents";

export default function BotCard({ bot, onClick }) {
  const handleClick = () => {
    onClick(bot);
  };

  return (
    <OurContainer $botMode={bot.mode} onClick={handleClick}>
      <div>
        <Em>{bot.name}</Em>
      </div>
      <FlexRow style={{ textAlign: "center" }}>
        <FlexCell>
          <P>
            ({bot.x},{bot.y})
          </P>
        </FlexCell>
        <FlexCell>
          <P>{bot.heading}°</P>
        </FlexCell>
      </FlexRow>
    </OurContainer>
  );
}

const OurContainer = styled(Card)`
  cursor: pointer;
  background-color: ${(props) =>
    props.$botMode === 0
      ? "rgba(0, 128, 28, .5)"
      : props.$botMode === 1
      ? "rgba(128, 0, 28, .5)"
      : "rgba(64, 64, 28, .4)"};
`;
