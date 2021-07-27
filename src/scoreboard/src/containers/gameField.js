import React from "react";
import { connect } from "react-redux";
import useMeasure from "react-use-measure";

import { green, red, blue } from "@material-ui/core/colors";

import { Box } from "@material-ui/core";
import ball from "../images/ball.svg";

const gridLines = 20;
const gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
const playerDiameterInCM = 21;

function Goal({ color, name }) {
  return (
    <div style={{
      backgroundColor: color,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <div style={{
        textOrientation: "mixed",
        writingMode: "vertical-rl",
        color: "white",
        padding: 40,
      }}
      >
        {name}

      </div>
    </div>
  );
}

function FieldCell() {
  return <div style={{ outline: "1px solid rgba(255,255,255,0.5)" }} />;
}

function FieldGrid() {
  return (
    <div style={{ display: "grid", flex: 1, gridTemplateColumns }}>
      {[...Array(gridLines).keys()].map((item) => <FieldCell key={item} />)}
    </div>
  );
}

function getPosition(value, offset) {
  // Return 0, if the value is not a number
  if (Number.isNaN(value)) return 0;

  // Return value, adjusted for icon size
  return `${value - (offset / 2)}px`;
}

const GameField = ({ gameState, gameConfig }) => {
  const [containerRef, bounds] = useMeasure();

  // Calculate field dimensions
  const fieldCenterX = bounds.width / 2;
  const fieldCenterY = bounds.height / 2;
  const fieldWidth = gameConfig.bounds[2] - gameConfig.bounds[0];
  const fieldHeight = gameConfig.bounds[1] - gameConfig.bounds[3];
  const fieldWidthUnit = bounds.width / fieldWidth;
  const fieldHeightUnit = bounds.height / fieldHeight;
  const pieceProportion = playerDiameterInCM / gameConfig.centimetersPerUnit;
  const pieceHeight = pieceProportion * fieldHeightUnit;
  const pieceWidth = pieceProportion * fieldWidthUnit;

  // Calculate ball position
  const ballX = getPosition(gameState.bots[0].x * fieldWidthUnit + fieldCenterX, pieceWidth);
  const ballY = getPosition(-1 * gameState.bots[0].y * fieldHeightUnit + fieldCenterY, pieceHeight);

  // Calculate player positions
  const bot1X = getPosition(gameState.bots[1].x * fieldWidthUnit + fieldCenterX, pieceWidth);
  const bot1Y = getPosition(-1 * gameState.bots[1].y * fieldHeightUnit + fieldCenterY, pieceHeight);
  const bot2X = getPosition(gameState.bots[2].x * fieldWidthUnit + fieldCenterX, pieceWidth);
  const bot2Y = getPosition(-1 * gameState.bots[2].y * fieldHeightUnit + fieldCenterY, pieceHeight);

  function Ball() {
    return (
      <img
        alt=""
        src={ball}
        width={pieceWidth || 0}
        height={pieceHeight || 0}
        style={{
          position: "absolute",
          left: ballX,
          top: ballY,
        }}
      />
    );
  }

  function PlayerPiece(styleProps) {
    return (
      <Box
        width={pieceWidth || 0}
        height={pieceHeight || 0}
        style={{
          position: "absolute",
          ...styleProps,
        }}
      />
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      margin: 30,
    }}
    >
      <Goal name="blue goal" color={blue[400]} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: green[400],
          position: "relative",
        }}
        ref={containerRef}
      >
        <Ball />
        <PlayerPiece left={bot1X} top={bot1Y} backgroundColor={red[400]} />
        <PlayerPiece left={bot2X} top={bot2Y} backgroundColor={blue[400]} />
        <FieldGrid />
      </div>
      <Goal name="red goal" color={red[400]} />
    </div>
  );
};

const mapStateToProps = ({ gameState, gameConfig }) => ({
  gameState,
  gameConfig,
});

export default connect(mapStateToProps)(GameField);
