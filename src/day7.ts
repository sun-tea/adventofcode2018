// Day 7: The Sum of Its Parts
import { parseFile } from 'helpers';

const regex = new RegExp('Step (.).*([A-Z])');

interface Graph {
  [key: string]: string[];
}

const generateGraph = (content): Graph =>
  content.reduce((graph, edge) => {
    const [, start, end] = regex.exec(edge);
    graph[start] = Array.isArray(graph[start]) ? [...graph[start], end] : [end];

    return graph;
  }, {});

const part1 = (content) => {
  const graph: Graph = generateGraph(content);

  const nodesWithParent = Object.values(graph).reduce(
    (acc, edges) => [...acc, ...edges.filter((node) => !acc.includes(node))],
    []
  );

  const entryNodes = Object.keys(graph).filter(
    (node) => !nodesWithParent.includes(node) && graph[node].length > 0
  );

  const firstNode = entryNodes.reduce(
    (min, n) => (min ? (min > n ? n : min) : n),
    ''
  );

  const result = getPath(graph, firstNode, [], entryNodes);
  return result.join('');
};

const getPath = (graph, node, path, nodes) => {
  const allNodes = graph[node] ? [...graph[node], ...nodes] : nodes;
  if (allNodes.length) {
    const possibleNextNodes = allNodes.reduce((nodes, node) => {
      for (let v in graph) {
        const parent = graph[v].find((e) => e === node);
        if (parent && !path.includes(v)) {
          return nodes.filter((n) => n !== node);
        }
      }
      return nodes;
    }, allNodes);
    const nextNode = possibleNextNodes.reduce(
      (min, n) => (min ? (min > n ? n : min) : n),
      ''
    );
    const remainingNodes = possibleNextNodes.filter((n) => n !== nextNode);

    return getPath(graph, nextNode, [...path, nextNode], remainingNodes);
  } else {
    return path;
  }
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day7.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
