import React from "react";
import { connect } from "react-redux";
import useMeasure from 'react-use-measure'

import { green } from "@material-ui/core/colors";

import bot from '../images/bot.png'; 
import ball from '../images/ball.svg'; 

const ICON_SIZE = 30;

const gridLines = 20;

const FieldCell = function() {
  return <div style={{ outline: '1px solid rgba(255,255,255,0.5)' }}></div>
}

const FieldGrid = function() {
  return <div style={{ 
      display: "grid",
      flex: 1,
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
      flexWrap: 'nowrap'
    }}>
    {[...Array(gridLines).keys()].map(item => <FieldCell key={item} />)}
  </div>
}

const getPosition = function(value) {
  // Return 0, if the value is not a number
  if (isNaN(value)) return 0;

  // Return value, adjusted for icon size
  return value - (ICON_SIZE / 2) + 'px';
}

const GameField = ({ gameState, gameConfig }) => {
  const [containerRef, bounds] = useMeasure()
  
  // Calculate field dimensions
  const fieldCenterX = bounds.width / 2;
  const fieldCenterY = bounds.height / 2;
  const fieldLength = gameConfig.bounds[2] - gameConfig.bounds[0];
  const fieldWidth = gameConfig.bounds[1] - gameConfig.bounds[3];
  const fieldLengthUnit = bounds.width / fieldLength;
  const fieldWidthUnit = bounds.height / fieldWidth;

  // Calculate ball position
  const ballX = getPosition(gameState.bots[0].x * fieldLengthUnit + fieldCenterX);
  const ballY = getPosition(gameState.bots[0].y * fieldWidthUnit + fieldCenterY);
  
  console.log(gameState.bots);

  // Calculate player positions
  const bot1X = getPosition(gameState.bots[1].x * fieldLengthUnit + fieldCenterX);
  const bot1Y = getPosition(gameState.bots[1].y * fieldWidthUnit + fieldCenterY);
  const bot2X = getPosition(gameState.bots[2].x * fieldLengthUnit + fieldCenterX);
  const bot2Y = getPosition(gameState.bots[2].y * fieldWidthUnit + fieldCenterY);

  return (
    <>
      <div style={{
        display: 'flex',
          justifyContent: 'center',
          margin: '0 30px 30px 30px',
          backgroundColor: green[400],
          position: 'relative',
        }} ref={containerRef}>
          <img alt="" src={ball} width={ICON_SIZE} height={ICON_SIZE} style={{
            position: 'absolute',
            left: ballX,
            top: ballY
          }}/>
          {<img alt="" src={bot} width={ICON_SIZE} height={ICON_SIZE} style={{
            position: 'absolute',
            left: bot1X,
            top: bot1Y
          }}/>}
          <img alt="" src={bot} width={ICON_SIZE} height={ICON_SIZE} style={{
            position: 'absolute',
            left: bot2X,
            top: bot2Y
          }}/>
          <FieldGrid/>
      </div>
    </>
  );
};

const mapStateToProps = ({ gameState, gameConfig }) => ({
  gameState,
  gameConfig
});

export default connect(mapStateToProps)(GameField);
