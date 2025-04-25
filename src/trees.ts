export type Tree = [] | [Tree, Tree];
export type Tree7 = [Tree, Tree, Tree, Tree, Tree, Tree, Tree];

type Pat = number | [] | [Pat, Pat];
type Pat7 = [Pat, Pat, Pat, Pat, Pat, Pat, Pat];

const mapping: [Pat, Pat7][] = [
  [[], [[], [], [], [], [], [], []]],
  [[0, []], [[0, []], [], [], [], [], [], []]],
  [[0, [1, []]], [[0, [1, []]], [], [], [], [], [], []]],
  [[0, [1, [2, []]]], [0, [1, 2], [], [], [], [], []]],
  [[0, [1, [2, [3, []]]]], [[0, [1, [2, 3]]], [], [], [], [], [], []]],
  [[0, [1, [2, [3, [[], []]]]]], [0, 1, [2, 3], [], [], [], []]],
  [[0, [1, [2, [3, [[4, 5], []]]]]], [0, 1, 2, 3, [4, 5], [], []]],
  [[0, [1, [2, [3, [4, [[], []]]]]]], [0, 1, 2, [3, 4], [], [], []]],
  [[0, [1, [2, [3, [4, [[5, 6], []]]]]]], [0, 1, 2, 3, 4, [5, 6], []]],
  [[0, [1, [2, [3, [4, [5, [6, 7]]]]]]], [0, 1, 2, 3, 4, 5, [6, 7]]],
];

export let vars: Tree[] = [];

export function expand(tree: Tree): Tree7 {
  for (const [pat, pat7] of mapping) {
    vars = [];
    if (match(tree, pat)) {
      return reconstruct7(pat7);
    }
  }
  throw new Error("unreachable");
}

export function collapse(tree7: Tree7): Tree {
  for (const [pat, pat7] of mapping) {
    vars = [];
    if (match7(tree7, pat7)) {
      return reconstruct(pat);
    }
  }
  throw new Error("unreachable");
}

function match(tree: Tree, pat: Pat): boolean {
  if (typeof pat === "number") {
    vars[pat] = tree;
    return true;
  } else if (pat.length === 0) {
    return tree.length === 0;
  } else {
    return tree.length === 2 && match(tree[0], pat[0]) &&
      match(tree[1], pat[1]);
  }
}

function reconstruct(pat: Pat): Tree {
  if (typeof pat === "number") {
    return vars[pat]!;
  } else if (pat.length === 0) {
    return [];
  } else {
    return [reconstruct(pat[0]), reconstruct(pat[1])];
  }
}

function match7(tree7: Tree7, pat7: Pat7): boolean {
  return tree7.every((tree, i) => match(tree, pat7[i]!));
}

function reconstruct7(pat7: Pat7): Tree7 {
  return pat7.map(reconstruct) as Tree7;
}
