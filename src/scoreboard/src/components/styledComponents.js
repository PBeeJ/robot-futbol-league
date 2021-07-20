import { Typography, Paper } from "@material-ui/core";
import styled from "styled-components";

export const H1 = styled(Typography).attrs((props) => ({
  variant: "h1",
  ...props,
}))`
  // add additional styling here
`;

export const H2 = styled(Typography).attrs((props) => ({
  variant: "h2",
  ...props,
}))`
  // add additional styling here
`;

export const H3 = styled(Typography).attrs((props) => ({
  variant: "h3",
  ...props,
}))`
  text-transform: none;
`;

export const H4 = styled(Typography).attrs((props) => ({
  variant: "h4",
  ...props,
}))`
  text-transform: none;
`;

export const H5 = styled(Typography).attrs((props) => ({
  variant: "h5",
  ...props,
}))`
  // add additional styling here
`;

export const Label = styled(Typography).attrs((props) => ({
  variant: "overline",
  gutterBottom: true,
  ...props,
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
  flex-direction: row;
`;

export const Card = styled(Paper)`
  padding: 4px 6px;
  min-width: 100px;
`;

export const Cell = styled.div`
  margin-right: 8px;
`;

export const FlexCell = styled.div`
  margin-right: 8px;
  flex-grow: 1;
`;
