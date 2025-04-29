import {
	type Edge,
	type Node,
	Position,
	ReactFlowProvider,
} from "@xyflow/react";
import { SchemaFlow } from "./schema-flow";
import { SchemaTopbar } from "./topbar";
import type { TableNodeData } from "./components/table-node";
import { useQuery } from "@tanstack/react-query";
import { useAuthClient } from "../provider";
import { useMemo } from "react";

// Examples:
// const initialNodes = [
// 	{
// 		id: "1",
// 		position: { x: 0, y: 0 },
// 		sourcePosition: Position.Right,
// 		targetPosition: Position.Left,
// 		data: {
// 			columns: [
// 				{
// 					id: "1",
// 					isPrimary: true,
// 					isNullable: false,
// 					isUnique: false,
// 					isIdentity: false,
// 					name: "id",
// 					format: "text",
// 					plugin: "",
// 				},
// 				{
// 					id: "2",
// 					format: "string",
// 					name: "email",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: true,
// 					plugin: "",
// 				},
// 				{
// 					id: "3",
// 					format: "string",
// 					name: "name",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: false,
// 					plugin: "",
// 				},
// 				{
// 					id: "4",
// 					format: "string",
// 					name: "username",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: true,
// 					plugin: "username",
// 				},
// 				{
// 					id: "5",
// 					format: "string",
// 					name: "display_name",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: false,
// 					plugin: "username",
// 				},
// 			],
// 			isForeign: false,
// 			name: "user",
// 		},
// 		type: "table",
// 	},
// 	{
// 		id: "2",
// 		position: { x: 250, y: 0 },
// 		sourcePosition: Position.Right,
// 		targetPosition: Position.Left,
// 		data: {
// 			columns: [
// 				{
// 					id: "1",
// 					isPrimary: true,
// 					isNullable: false,
// 					isUnique: false,
// 					isIdentity: false,
// 					name: "id",
// 					format: "text",
// 					plugin: "organization",
// 				},
// 				{
// 					id: "2",
// 					format: "string",
// 					name: "name",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: false,
// 					plugin: "organization",
// 				},
// 				{
// 					id: "3",
// 					format: "string",
// 					name: "slug",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: true,
// 					plugin: "organization",
// 				},
// 				{
// 					id: "4",
// 					format: "string",
// 					name: "user_id",
// 					isIdentity: false,
// 					isNullable: false,
// 					isPrimary: false,
// 					isUnique: false,
// 					plugin: "organization",
// 				},
// 			],
// 			isForeign: false,
// 			name: "organization",
// 		},
// 		type: "table",
// 	},
// ] satisfies Node<TableNodeData>[];

// const initialEdges: Edge[] = [
// 	{
// 		id: "e1-2",
// 		source: "1",
// 		sourceHandle: "1",
// 		target: "2",
// 		targetHandle: "4",
// 	},
// ];

export const SchemaExplorer = () => {
	const authClient = useAuthClient();
	const detailedSchema = useQuery({
		queryKey: ["detailedSchema"],
		queryFn: async () => {
			const { data, error } =
				await authClient.current.adapter.getDetailedSchema({});
			if (error) throw error;
			return data;
		},
	});

	const nodes: Node[] = useMemo(() => {
		const nodes: Node[] = [];
		if (!detailedSchema.data) return nodes;
		let i = 0;
		const table_width = 250;
		for (const [modelName, model] of Object.entries(detailedSchema.data)) {
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
	}, [detailedSchema.data]);

	const edges: Edge[] = useMemo(() => {
		const edges: Edge[] = [];
		if (!detailedSchema.data) return edges;
		for (const [modelName, model] of Object.entries(detailedSchema.data)) {
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
	}, [detailedSchema.data]);

	return (
		<ReactFlowProvider>
			<div className="w-full h-full bg-background flex flex-col overflow-hidden">
				<SchemaTopbar />
				<div className="w-full h-full overflow-hidden relative">
					<SchemaFlow edges={edges} nodes={nodes} />
				</div>
			</div>
		</ReactFlowProvider>
	);
};
