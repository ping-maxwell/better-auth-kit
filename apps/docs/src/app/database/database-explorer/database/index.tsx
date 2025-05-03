"use client";
import * as React from "react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnSizingState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Hash, Key, Link, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DBTopbar } from "./topbar";
import { DBFooter } from "./footer";
import { DBHeader } from "./header";
import { useAuthClient, useDatabaseStore } from "../provider";
import { useStore } from "@tanstack/react-store";
import { useQuery } from "@tanstack/react-query";
import type { AuthClient } from "../types";
import { useMemo } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const selectColumn: ColumnDef<any> = {
	id: "select",
	header: ({ table }) => (
		<Checkbox
			checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && "indeterminate")
			}
			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			aria-label="Select all"
			className="mx-2"
		/>
	),
	cell: ({ row }) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value) => row.toggleSelected(!!value)}
			aria-label="Select row"
			className="mx-2"
		/>
	),
	enableSorting: false,
	enableHiding: false,
	enableResizing: false,
	size: 30,
};

const actionColumn: ColumnDef<any> = {
	id: "actions",
	enableHiding: false,
	cell: ({ row }) => {
		const payment = row.original;

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(payment.id)}
					>
						Copy payment ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>View customer</DropdownMenuItem>
					<DropdownMenuItem>View payment details</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
};

const getRows = async (authClient: { current: AuthClient }, model: string) => {
	const { data: dataArr, error } = await authClient.current.adapter.findMany({
		model,
	});
	const safeData: any[] = [];
	for (const item of dataArr ?? []) {
		const newData: any = {};
		for (const key in item as object) {
			newData[key] = JSON.stringify((item as any)[key]);
		}
		safeData.push(newData);
	}
	if (error) {
		console.log("error", error);
		return [];
		//TODO: Consider using a toast to notify the user
	}
	return safeData;
};

