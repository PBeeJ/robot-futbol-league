import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import useMeasure from "react-use-measure";

import { green, red, blue } from "@material-ui/core/colors";

import { Box } from "@material-ui/core";
import Draggable from "react-draggable";
import ball from "../images/ball.svg";
import { sendMessage } from "../websockets";

const gridLines = 20;
const gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
const playerDiameterInCM = 21;

// TODO: prevent the game state from updating, if the state is being dragged

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

  function handleDragStart(e, botIndex) {
    console.log("handleDragStart");
    setIsDragging(true);

    // TODO: use this data, to set a ghost element that will show where the item was dragged from
    console.log({ x: e.target.offsetLeft, y: e.target.offsetTop, botIndex });

    // Prevent default dragging
    e.preventDefault();
  }

  function handleDragStop(e, botIndex) {
    console.log("handleDragStop");
    const x = parseFloat(((e.x - bounds.left - fieldCenterX) / fieldWidthUnit).toFixed(2));
    const y = parseFloat(((e.y - bounds.top - fieldCenterY) / fieldHeightUnit).toFixed(2));
    const messageObject = {
      type: "manualPosition",
      data: {
        botIndex, x, y, heading: null,
      },
    };
    sendMessage(messageObject);

    setIsDragging(false);
  }

  function Ball() {
    return (
      <Draggable
        handle=".draggable"
        defaultPosition={{ x: 0, y: 0 }}
        grid={[1, 1]}
        onStart={handleDragStart}
        onStop={(e) => handleDragStop(e, 0)}
        // disabled={!enableDragging}
      >
        <img
          className="draggable"
          alt=""
          src={ball}
          width={pieceWidth || 0}
          height={pieceHeight || 0}
          style={{
            position: "absolute",
            zIndex: 1,
            left: positions[0].x,
            top: positions[0].y,
          }}
          // draggable={enableDragging}
        />
      </Draggable>
    );
  }

  function PlayerPiece({ botIndex, ...styleProps }) {
    return (
      <Draggable
        handle=".draggable"
        defaultPosition={{ x: 0, y: 0 }}
        grid={[10, 10]}
        onStart={handleDragStart}
        onStop={(e) => handleDragStop(e, botIndex)}
        // disabled={!enableDragging}
      >
        <Box
          className="draggable"
          width={pieceWidth || 0}
          height={pieceHeight || 0}
          style={{
            position: "absolute",
            zIndex: 1,
            ...styleProps,
          }}
        />
      </Draggable>
    );
  }

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
        <Ball />
        <PlayerPiece
          botIndex={0}
          left={positions[1].x}
          top={positions[1].y}
          backgroundColor={red[400]}
        />
        <PlayerPiece
          botIndex={1}
          left={positions[2].y}
          top={positions[2].y}
          backgroundColor={blue[400]}
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
