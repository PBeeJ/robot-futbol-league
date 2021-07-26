import React from "react";
import { connect } from "react-redux";
import useMeasure from "react-use-measure";

import { green, red, blue } from "@material-ui/core/colors";

import { Box } from "@material-ui/core";
import ball from "../images/ball.svg";

const iconSize = 30;
const gridLines = 20;
const gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";

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

function getPosition(value) {
  // Return 0, if the value is not a number
  if (Number.isNaN(value)) return 0;

  // Return value, adjusted for icon size
  return `${value - (iconSize / 2)}px`;
}

const GameField = ({ gameState, gameConfig }) => {
  const [containerRef, bounds] = useMeasure();

  // Calculate field dimensions
  const fieldCenterX = bounds.width / 2;
  const fieldCenterY = bounds.height / 2;
  const fieldLength = gameConfig.bounds[2] - gameConfig.bounds[0];
  const fieldWidth = gameConfig.bounds[1] - gameConfig.bounds[3];
  const fieldLengthUnit = bounds.width / fieldLength;
  const fieldWidthUnit = bounds.height / fieldWidth;

  // Calculate ball position
  const ballX = getPosition(gameState.bots[0].x * fieldLengthUnit + fieldCenterX);
  const ballY = getPosition(-1 * gameState.bots[0].y * fieldWidthUnit + fieldCenterY);

  // Calculate player positions
  const bot1X = getPosition(gameState.bots[1].x * fieldLengthUnit + fieldCenterX);
  const bot1Y = getPosition(-1 * gameState.bots[1].y * fieldWidthUnit + fieldCenterY);
  const bot2X = getPosition(gameState.bots[2].x * fieldLengthUnit + fieldCenterX);
  const bot2Y = getPosition(-1 * gameState.bots[2].y * fieldWidthUnit + fieldCenterY);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "0 30px 30px 30px",
          backgroundColor: green[400],
          position: "relative",
        }}
        ref={containerRef}
      >
        <img
          alt=""
          src={ball}
          width={iconSize}
          height={iconSize}
          style={{
            position: "absolute",
            left: ballX,
            top: ballY,
          }}
        />
        <Box
          width={iconSize}
          height={iconSize}
          style={{
            position: "absolute",
            left: bot1X,
            top: bot1Y,
            backgroundColor: red[400],
          }}
        />
        <Box
          width={iconSize}
          height={iconSize}
          style={{
            position: "absolute",
            left: bot2X,
            top: bot2Y,
            backgroundColor: blue[400],
          }}
        />
        <FieldGrid />
      </div>
    </>
  );
};

const mapStateToProps = ({ gameState, gameConfig }) => ({
  gameState,
  gameConfig,
});

export default connect(mapStateToProps)(GameField);
