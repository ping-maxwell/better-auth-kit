import { useCallback, useEffect, useMemo } from "react";
import {
	type ColorMode,
	type Edge,
	type Node,
	type NodeChange,
	type EdgeChange,
	applyNodeChanges,
	Background,
	BackgroundVariant,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
	applyEdgeChanges,
	Position,
} from "@xyflow/react";
import Dagre from "@dagrejs/dagre";

import "./theme.css";
import "@xyflow/react/dist/style.css";

import { useTheme } from "next-themes";
import { type TableNodeData, TableNode } from "./components/table-node";
import { ZoomSlider } from "@/components/zoom-slider";

export const TABLE_NODE_WIDTH = 640;
export const TABLE_NODE_ROW_HEIGHT = 200;

interface SchemaFlowProps {
	nodes: Node[];
	edges: Edge[];
}

const NODE_SEP = 25;
const RANK_SEP = 50;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
	const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
	g.setGraph({
		rankdir: "LR",
		align: "UR",
		nodesep: NODE_SEP,
		ranksep: RANK_SEP,
	});

	edges.forEach((edge) => g.setEdge(edge.source, edge.target));
	nodes.forEach((node) => {
		g.setNode(node.id, {
			...node,
			width: TABLE_NODE_WIDTH,
			height: TABLE_NODE_ROW_HEIGHT,
		});
	});

	Dagre.layout(g);

	return {
		nodes: nodes.map((node) => {
			const position = g.node(node.id);
			node.targetPosition = Position.Left;
			node.sourcePosition = Position.Right;

			node.position = {
				x: position.x - position.width / 2,
				y: position.y - position.height / 2,
			};

			return node;
		}),
		edges,
	};
};

export const SchemaFlow = ({
	nodes: initialNodes,
	edges: initialEdges,
}: SchemaFlowProps) => {
	const [nodes, setNodes] = useNodesState(initialNodes);
	const [edges, setEdges] = useEdgesState(initialEdges);
	const { theme } = useTheme();

	const nodeTypes = useMemo(
		() => ({
			table: (props: any) => <TableNode {...props} placeholder />,
		}),
		[],
	);

	useEffect(() => {
		const layouted = getLayoutedElements(initialNodes, initialEdges);

		setNodes([...layouted.nodes]);
		setEdges([...layouted.edges]);
	}, [initialNodes, initialEdges, setNodes, setEdges]);

	//   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	//   useEffect(() => {
	//     reactFlowInstance.fitView()
	//   }, [reactFlowInstance, nodes, edges])

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => {
			setNodes((nds) => applyNodeChanges(changes, nds));
		},
		[setNodes],
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => {
			setEdges((eds) => applyEdgeChanges(changes, eds));
		},
		[setEdges],
	);

	return (
		<div className="absolute inset-0">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				colorMode={(theme as ColorMode | undefined) ?? "dark"}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				defaultEdgeOptions={{
					type: "smoothstep",
					animated: true,
					deletable: false,
					style: {
						stroke:
							"color-mix(in oklab, var(--muted-foreground) 50%, transparent)",
						strokeWidth: 0.5,
					},
				}}
				fitView
				minZoom={0.8}
				proOptions={{ hideAttribution: true }}
				panOnScroll
				panOnScrollSpeed={1}
			>
				<Background
					gap={16}
					className=" "
					variant={BackgroundVariant.Dots}
					color={"inherit"}
				/>
				<ZoomSlider position="bottom-right" />
			</ReactFlow>
		</div>
	);
};
