"use client";
import {
	Check,
	ChevronsUpDown,
	Database,
	FileClock,
	Layers,
	Layers2,
	Moon,
	Plus,
	RefreshCcw,
	Scroll,
	Sun,
	Table,
	Table2,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useStore } from "@tanstack/react-store";
import { queryClient, useAuthClient, useDatabaseStore } from "./provider";
import type { BetterAuthDbSchema } from "better-auth/db";
import { cn } from "@/lib/utils";
import {
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Command } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryState } from "nuqs";

function SidebarButton({
	icon,
	tooltip,
	onClick,
	isActive,
	isDisabled,
}: {
	icon: React.ReactNode;
	tooltip: string;
	onClick: () => void;
	isActive: boolean;
	isDisabled?: boolean;
}) {
	return (
		<TooltipProvider delayDuration={10}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size={"icon"}
						variant={"ghost"}
						className={cn(
							"size-10 cursor-pointer rounded-none",
							isActive ? "bg-accent border border-foreground/20" : "",
						)}
						onClick={onClick}
						disabled={isDisabled ?? false}
					>
						{icon}
					</Button>
				</TooltipTrigger>
				<TooltipContent
					side="right"
					sideOffset={5}
					className="bg-background text-foreground border border-border"
				>
					<p>{tooltip}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export const DBSidebar = () => {
	const selectedDatabase = useStore(
		useDatabaseStore(),
		(st) => st.selectedDatabase,
	);
	const database = useStore(useDatabaseStore(), (st) => st.database);
	const dbStore = useDatabaseStore();
	const selectedModel = useStore(dbStore, (st) => st.selectedModel);
	const { setTheme } = useTheme();
	const [selectedTab, setSelectedTab] = useQueryState("tab", {
		defaultValue: "database",
	});

	return (
		<Sidebar className="pl-[64px]">
			<Sidebar className="w-[64px]">
				<div className="w-full h-full flex items-center flex-col py-3 gap-3">
					<SidebarButton
						icon={<Database />}
						tooltip="Database"
						onClick={() => setSelectedTab("database")}
						isActive={selectedTab === "database"}
					/>
					<SidebarButton
						icon={<Layers2 />}
						tooltip="Schema"
						onClick={() => setSelectedTab("schema")}
						isActive={selectedTab === "schema"}
					/>
					<SidebarButton
						icon={<Scroll />}
						tooltip="Transactions"
						onClick={() => setSelectedTab("transactions")}
						isActive={selectedTab === "transactions"}
					/>
				</div>
				<div className="absolute bottom-0 left-0 w-[64px] flex flex-col gap-3 items-center pb-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-none">
								<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="rounded-none">
							<DropdownMenuItem
								onClick={() => setTheme("light")}
								className="rounded-none"
							>
								Light
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme("dark")}
								className="rounded-none"
							>
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme("system")}
								className="rounded-none"
							>
								System
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Sidebar>
			<SidebarHeader className="pt-3">
				<SelectDatabase />
				<SearchBar />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Models</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{getModels(database[selectedDatabase]).map((item) => {
								return (
									<SidebarMenuItem key={item}>
										<SidebarMenuButton
											onClick={() => {
												dbStore.setState((st) => ({
													...st,
													selectedModel: item,
												}));
											}}
											className={cn(
												"rounded-none cursor-pointer hover:bg-accent border border-transparent",
												selectedModel === item
													? "bg-accent border-foreground/20"
													: "",
											)}
										>
											<Table2 />
											<span>{item}</span>
											<TableRows model={item} />
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
};
function TableRows({ model }: { model: string }) {
	const selectedDatabase = useStore(
		useDatabaseStore(),
		(st) => st.selectedDatabase,
	);
	const database = useStore(useDatabaseStore(), (st) => st.database);
	const authClient = useAuthClient();

	const rowCount = useQuery({
		queryKey: ["rowCount", selectedDatabase, model],
		queryFn: async () => {
			const name = getDefaultModelName({
				schema: database[selectedDatabase],
				model,
			});
			const { data: rows } = await authClient.current.adapter.count({
				model: name,
			});
			return rows ?? 0;
		},
	});

	return (
		<Badge
			variant="outline"
			className="ml-auto rounded-full border-transparent text-muted-foreground"
		>
			{rowCount.isPending ? "" : rowCount.data}
		</Badge>
	);
}

function SearchBar() {
	const [isPending, setIsPending] = useState(false);
	return (
		<div className=" flex gap-2 justify-center items-center w-full">
			<Input
				placeholder="Filter models..."
				className={cn("rounded-none border-border/70 hover:border-border ")}
			/>
			<Button
				variant="outline"
				size="icon"
				disabled={isPending}
				className="text-muted-foreground cursor-pointer rounded-none w-12 border-border/70 hover:border-border"
				onClick={async () => {
					setIsPending(true);
					await queryClient.invalidateQueries({ queryKey: ["rowCount"] });
					setIsPending(false);
				}}
			>
				<RefreshCcw />
			</Button>
		</div>
	);
}

const databases = [
	{
		value: "primary",
		label: "primary",
	},
	{
		value: "secondary",
		label: "secondary",
	},
];

function SelectDatabase() {
	const dbStore = useDatabaseStore();
	const [open, setOpen] = useState(false);
	const selectedDatabase = useStore(dbStore, (st) => st.selectedDatabase);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between rounded-none border-border/70 hover:border-border"
				>
					{selectedDatabase ? (
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">database:</span>
							{
								databases.find(
									(framework) => framework.value === selectedDatabase,
								)?.label
							}
						</div>
					) : (
						"Select database..."
					)}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search database..." className="h-9" />
					<CommandList>
						<CommandEmpty>No database found.</CommandEmpty>
						<CommandGroup>
							{databases.map((database) => (
								<CommandItem
									key={database.value}
									value={database.value}
									onSelect={() => {
										dbStore.setState((st) => ({
											...st,
											selectedDatabase: database.value,
										}));
										setOpen(false);
									}}
								>
									{database.label}
									<Check
										className={cn(
											"ml-auto",
											selectedDatabase === database.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function getModels(schema: BetterAuthDbSchema) {
	return Object.keys(schema).map((model) => schema[model].modelName ?? model);
}

function getDefaultModelName({
	schema,
	model,
}: { schema: BetterAuthDbSchema; model: string }) {
	if (schema[model]) return model;
	const found = Object.entries(schema).find(
		([key, value]) => value.modelName === model,
	);
	if (found) return found[0];
	throw new Error(`Model ${model} not found`);
}
