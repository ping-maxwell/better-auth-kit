"use client";

import { getLayoutedElements } from "@/app/database/database-explorer/schema/schema-flow";
import {
	type Node,
	type Edge,
	type NodeChange,
	type ColorMode,
	type EdgeChange,
	useNodesState,
	useEdgesState,
	applyEdgeChanges,
	applyNodeChanges,
	BackgroundVariant,
	ReactFlow,
	Background,
	Position,
	useReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useCallback } from "react";
import { TableNode, type TableNodeData } from "./schema-demo-table-node";
import "./schema-demo-styles.css";
import type { FieldAttribute } from "better-auth/db";
import { getDetailedAuthTables } from "@/lib/database-explorer-plugin";
import { ZoomSlider } from "./zoom-slider";

type BetterAuthDbSchema = {
	[key: string]: {
		fields: {
			[key: string]: FieldAttribute & { plugin: string };
		};
	};
};

export const SchemaDemo = ({
	plugin,
	focus,
	schema: schema_,
	includeDefaultSession,
	includeDefaultUser,
	includeDefaultAccount,
	includeDefaultVarifications,
}: {
	plugin: string;
	/**
	 * A specific table to focus on mount. Defaults to the plugin name assuming a given table matches the plugin name.
	 *
	 * If you provide `all`, it will focus all nodes.
	 */
	focus?: string;
	schema: BetterAuthDbSchema;
	includeDefaultSession?: boolean;
	includeDefaultUser?: boolean;
	includeDefaultAccount?: boolean;
	includeDefaultVarifications?: boolean;
}) => {
	const schema = getDetailedAuthTables({
		plugins: [
			{
				id: plugin,
				schema: schema_,
			},
		],
	});

	if (!includeDefaultAccount) {
		// biome-ignore lint/performance/noDelete: <explanation>
		delete schema.account;
	}

	if (!includeDefaultSession) {
		// biome-ignore lint/performance/noDelete: <explanation>
		delete schema.session;
	}

	if (!includeDefaultUser) {
		// biome-ignore lint/performance/noDelete: <explanation>
		delete schema.user;
	}

	if (!includeDefaultVarifications) {
		// biome-ignore lint/performance/noDelete: <explanation>
		delete schema.verification;
	}

	const nodes: Node[] = useMemo(() => {
		const nodes: Node[] = [];
		if (!schema) return nodes;
		let i = 0;
		const table_width = 250;
		for (const [modelName, model] of Object.entries(schema)) {
			i++;
			const res = {
				id: modelName,
				position: { x: i * table_width, y: 0 },
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
				data: {
					columns: Object.entries(model.fields).map(
						([fieldName, field]) =>
							({
								id: fieldName,
								//@ts-expect-error - In the future, BA will provide this.
								isPrimary: field.isPrimaryKey ?? false,
								isNullable: !field.required,
								isUnique: field.unique ?? false,
								name: field.fieldName ?? fieldName,
								format: (field.type as string | undefined) ?? "string",
								plugin: field.plugin ?? "",
								isIdentity: false,
							}) satisfies TableNodeData["columns"][number],
					),
					isForeign: false,
					name: modelName,
				} satisfies TableNodeData,
				type: "table",
			};
			nodes.push(res);
		}
		return nodes;
	}, [schema]);

	const edges: Edge[] = useMemo(() => {
		const edges: Edge[] = [];
		if (!schema) return edges;
		for (const [modelName, model] of Object.entries(schema)) {
			for (const [fieldName, field] of Object.entries(model.fields)) {
				if (field.references) {
					const res = {
						id: `${modelName}-${fieldName}-${field.references.model}-${field.references.field}`,
						source: field.references.model,
						sourceHandle: field.references.field,
						target: modelName,
						targetHandle: fieldName,
					};
					edges.push(res);
				}
			}
		}

		return edges;
	}, [schema]);

	return (
		<ReactFlowProvider>
			<div className="w-full aspect-video relative">
				<SchemaFlow
					edges={edges}
					nodes={nodes}
					focusedTable={focus || nodes.find((x) => x.id === plugin)?.id || null}
				/>
			</div>
		</ReactFlowProvider>
	);
};

interface SchemaFlowProps {
	nodes: Node[];
	edges: Edge[];
	focusedTable: string | null;
}

const SchemaFlow = ({
	focusedTable,
	nodes: initialNodes,
	edges: initialEdges,
}: SchemaFlowProps) => {
	const [nodes, setNodes] = useNodesState(initialNodes);
	const [edges, setEdges] = useEdgesState(initialEdges);
	const { theme } = useTheme();
	const reactFlowInstance = useReactFlow();

	const nodeTypes = useMemo(
		() => ({
			table: (props: any) => <TableNode {...props} placeholder />,
		}),
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const layouted = getLayoutedElements(initialNodes, initialEdges, {
			isDocs: true,
		});

		setNodes([...layouted.nodes]);
		setEdges([...layouted.edges]);
		setTimeout(() => {
			if (focusedTable && focusedTable !== "all") {
				reactFlowInstance.fitView({
					nodes: [layouted.nodes.find((x) => x.id === focusedTable)!],
				});
			} else {
				reactFlowInstance.fitView();
			}
		}, 100);
	}, [initialNodes, initialEdges, setNodes, setEdges]);

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
							"color-mix(in oklab, var(--color-fd-muted-foreground) 50%, transparent)",
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
				<ZoomSlider
					className="scale-75 !-right-10 opacity-30 hover:opacity-100 transition-opacity duration-150 ease-in-out"
					position="bottom-right"
				/>
			</ReactFlow>
		</div>
	);
};
