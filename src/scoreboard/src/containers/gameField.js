import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import useMeasure from "react-use-measure";

import { green, red, blue } from "@material-ui/core/colors";

import { Box } from "@material-ui/core";

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
  if (Number.isNaN(value)) return "0px";

  // Return value, adjusted for icon size
  return `${value - (offset / 2)}px`;
}

function getPlayerColor(botIndex) {
  switch (botIndex) {
    case 1: return red[400];
    case 2: return blue[400];
    default: return "white";
  }
}

function PlayerPiece({
    positions, botIndex, pieceWidth, pieceHeight,
}) {
  return (
    <Box
      width={pieceWidth || 0}
      height={pieceHeight || 0}
      style={{
          position: "absolute",
          zIndex: 1,
          backgroundColor: getPlayerColor(botIndex),
          left: positions[botIndex].x,
          top: positions[botIndex].y,
        }}
    />
  );
}

const GameField = ({ gameState, gameConfig }) => {
  const [containerRef, bounds] = useMeasure();
  const [positions, setPositions] = useState(
    { 0: { x: 0, y: 0 }, 1: { x: 0, y: 0 }, 2: { x: 0, y: 0 } },
  );

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

  useEffect(() => {
    setPositions({
      0: {
        x: getPosition(gameState.bots[0].x * fieldWidthUnit + fieldCenterX, pieceWidth),
        y: getPosition(-1 * gameState.bots[0].y * fieldHeightUnit + fieldCenterY, pieceHeight),
      },
      1: {
        x: getPosition(gameState.bots[1].x * fieldWidthUnit + fieldCenterX, pieceWidth),
        y: getPosition(-1 * gameState.bots[1].y * fieldHeightUnit + fieldCenterY, pieceHeight),
      },
      2: {
        x: getPosition(gameState.bots[2].x * fieldWidthUnit + fieldCenterX, pieceWidth),
        y: getPosition(-1 * gameState.bots[2].y * fieldHeightUnit + fieldCenterY, pieceHeight),
      },
    });
  }, [gameState]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      padding: 30,
      flex: 1,
      width: "100%",
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
        <PlayerPiece
          botIndex={0}
          positions={positions}
          pieceWidth={pieceWidth}
          pieceHeight={pieceHeight}
          bounds={bounds}
        />
        <PlayerPiece
          botIndex={1}
          positions={positions}
          pieceWidth={pieceWidth}
          pieceHeight={pieceHeight}
          bounds={bounds}
        />
        <PlayerPiece
          botIndex={2}
          positions={positions}
          pieceWidth={pieceWidth}
          pieceHeight={pieceHeight}
          bounds={bounds}
        />
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
