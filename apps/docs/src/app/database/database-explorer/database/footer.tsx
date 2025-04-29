import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export const DBFooter = ({ table }: { table: Table<any> }) => {
	return (
		<div className="w-full h-12 bg-sidebar border-t border-border flex items-center px-2">
			<div className="flex items-center justify-end space-x-4 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
