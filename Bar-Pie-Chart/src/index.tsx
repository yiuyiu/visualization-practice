import React from "react";
import ReactDOM from "react-dom";
import styled, { css } from "styled-components";
import { color5Arr } from "../../Layout/Color";
const parts = [
  {
    color: color5Arr[0],
    deg: 30,
  },
  {
    color: color5Arr[1],
    deg: 35,
  },
  {
    color: color5Arr[2],
    deg: 45,
  },
  {
    color: color5Arr[3],
    deg: 90,
  },
  {
    color: color5Arr[4],
    deg: 160,
  },
];
const CssPie = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-image: conic-gradient(
    ${color5Arr[0]} 30deg,
    ${color5Arr[1]} 30deg 65deg,
    ${color5Arr[2]} 65deg 110deg,
    ${color5Arr[3]} 110deg 200deg,
    ${color5Arr[4]} 200deg
  );
`;
ReactDOM.render(<CssPie />, document.getElementById("css"));

// https://seesparkbox.com/foundry/how_to_code_an_SVG_pie_chart
const SVGWrapper = styled.div`
  height: 250px;
  width: 250px;
  position: relative;
  transform: rotate(-90deg);
`;
const SVGEl = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 250px;
  ${(props) => css`
    transform: rotate(${props.rotate}deg);
  `}
`;
const SVGPie = (props) => <SVGEl viewBox="0 0 20 20" {...props} />;
const radius = 5;
const circum = 2 * radius * Math.PI;
const calRotate = (index) =>
  index > 0
    ? parts.slice(0, index).reduce((acc, item) => acc + item.deg, 0)
    : 0;
ReactDOM.render(
  <SVGWrapper>
    {parts.map((item, index) => (
      <SVGPie key={index} rotate={calRotate(index)}>
        <circle
          r={radius}
          cx="10"
          cy="10"
          fill="transparent"
          strokeWidth="10"
          stroke={item.color}
          strokeDasharray={`calc(${item.deg / 360} * ${circum}) ${circum}`}
        />
      </SVGPie>
    ))}
  </SVGWrapper>,
  document.getElementById("svg")
);
//canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.style.transform = "rotate(-90deg)";
const ctx = canvas.getContext("2d");
parts.forEach((item, index) => {
  ctx.beginPath();
  const start = (calRotate(index) / 360) * 2 * Math.PI;
  const end = start + (item.deg / 360) * 2 * Math.PI;
  ctx.arc(125, 125, 125, start, end);
  ctx.lineTo(125, 125);
  ctx.closePath();
  ctx.fillStyle = item.color;
  ctx.fill();
});
// svg 的circle 以及 canvas的arc的起始线都是一样的，都是圆形的水平向右方向
