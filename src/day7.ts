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

const getEntryNodes = (graph: Graph): string[] =>
  Object.keys(graph)
    .filter(
      (node) =>
        !Object.values(graph)
          .reduce(
            (acc, edges) =>
              [...acc, ...edges.filter((node) => !acc.includes(node))],
            []
          )
          .includes(node) && graph[node].length > 0
    )
    .sort((a, b) => a.localeCompare(b));

const part1 = (content) => {
  const graph = generateGraph(content);
  const entryNodes = getEntryNodes(graph);

  const result = getPath(graph, entryNodes[0], [], entryNodes);
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

const part2 = (content) => {
  const graph = generateGraph(content);
  const entryNodes = getEntryNodes(graph);
  const workers = [[], [], [], [], []];

  const result = getConstructionDuration(graph, workers, entryNodes, []);
  return result;
};

const getConstructionDuration = (graph, workers, possibleNodes, path) => {
  if (workers.filter((w) => w[w.length - 1] === '.').length < workers.length) {
    workers = workers.map((worker) => {
      const lastTask = worker[worker.length - 1];
      if (/[A-Z]/.exec(lastTask)) {
        const duration = lastTask.charCodeAt() - 4;
        const nbSeconds = worker.filter((w) => w === lastTask).length;
        if (nbSeconds === duration) {
          // task is finished
          path.push(lastTask);
          possibleNodes = possibleNextNodes(
            graph,
            [...possibleNodes, ...(graph[lastTask] ? graph[lastTask] : [])],
            path
          );
          worker.push(possibleNodes.shift() || '.');
        } else if (nbSeconds < duration) {
          worker.push(lastTask);
        }
      } else {
        // empty or idle
        worker.push(possibleNodes.shift() || '.');
      }
      return worker;
    });
    return getConstructionDuration(graph, workers, possibleNodes, path);
  } else {
    return workers[0].length - 1;
  }
};

const possibleNextNodes = (graph, nodes, path) =>
  nodes
    .reduce((nodes, node) => {
      for (let v in graph) {
        const parent = graph[v].find((e) => e === node);
        if (parent && !path.includes(v)) {
          return nodes.filter((n) => n !== node);
        }
      }
      return nodes;
    }, nodes)
    .sort((a, b) => a.localeCompare(b));

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day7.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
