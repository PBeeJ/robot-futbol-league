/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import useMeasure from "react-use-measure";

import { green, red, blue } from "@material-ui/core/colors";
import { Box, Button } from "@material-ui/core";

import { increaseScore, decreaseScore, sendMessage } from "../websockets";

const gridLines = 20;
const gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
const playerDiameterInCM = 21;

function Goal({ botIndex, showControls }) {
  return (
    <div style={{
      backgroundColor: botIndex === 0 ? red[400] : blue[400],
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
        {showControls && (
          <Button
            style={{ backgroundColor: "rgba(255,255,255,0.3)", marginBottom: 20 }}
            onClick={() => increaseScore(botIndex)}
          >
            Goal++
          </Button>
        )}
        {botIndex === 0 ? "red goal" : "blue goal"}
        {showControls && (
          <Button
            style={{ backgroundColor: "rgba(255,255,255,0.3)", marginTop: 20 }}
            onClick={() => decreaseScore(botIndex)}
          >
            Goal--
          </Button>
        )}
      </div>
    </div>
  );
}

function FieldCell() {
  return <div style={{ outline: "1px solid rgba(255,255,255,0.5)", pointerEvents: "none" }} />;
}

const handleFieldClick = (
  e, botIndex, fieldCenterX, fieldCenterY, fieldWidthUnit, fieldHeightUnit,
) => {
  const rect = e.target.getBoundingClientRect();
  const x = parseFloat(((e.clientX - rect.x - fieldCenterX) / fieldWidthUnit).toFixed(2));
  const y = parseFloat(((e.clientY - rect.y - fieldCenterY) / fieldHeightUnit).toFixed(2));
  const messageObject = {
    type: "manualPosition",
    data: { botIndex, x, y, heading: null },
  };
  sendMessage(messageObject);
};

function FieldGrid({ botIndex, fieldCenterX, fieldCenterY, fieldWidthUnit, fieldHeightUnit }) {
  return (
    <div
      style={{ display: "grid", flex: 1, gridTemplateColumns }}
      onClick={(e) => handleFieldClick(
        e, botIndex, fieldCenterX, fieldCenterY, fieldWidthUnit, fieldHeightUnit,
      )}
    >
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
      height={(botIndex === 0 ? pieceWidth : pieceHeight) || 0}
      style={{
          position: "absolute",
          zIndex: 1,
          backgroundColor: getPlayerColor(botIndex),
          left: positions[botIndex].x,
          top: positions[botIndex].y,
          borderRadius: (botIndex === 0 ? pieceWidth : 0) || 0,
        }}
    />
  );
}

// NOTE: if this component contains a botIndex, then it acts as the manual
// controller for that bot

const GameField = ({ gameState, gameConfig, showControls, botIndex }) => {
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
      <Goal botIndex={0} showControls={showControls} />
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
        <FieldGrid
          botIndex={botIndex}
          fieldCenterX={fieldCenterX}
          fieldCenterY={fieldCenterY}
          fieldWidthUnit={fieldWidthUnit}
          fieldHeightUnit={fieldHeightUnit}
        />
      </div>
      <Goal botIndex={1} showControls={showControls} />
    </div>
  );
};

const mapStateToProps = ({ gameState, gameConfig }) => ({
  gameState,
  gameConfig,
});

export default connect(mapStateToProps)(GameField);
