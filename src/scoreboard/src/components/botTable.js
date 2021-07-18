import React from "react";
import { Container } from "@material-ui/core";

export function BotTable(props) {
  return (
    <Container>
      <h2>Bots</h2>
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
          {props.bots.map((bot) => (
            <tr key={bot.name}>
              <td>{bot.name}</td>
              <td>{bot.x}</td>
              <td>{bot.y}</td>
              <td>{bot.heading}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
