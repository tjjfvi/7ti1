import { collapse, expand, Tree, Tree7, vars } from "./trees.ts";

const nodeSize = 20;
const nodeSpacing = 10;
const rowSize = 25;
const lineWeight = 2.5;
const treeSpacing = 20;

const treeSvg = document.getElementById("tree")!;
const tree7Svg = document.getElementById("tree7")!;

const white = "#bdc3c7";
const black = "#151820";
const colors = [
  "#c0392b",
  "#d35400",
  "#f1c40f",
  "#2ecc71",
  "#1abc9c",
  "#0984e3",
  "#9c88ff",
  "#a55eea",
  "#be2edd",
];

let tree: Tree = [];
let tree7: Tree7 = expand(tree);

function render() {
  drawTrees(treeSvg, [tree], () => {
    tree7 = expand(tree);
    render();
  });
  drawTrees(tree7Svg, tree7, () => {
    tree = collapse(tree7);
    render();
  });
}

render();

function drawTrees(svg: HTMLElement, trees: Tree[], rerender: () => void) {
  svg.replaceChildren();

  let xPos = 0;
  let width = 0;
  let height = 0;

  for (const tree of trees) {
    drawTree(tree, 0, white);
    xPos += treeSpacing;
  }

  const pad = nodeSpacing + nodeSize / 2;
  svg.setAttributeNS(
    null,
    "viewBox",
    `${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`,
  );
  svg.setAttributeNS(null, "width", `${width + pad * 2}`);
  svg.setAttributeNS(null, "height", `${height + pad * 2}`);

  function drawTree(tree: Tree, yPos: number, color: string): number {
    const index = vars.indexOf(tree);
    if (index != -1) {
      color = colors[index]!;
    }

    if (tree.length === 0) {
      const center = xPos;
      xPos += nodeSize + nodeSpacing;
      const node = drawNode(center, yPos, color);
      node.setAttributeNS(null, "style", "cursor: pointer");
      node.addEventListener("click", () => {
        (tree as Tree[]).push([], []);
        rerender();
      });
      return center;
    }

    const left = drawTree(tree[0], yPos + rowSize, color);
    const right = drawTree(tree[1], yPos + rowSize, color);
    const center = (left + right) / 2;
    drawLine(center, yPos, left, yPos + rowSize, color);
    drawLine(center, yPos, right, yPos + rowSize, color);
    const node = drawNode(center, yPos, color);
    if (tree[0].length === 0 && tree[1].length === 0) {
      node.setAttributeNS(null, "style", "cursor: pointer");
      node.addEventListener("click", () => {
        (tree as Tree).length = 0;
        rerender();
      });
    } else {
      node.addEventListener("dblclick", () => {
        (tree as Tree).length = 0;
        rerender();
      });
    }
    return center;
  }

  function drawNode(x: number, y: number, color: string): SVGCircleElement {
    width = Math.max(width, x);
    height = Math.max(height, y);
    const circle = svgEl("circle") as SVGCircleElement;
    circle.setAttributeNS(null, "cx", x + "");
    circle.setAttributeNS(null, "cy", y + "");
    circle.setAttributeNS(null, "r", nodeSize / 2 + "");
    circle.setAttributeNS(null, "stroke", color);
    circle.setAttributeNS(null, "stroke-width", lineWeight + "");
    circle.setAttributeNS(null, "fill", black);
    svg.appendChild(circle);
    return circle;
  }

  function drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ) {
    const line = svgEl("line") as SVGLineElement;
    line.setAttributeNS(null, "x1", x1 + "");
    line.setAttributeNS(null, "y1", y1 + "");
    line.setAttributeNS(null, "x2", x2 + "");
    line.setAttributeNS(null, "y2", y2 + "");
    line.setAttributeNS(null, "stroke-width", lineWeight + "");
    line.setAttributeNS(null, "stroke", color);
    svg.prepend(line);
  }
}

function svgEl(name: string): SVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
