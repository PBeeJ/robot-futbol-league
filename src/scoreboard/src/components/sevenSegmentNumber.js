import React from "react";

import "./sevenSegmentNumber.css";

const numbers = [0x7e, 0x30, 0x6d, 0x79, 0x33, 0x5b, 0x5f, 0x70, 0x7f, 0x7b];

export const SevenSegmentNumber = (props) => {
  const segments = ["G", "F", "E", "D", "C", "B", "A"];
  const bit = numbers[props.value];
  return (
    <div className="Display">
      {segments.map((seg, i) => {
        return (
          <Segment on={((bit >> i) & 1) == 1 ? true : false} position={seg} />
        );
      })}
    </div>
  );
};

const Segment = (props) => {
  return (
    <div
      className={`Segment Segment-${props.position} ${
        props.on ? "Segment--on" : ""
      }`}
    ></div>
  );
};
