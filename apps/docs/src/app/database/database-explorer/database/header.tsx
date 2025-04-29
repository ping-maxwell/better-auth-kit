import type { Table } from "@tanstack/react-table";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
	ArrowUpDown,
	ChevronDown,
	Columns,
	Filter,
	RefreshCcw,
} from "lucide-react";

// Example of how to filter by email
{
	/* <Input
	placeholder="Filter emails..."
	value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
	onChange={(event) =>
		table.getColumn("email")?.setFilterValue(event.target.value)
	}
	className="max-w-sm"
/>; */
}

// Example of how to filter the visible columns
{
	/* <DropdownMenu>
	<DropdownMenuTrigger asChild>
		<Button variant="outline" className="ml-auto">
			Columns <ChevronDown />
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent align="end">
		{table
			.getAllColumns()
			.filter((column) => column.getCanHide())
			.map((column) => {
				return (
					<DropdownMenuCheckboxItem
						key={column.id}
						className="capitalize"
						checked={column.getIsVisible()}
						onCheckedChange={(value) => column.toggleVisibility(!!value)}
					>
						{column.id}
					</DropdownMenuCheckboxItem>
				);
			})}
	</DropdownMenuContent>
</DropdownMenu>; */
}

export const DBHeader = ({ table }: { table: Table<any> }) => {
	return (
		<div className="w-full h-[60px] bg-sidebar border-b border-border flex items-center px-2 gap-2 relative ">
			<Button
				variant="outline"
				size="sm"
				className="h-7 cursor-pointer bg-accent/50"
			>
				<Filter className="size-3 opacity-80" />
				Filter
			</Button>
			<Button
				variant="outline"
				size="sm"
				className="h-7 cursor-pointer bg-accent/50"
			>
				<ArrowUpDown className="size-3 opacity-80" />
				Sort
			</Button>
			<Button
				variant="outline"
				size="sm"
				className="h-7 cursor-pointer bg-accent/50"
			>
				<Columns className="size-3 opacity-80" />
				Columns
			</Button>

			<div className="absolute right-0 left-0 h-full flex items-center justify-end gap-2 mr-2 pointer-events-none">
				<Button
					variant="outline"
					size="sm"
					className="h-7 pointer-events-auto cursor-pointer bg-accent/50"
				>
					<RefreshCcw />
					Refresh
				</Button>
			</div>
		</div>
	);
};
