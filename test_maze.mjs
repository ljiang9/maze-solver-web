// test_maze.mjs — 提取迷宫纯函数并 Node 断言连通性与最短路。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "index.html"), "utf-8");
const m = html.match(/\/\/ ===== 纯函数：迷宫生成[\s\S]*?\/\/ ===== MAZE_LOGIC_END =====/);
assert.ok(m, "未找到迷宫纯函数标记");
const f = new Function(`${m[0]}\nreturn { genMaze, bfsShortest };`)();

for (let trial = 0; trial < 5; trial++) {
  const maze = f.genMaze(8, 8);
  const H = maze.length, W = maze[0].length;
  const start = [1,1], end = [H-2, W-2];
  const path = f.bfsShortest(maze, start, end);
  assert.ok(path, "DFS 迷宫应始终连通，BFS 必找到通路");
  assert.deepStrictEqual(path[0], start);
  assert.deepStrictEqual(path[path.length-1], end);
  // 路径每步相邻且在可走格
  for (let i = 0; i < path.length; i++) {
    const [r,c] = path[i];
    assert.ok(!maze[r][c], "路径上不能穿墙");
    if (i>0) {
      const [pr,pc] = path[i-1];
      assert.strictEqual(Math.abs(r-pr)+Math.abs(c-pc), 1, "路径须相邻");
    }
  }
}
// 已知有墙迷宫：起点被四周墙围住，BFS 应找不到通路
const blocked = [[1,1,1,1],[1,0,1,1],[1,1,0,0],[1,1,1,1]];
assert.strictEqual(f.bfsShortest(blocked, [1,1], [2,2]), null);

console.log("OK: maze-solver-web 全部用例通过");