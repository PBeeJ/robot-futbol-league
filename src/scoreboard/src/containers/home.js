import React from "react";
// import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { push } from "connected-react-router";

import { Container } from "@material-ui/core";
// import { DataGrid } from "@material-ui/data-grid";

const Home = (props) => (
  <Container>
    <h1>Robot Futbol League</h1>
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