const FieldIcon = ({
	label,
	children,
}: { label: string | null; children: React.ReactNode }) => {
	if (children === null) return null;
	return (
		<TooltipProvider delayDuration={20}>
			<Tooltip>
				<TooltipTrigger>
					<div className="flex items-center justify-center w-5 h-5 hover:bg-sidebar-accent rounded-sm mr-1">
						{children}
					</div>
				</TooltipTrigger>
				<TooltipContent
					side="bottom"
					className="bg-card text-card-foreground border border-border"
				>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const ValueCell = ({ value }: { value: any }) => {
	return (
		<span className="font-mono text-xs truncate">
			{typeof value === "undefined" ? "undefined" : value}
		</span>
	);
};

export const DBExplorer = React.memo(() => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const dbStore = useDatabaseStore();
	const selectedDatabase = useStore(dbStore, (st) => st.selectedDatabase);
	const selectedModel = useStore(dbStore, (st) => st.selectedModel);
	const database = useStore(dbStore, (st) => st.database);
	const authClient = useAuthClient();
	const model = database[selectedDatabase][selectedModel];
	const [colSizing, setColSizing] = React.useState<ColumnSizingState>({});

	const data = useQuery({
		queryKey: ["rows", selectedDatabase, selectedModel],
		queryFn: () => getRows(authClient, selectedModel),
	});

	const columns: ColumnDef<any>[] = React.useMemo(() => {
		const fields: ColumnDef<any>[] = [];

		// model.fields.id = {
		// 	type: "string", // TODO: Take into account of `useNumberId` to change this to `number`
		// 	required: true,
		// }
		fields.push({
			accessorKey: "id",
			header: ({ column }) => (
				<div className="flex items-center gap-2 text-foreground">
					<FieldIcon label="Primary Key">
						<Key className="size-3 text-primary" />
					</FieldIcon>
					{column.id}
					<span className="text-xs text-muted-foreground ml-1.5 mr-3">
						string
					</span>
				</div>
			),
			cell: ({ row }) => {
				return <ValueCell value={row.getValue("id")} />;
			},
			size: 200,
		});
		for (const field in model.fields) {
			fields.push({
				accessorKey: field,
				header: ({ column }) => {
					let icon = null;
					let label = null;
					if (model.fields[field].references) {
						icon = <Link className="size-3 text-primary" />;
						label = `Foreign Key: ${model.fields[field].references.model}.${model.fields[field].references.field}`;
					}
					return (
						<div className="text-foreground">
							<FieldIcon label={label}>{icon}</FieldIcon>
							{column.id}
							<span className="text-xs text-muted-foreground ml-1.5 mr-3">
								{model.fields[field].type}
							</span>
						</div>
					);
				},
				cell: ({ row }) => {
					const value = row.getValue(field) as any;
					return <ValueCell value={value} />;
				},
				enableResizing: true,
				size: 200,
			});
		}

		return [
			selectColumn,
			...fields,
			// {
			// 	accessorKey: "email",
			// 	header: ({ column }) => {
			// 		return (
			// 			<Button
			// 				variant="ghost"
			// 				onClick={() =>
			// 					column.toggleSorting(column.getIsSorted() === "asc")
			// 				}
			// 			>
			// 				Email
			// 				<ArrowUpDown />
			// 			</Button>
			// 		);
			// 	},
			// 	cell: ({ row }) => (
			// 		<div className="lowercase">{row.getValue("email")}</div>
			// 	),
			// },
			// {
			// 	accessorKey: "amount",
			// 	header: () => <div className="text-right">Amount</div>,
			// 	cell: ({ row }) => {
			// 		const amount = Number.parseFloat(row.getValue("amount"));

			// 		// Format the amount as a dollar amount
			// 		const formatted = new Intl.NumberFormat("en-US", {
			// 			style: "currency",
			// 			currency: "USD",
			// 		}).format(amount);

			// 		return <div className="text-right font-medium">{formatted}</div>;
			// 	},
			// },
			actionColumn,
		];
	}, [model]);

	const table = useReactTable({
		data: data.data ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onColumnSizingChange: setColSizing,
		enableColumnResizing: true,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			columnSizing: colSizing,
		},
		defaultColumn: {},
		columnResizeMode: "onChange",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const rows = useMemo(() => table.getRowModel().rows, [table, data.data]);

	if (!data.data) {
		return (
			<div className="w-full h-full bg-background flex flex-col overflow-hidden">
				<DBTopbar table={table} />
				<DBHeader table={table} />
				<div className="w-full h-full overflow-auto [&>div]:h-full"></div>
				<DBFooter table={table} />
			</div>
		);
	}

	return (
		<div className="w-full h-full bg-background flex flex-col overflow-hidden">
			<DBTopbar table={table} />
			<DBHeader table={table} />
			<div className="w-full relative h-full overflow-auto [&>div]:h-full">
				<Table style={{ width: table.getTotalSize() }}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:[&>*]:border-border"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="border border-transparent relative hover:[&>.resizer]:bg-border"
											style={{ width: header.getSize() }}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
											<div
												onMouseDown={header.getResizeHandler()}
												onTouchStart={header.getResizeHandler()}
												className={cn(
													"resizer absolute right-0 top-0 h-full w-1 z-10 select-none touch-none transition-colors duration-150 ease-in-out",
													header.column.getIsResizing()
														? "bg-primary/50"
														: header.column.getCanResize()
															? "hover:bg-border cursor-col-resize"
															: "hidden",
												)}
											></div>
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{rows.length ? (
							rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:[&>*]:border-border"
								>
									{row.getVisibleCells().map((cell) => {
										console.log(`size: ${cell.column.getSize()}`);
										return (
											<TableCell
												key={cell.id}
												className="border border-transparent truncate overflow-hidden"
												style={{
													width: cell.column.getSize(),
													// minWidth: cell.column.columnDef.minSize,
												}}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										);
									})}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
									style={{ width: `${table.getTotalSize()}px` }}
								>
									{data.isLoading
										? "Loading..."
										: data.isError
											? "Something went wrong"
											: "No results."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DBFooter table={table} />
		</div>
	);
});
