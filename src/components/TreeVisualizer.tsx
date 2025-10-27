import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ObjectNode } from "./nodes/ObjectNode";
import { ArrayNode } from "./nodes/ArrayNode";
import { PrimitiveNode } from "./nodes/PrimitiveNode";
import { SearchBar } from "./SearchBar";

interface TreeVisualizerProps {
  jsonData: any;
}

const nodeTypes = {
  objectNode: ObjectNode,
  arrayNode: ArrayNode,
  primitiveNode: PrimitiveNode,
};

interface NodeData extends Record<string, unknown> {
  label: string;
  value?: any;
  path: string;
  isHighlighted?: boolean;
}

export const TreeVisualizer = ({ jsonData }: TreeVisualizerProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const generateTree = useCallback((data: any) => {
    const newNodes: Node<NodeData>[] = [];
    const newEdges: Edge[] = [];
    let nodeId = 0;

    const createNode = (
      value: any,
      key: string | number,
      parentId: string | null,
      path: string,
      level: number
    ) => {
      const currentId = `node-${nodeId++}`;
      const horizontalSpacing = 280;
      const verticalSpacing = 120;

      let nodeType: string;
      let label: string;

      if (value === null) {
        nodeType = "primitiveNode";
        label = `${key}: null`;
      } else if (Array.isArray(value)) {
        nodeType = "arrayNode";
        label = `${key} [${value.length}]`;
      } else if (typeof value === "object") {
        nodeType = "objectNode";
        label = `${key} {}`;
      } else {
        nodeType = "primitiveNode";
        label = `${key}: ${String(value)}`;
      }

      const node: Node<NodeData> = {
        id: currentId,
        type: nodeType,
        position: { x: 0, y: level * verticalSpacing },
        data: {
          label,
          value,
          path,
          isHighlighted: false,
        },
      };

      newNodes.push(node);

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: "smoothstep",
          animated: false,
          style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        });
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          createNode(item, index, currentId, `${path}[${index}]`, level + 1);
        });
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([childKey, childValue]) => {
          createNode(
            childValue,
            childKey,
            currentId,
            `${path}.${childKey}`,
            level + 1
          );
        });
      }

      return currentId;
    };

    // Start from root
    if (Array.isArray(data)) {
      createNode(data, "root", null, "$", 0);
    } else if (typeof data === "object" && data !== null) {
      createNode(data, "root", null, "$", 0);
    } else {
      createNode(data, "root", null, "$", 0);
    }

    // Apply hierarchical layout
    const layoutNodes = applyHierarchicalLayout(newNodes, newEdges);
    setNodes(layoutNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  const applyHierarchicalLayout = (nodes: Node<NodeData>[], edges: Edge[]) => {
    const levels: { [key: number]: Node<NodeData>[] } = {};
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Group nodes by level
    nodes.forEach((node) => {
      const level = node.position.y / 120;
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
    });

    // Calculate positions
    Object.entries(levels).forEach(([level, levelNodes]) => {
      const y = parseInt(level) * 120;
      const totalWidth = levelNodes.length * 280;
      const startX = -totalWidth / 2;

      levelNodes.forEach((node, index) => {
        node.position = {
          x: startX + index * 280 + 140,
          y,
        };
      });
    });

    return nodes;
  };

  useEffect(() => {
    if (jsonData) {
      generateTree(jsonData);
    }
  }, [jsonData, generateTree]);

  const handleSearch = useCallback(
    (searchPath: string) => {
      if (!searchPath.trim()) {
        setSearchResult(null);
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: { ...node.data, isHighlighted: false },
          }))
        );
        return;
      }

      // Normalize the search path
      let normalizedPath = searchPath.trim();
      if (normalizedPath.startsWith("$.")) {
        normalizedPath = normalizedPath.substring(1);
      } else if (!normalizedPath.startsWith("$")) {
        normalizedPath = "." + normalizedPath;
      }

      const foundNode = nodes.find((node) => {
        const nodePath = node.data.path;
        return (
          nodePath === normalizedPath ||
          nodePath === `$${normalizedPath}` ||
          nodePath.endsWith(normalizedPath)
        );
      });

      if (foundNode) {
        setSearchResult("Match found!");
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isHighlighted: node.id === foundNode.id,
            },
          }))
        );

        // Pan to the found node
        const flowElement = document.querySelector(".react-flow");
        if (flowElement) {
          // Center on the found node with animation
          setTimeout(() => {
            const nodeElement = document.querySelector(
              `[data-id="${foundNode.id}"]`
            );
            if (nodeElement) {
              nodeElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }, 100);
        }
      } else {
        setSearchResult("No match found");
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: { ...node.data, isHighlighted: false },
          }))
        );
      }
    },
    [nodes, setNodes]
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <SearchBar onSearch={handleSearch} searchResult={searchResult} />
      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: false,
          }}
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.data?.isHighlighted) return "hsl(var(--node-highlight))";
              if (node.type === "objectNode") return "hsl(var(--node-object))";
              if (node.type === "arrayNode") return "hsl(var(--node-array))";
              return "hsl(var(--node-primitive))";
            }}
            className="bg-card border border-border"
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};
