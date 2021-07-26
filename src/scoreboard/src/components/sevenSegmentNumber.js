/* eslint-disable no-bitwise */
import React from "react";

import "./sevenSegmentNumber.css";

const numbers = [0x7e, 0x30, 0x6d, 0x79, 0x33, 0x5b, 0x5f, 0x70, 0x7f, 0x7b];

export default function SevenSegmentNumber({ value }) {
  const segments = ["G", "F", "E", "D", "C", "B", "A"];
  const bit = numbers[value];
  return (
    <div className="Display">
      {segments.map((seg, i) => (
        <Segment key={seg} on={((bit >> i) & 1) === 1} position={seg} />
      ))}
    </div>
  );
}

const Segment = ({ position, on }) => (
  <div
    className={`Segment Segment-${position} ${
      on ? "Segment--on" : ""
    }`}
  />
);
