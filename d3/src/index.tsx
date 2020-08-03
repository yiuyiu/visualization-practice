const d3 = require("d3-hierarchy");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
const dataSource = "https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json";
const TAU = 2 * Math.PI;
let highlightCircle = { x: 0, y: 0, r: 0 };
let currentXY = [];
let circles = {};
function draw(
  ctx: CanvasRenderingContext2D,
  node,
  currentXY,
  { fillStyle = "rgba(0, 0, 0, 0.2)", textColor = "white" } = {}
) {
  const children = node.children;
  const { x, y, r } = node;
  if (!children && x == highlightCircle.x && y == highlightCircle.y) {
    ctx.fillStyle = "pink";
  } else {
    ctx.fillStyle = fillStyle;
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  if (children) {
    for (let i = 0; i < children.length; i++) {
      draw(ctx, children[i], currentXY);
    }
  } else {
    const name = node.data.name;
    ctx.fillStyle = textColor;
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name, x, y);
    if (!circles[`${x},${y}`]) {
      circles[`${x},${y}`] = r;
    }
  }
}
const isInCircle = (x, y, r, xy) => {
  return Math.abs(xy[0] - x) < r && Math.abs(xy[1] - y) < r;
};
(async function () {
  const data = await (await fetch(dataSource)).json();
  const regions = d3
    .hierarchy(data)
    .sum((d) => 1)
    .sort((a, b) => b.value - a.value);
  const pack = d3.pack().size([800, 800]).padding(3);
  const root = pack(regions);
  draw(context, root, []);
  console.log(circles);
  canvas.addEventListener("mousemove", (e) => {
    currentXY = [e.clientX, e.clientY];
    let newHighlightCircle = { x: 0, y: 0, r: 0 };
    const xAndY = Object.keys(circles).find((xAndY) => {
      const [centerX, centerY] = xAndY.split(",");
      return isInCircle(+centerX, +centerY, circles[xAndY], currentXY);
    });
    if (xAndY) {
      const [centerX, centerY] = xAndY.split(",");
      newHighlightCircle = {
        x: +centerX,
        y: +centerY,
        r: circles[xAndY],
      };
    }
    if (
      newHighlightCircle.x > 0 &&
      `${newHighlightCircle.x},${newHighlightCircle.y}` !=
        `${highlightCircle.x},${highlightCircle.y}`
    ) {
      console.log(newHighlightCircle);
      highlightCircle = newHighlightCircle;
      context.clearRect(0, 0, 800, 800);
      draw(context, root, currentXY);
    }
  });
})();
