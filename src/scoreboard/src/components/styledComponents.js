import { Typography, Paper } from "@material-ui/core";
import styled from "styled-components";

export const H1 = styled(Typography).attrs(() => ({
  variant: "h1",
}))`
  // add additional styling here
  font-family: SoccerLeague !important;
  font-size: 3em !important;
  transform: translateY(4px); // HACK: fix vertical alignment
`;

export const H2 = styled(Typography).attrs(() => ({
  variant: "h2",
}))`
  // add additional styling here
  font-family: SoccerLeague !important;
  font-size: 2em !important;
  transform: translateY(4px); // HACK: fix vertical alignment
`;

export const H3 = styled(Typography).attrs(() => ({
  variant: "h3",
}))`
  font-family: SoccerLeague !important;
  text-transform: none;
  transform: translateY(4px); // HACK: fix vertical alignment
`;

export const H4 = styled(Typography).attrs(() => ({
  variant: "h4",
}))`
  text-transform: none;
  font-family: SoccerLeague !important;
  font-size: 3em !important;
  margin-top: 20px !important;
  transform: translateY(4px); // HACK: fix vertical alignment
`;

export const H5 = styled(Typography).attrs(() => ({
  variant: "h5",
}))`
  text-transform: none;
`;

export const Label = styled(Typography).attrs(() => ({
  variant: "overline",
  gutterBottom: true,
}))`
  // add additional styling here
`;

export const P = styled(Typography).attrs((props) => ({
  variant: "body2",
  gutterBottom: true,
  ...props,
}))`
  display: inline-block;
`;

export const Em = styled(Typography).attrs((props) => ({
  variant: "button",
  gutterBottom: true,
  ...props,
}))`
  font-weight: 900;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Card = styled(Paper)`
  padding: 4px 6px;
  min-width: 100px;
`;

export const Cell = styled.div`
`;

export const FlexCell = styled.div`
`;
