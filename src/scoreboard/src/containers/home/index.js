import React from "react";
// import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { push } from "connected-react-router";

import { Container } from "@material-ui/core";
// import { DataGrid } from "@material-ui/data-grid";

const Home = (props) => (
  <Container>
    <h1>Robot Futbol League</h1>
    <b>Robots</b>
    {props.gameState && (
      <table>
        <thead>
          <tr>
            <th width="100">name</th>
            <th width="60">x</th>
            <th width="60">y</th>
            <th width="80">heading</th>
          </tr>
        </thead>
        <tbody>
          {props.gameState.bots.map((bot) => (
            <tr key={bot.name}>
              <td>{bot.name}</td>
              <td>{bot.x}</td>
              <td>{bot.y}</td>
              <td>{bot.heading}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Container>
);

const mapStateToProps = ({ gameState }) => ({
  gameState: gameState,
});

// const mapDispatchToProps = (dispatch) =>
//   bindActionCreators(
//     {
//       increment,
//       incrementAsync,
//       decrement,
//       decrementAsync,
//       changePage: () => push("/about-us"),
//     },
//     dispatch
//   );

export default connect(mapStateToProps /*, mapDispatchToProps*/)(Home);
