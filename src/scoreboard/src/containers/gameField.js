import React, { useState, useEffect } from "react";
import useMeasure from "react-use-measure";

import { green, red, blue } from "@material-ui/core/colors";

import Draggable from "react-draggable";
import { connect } from "react-redux";
import { sendMessage } from "../websockets";

const gridLines = 20;
const gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
const playerDiameterInCM = 21;

function handleDragStart(e, botIndex, setIsDragging) {
  setIsDragging(true);

  // TODO: use this data, to set a ghost element that will show where the item was dragged from
  console.log({ x: e.target.offsetLeft, y: e.target.offsetTop, botIndex });

  // Prevent default dragging
  e.preventDefault();
}

function handleDragStop(
  e, botIndex, setIsDragging, bounds, fieldCenterX,
  fieldCenterY, fieldWidthUnit, fieldHeightUnit,
) {
  const x = parseFloat(((e.x - bounds.left - fieldCenterX) / fieldWidthUnit).toFixed(2));
  const y = parseFloat(((e.y - bounds.top - fieldCenterY) / fieldHeightUnit).toFixed(2));
  const messageObject = {
    type: "manualPosition",
    data: { botIndex, x, y, heading: null },
  };
  sendMessage(messageObject);

  setIsDragging(false);
}

function PlayerPiece({
  botIndex,
  backgroundColor,
  handleStart,
  handleStop,
  positions,
  pieceHeight,
  pieceWidth,
}) {
  const transform = `translate(${positions[botIndex].x}, ${positions[botIndex].y})`;
  return (
    <Draggable
      handle=".draggable"
      defaultPosition={{ x: 0, y: 0 }}
      grid={[1, 1]}
      onStart={handleStart}
      onStop={handleStop}
    >
      <div
        className="draggable"
        style={{
          position: "absolute",
          zIndex: 1,
          left: 0,
          top: 0,
          backgroundColor,
          borderRadius: pieceHeight && botIndex === 0 ? pieceHeight : 0,
          width: pieceWidth || 0,
          height: pieceHeight || 0,
          transform,
        }}
      />
    </Draggable>
  );
}

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
  return `${parseInt(value - (offset / 2), 10)}px`;
}

const GameField = ({ gameConfig, gameState }) => {
  const [containerRef, bounds] = useMeasure();
  const [isDragging, setIsDragging] = useState(false);
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
    if (!isDragging) {
      // Calculate player positions
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
    }
  }, [isDragging, gameState]);

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
          backgroundColor="white"
          handleStart={(e) => handleDragStart(e, 0, setIsDragging)}
          handleStop={(e) => handleDragStop(
            e, 0, setIsDragging, bounds,
            fieldCenterX, fieldCenterY, fieldWidthUnit, fieldHeightUnit,
          )}
          positions={positions}
          pieceHeight={pieceHeight}
          pieceWidth={pieceWidth}
        />
        <PlayerPiece
          botIndex={1}
          backgroundColor={red[400]}
          handleStart={(e) => handleDragStart(e, 1, setIsDragging)}
          handleStop={(e) => handleDragStop(
            e, 1, setIsDragging, bounds,
            fieldCenterX, fieldCenterY, fieldWidthUnit, fieldHeightUnit,
          )}
          positions={positions}
          pieceHeight={pieceHeight}
          pieceWidth={pieceWidth}
        />
        <PlayerPiece
          botIndex={2}
          backgroundColor={blue[400]}
          handleStart={(e) => handleDragStart(e, 2, setIsDragging)}
          handleStop={(e) => handleDragStop(
            e, 2, setIsDragging, bounds,
            fieldCenterX, fieldCenterY, fieldWidthUnit, fieldHeightUnit,
          )}
          positions={positions}
          pieceHeight={pieceHeight}
          pieceWidth={pieceWidth}
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
