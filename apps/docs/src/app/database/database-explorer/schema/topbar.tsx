"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Table } from "@tanstack/react-table";
import { useStore } from "@tanstack/react-store";
import { useDatabaseStore } from "../provider";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const SchemaTopbar = () => {
	const dbStore = useDatabaseStore();
	const selectedModel = useStore(dbStore, (st) => st.selectedModel);
	const selectedDatabase = useStore(dbStore, (st) => st.selectedDatabase);

	return (
		<div className="w-full h-[58px] bg-sidebar border-b border-border flex items-center px-2">
			<SidebarTrigger className="cursor-pointer text-muted-foreground opacity-50" />
			<Breadcrumb className="ml-2">
				<BreadcrumbList>
					<BreadcrumbItem className="cursor-default">Schema</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground transition-all duration-150 outline-none cursor-pointer select-none">
								{selectedDatabase}
								<ChevronDown className="size-3" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										dbStore.setState((st) => ({
											...st,
											selectedDatabase: "primary",
										}));
									}}
								>
									primary
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => {
										dbStore.setState((st) => ({
											...st,
											selectedDatabase: "secondary",
										}));
									}}
								>
									secondary
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem className="cursor-default">
						<BreadcrumbPage>{selectedModel}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
};
