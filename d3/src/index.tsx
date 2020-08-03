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
  if (!children && isInCircle(x, y, r, currentXY)) {
    highlightCircle = {
      x,
      y,
      r,
    };
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
    ctx.font = "1.5rem Arial";
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
  const pack = d3.pack().size([1600, 1600]).padding(3);
  const root = pack(regions);
  draw(context, root, []);
  canvas.addEventListener("mousemove", (e) => {
    currentXY = [e.clientX, e.clientY];
    const { x, y, r } = highlightCircle;
    Object.keys(circles).forEach((xAndY) => {
      const [x, y] = xAndY.split(",");
    });
    if (x > 0 && !isInCircle(x, y, r, currentXY)) {
      context.clearRect(0, 0, 1600, 1600);
      draw(context, root, currentXY);
    }
  });
})();
