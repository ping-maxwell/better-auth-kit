import { cn } from "@/lib/utils";
import { Fingerprint, Hash, Key, Table2 } from "lucide-react";
import { Handle, useReactFlow, type NodeProps } from "@xyflow/react";
import { useStore } from "@tanstack/react-store";
import { useDatabaseStore } from "../../provider";
import { useEffect, useRef } from "react";

// ReactFlow is scaling everything by the factor of 2
const TABLE_NODE_WIDTH = 420; // before: 320
const TABLE_NODE_ROW_HEIGHT = 40; // before: 40

export type TableNodeData = {
	id?: number;
	name: string;
	isForeign: boolean;
	columns: {
		id: string;
		isPrimary: boolean;
		isNullable: boolean;
		isUnique: boolean;
		isIdentity: boolean;
		name: string;
		format: string;
		plugin: string;
	}[];
};

const TableNode = ({
	data: data_,
	targetPosition,
	sourcePosition,
	placeholder,
}: NodeProps & { placeholder?: boolean }) => {
	const data = data_ as TableNodeData;
	// Important styles is a nasty hack to use Handles (required for edges calculations), but do not show them in the UI.
	// ref: https://github.com/wbkd/react-flow/discussions/2698
	const hiddenNodeConnector =
		"!h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 opacity-100";

	const itemHeight = "h-[22px]";
	const dbStore = useDatabaseStore();
	const reactFlowInstance = useReactFlow();
	const selectedModel = useStore(dbStore, (st) => st.selectedModel);
	const mountedAt = useRef(Date.now());

	useEffect(() => {
		if (
			selectedModel === data.name &&
			// Prevent it from fitting the view when the node is first mounted
			Date.now() - mountedAt.current > 1000
		) {
			reactFlowInstance.fitView({
				nodes: [{ id: data.name, data: data_ }],
			});
		}
	}, [selectedModel, data.name, data_, reactFlowInstance.fitView]);

	return (
		<>
			{data.isForeign ? (
				<header
					className="text-[0.55rem] px-2 py-1 border-[0.5px] bg-card text-default flex gap-1 items-center"
					id={`${data.name}-foreign-key`}
				>
					{data.name}
					{targetPosition && (
						<Handle
							type="target"
							id={data.name}
							position={targetPosition}
							className={cn(hiddenNodeConnector)}
						/>
					)}
				</header>
			) : (
				<div
					className={cn(
						"border-[0.5px] overflow-hidden shadow-sm",
						selectedModel === data.name && "border-primary/40",
					)}
					style={{ width: TABLE_NODE_WIDTH / 2 }}
					id={`${data.name}-table-node`}
				>
					<header
						className={cn(
							"text-[0.55rem] pl-2 pr-1 bg-secondary/40 text-default flex items-center justify-between",
							itemHeight,
						)}
					>
						<div className="flex gap-x-1 items-center">
							<Table2 strokeWidth={1} size={12} className="text-light" />
							{data.name}
						</div>
					</header>

					{data.columns.map((column) => (
						<div
							className={cn(
								"text-[8px] leading-5 relative flex flex-row justify-items-start",
								"bg-card",
								"border-t",
								"border-t-[0.5px]",
								"hover:bg-scale-500 transition cursor-default",
								itemHeight,
							)}
							key={column.id}
						>
							<div
								className={cn(
									"gap-[0.24rem] flex ml-2 align-middle items-center justify-start",
								)}
							>
								{column.isPrimary && (
									<Key
										size={8}
										strokeWidth={1}
										className={cn(
											// 'sb-grid-column-header__inner__primary-key'
											"flex-shrink-0",
											"text-light mr-2",
										)}
									/>
								)}

								{column.isUnique && (
									<Fingerprint
										size={8}
										strokeWidth={1}
										className="flex-shrink-0 text-light mr-2"
									/>
								)}
								{column.isIdentity && (
									<Hash
										size={8}
										strokeWidth={1}
										className="flex-shrink-0 text-light"
									/>
								)}
								{!column.isIdentity &&
									!column.isUnique &&
									!column.isPrimary && <div className=" size-4" />}
							</div>
							<div className="flex w-full justify-between">
								<div className="whitespace-nowrap flex justify-center relative">
									{column.isNullable ? (
										""
									) : (
										<span className="text-muted-foreground absolute left-[-6px] top-[1px]">
											*
										</span>
									)}{" "}
									<div className="max-w-[100px] w-fit text-ellipsis overflow-hidden">
										{column.name}
									</div>
									<span className="font-mono text-muted-foreground text-[0.35rem] pl-1 mt-[1px]">
										{column.format}
									</span>
								</div>
								<span className="px-2 inline-flex justify-end text-muted-foreground text-[0.4rem] mt-[1px]">
									{column.plugin}
								</span>
							</div>
							{targetPosition && (
								<Handle
									type="target"
									id={column.id}
									position={targetPosition}
									className={cn(hiddenNodeConnector, "!left-0")}
								/>
							)}
							{sourcePosition && (
								<Handle
									type="source"
									id={column.id}
									position={sourcePosition}
									className={cn(hiddenNodeConnector, "!right-0")}
								/>
							)}
						</div>
					))}
				</div>
			)}
		</>
	);
};

export { TABLE_NODE_ROW_HEIGHT, TABLE_NODE_WIDTH, TableNode };
