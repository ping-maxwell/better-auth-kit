"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import { AsideLink } from "@/components/ui/aside-link";
import {
	type ReactNode,
	type SVGProps,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Book, BookCopy, ChevronDownIcon, type LucideIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "./mobile-sidebar-controller";
import { usePathname } from "next/navigation";
import { useComprehensive } from "./comprehensive-provider";
export interface Content {
	title: string;
	Icon: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
	list: {
		title: string;
		href: string;
		icon: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
		group?: boolean;
	}[];
}

export function Sidebar({
	contents,
	levelOfDetailButton,
}: {
	contents: Content[];
	levelOfDetailButton: boolean;
}) {
	const [currentOpen, setCurrentOpen] = useState<number>(0);
	const { isOpen, setIsOpen } = useMobileSidebar();
	const { levelOfDetail: levelOfDetailR, set, onChange } = useComprehensive();
	const [levelOfDetail, setLevelOfDetail] = useState<"basic" | "comprehensive">(
		levelOfDetailR,
	);
	const cts = contents;
	const pathname = usePathname();

	const getDefaultValue = useCallback(() => {
		const defaultValue = contents.findIndex((item) =>
			item.list.some((listItem) => listItem.href === pathname),
		);
		return defaultValue === -1 ? 0 : defaultValue;
	}, [pathname, contents.findIndex]);

	useEffect(() => {
		setCurrentOpen(getDefaultValue());
	}, [getDefaultValue]);

	useEffect(() => {
		const unsub = onChange((detail) => {
			setLevelOfDetail(detail);
		});
		return unsub;
	}, [onChange]);

	return (
		<div className="fixed top-0 z-10">
			<aside
				className={cn(
					"border-r border-lines sm:w-[var(--fd-sidebar-width)] bg-background w-screen overflow-y-auto absolute top-[65px] h-[calc(100dvh_-_65px)] flex-col justify-between",
					isOpen ? "flex" : "hidden sm:flex",
				)}
			>
				<div className="h-full relative w-full">
					<MotionConfig
						transition={{
							duration: 0.4,
							type: "spring",
							bounce: 0,
						}}
					>
						<div className="flex flex-col">
							{cts.map((item, index) => (
								<div key={item.title}>
									<button
										className="border-b w-full hover:underline border-lines text-sm px-5 py-2.5 text-left flex items-center gap-2"
										type="button"
										onClick={() => {
											if (currentOpen === index) {
												setCurrentOpen(-1);
											} else {
												setCurrentOpen(index);
											}
										}}
									>
										<item.Icon className="w-5 h-5" />
										<span className="grow">{item.title}</span>
										<motion.div
											animate={{
												rotate: currentOpen === index ? 180 : 0,
											}}
										>
											<ChevronDownIcon
												className={cn(
													"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
												)}
											/>
										</motion.div>
									</button>
									<AnimatePresence initial={false}>
										{currentOpen === index && (
											<motion.div
												initial={{
													opacity: 0,
													height: 0,
												}}
												animate={{
													opacity: 1,
													height: "auto",
												}}
												exit={{ opacity: 0, height: 0 }}
												className="relative overflow-hidden"
											>
												<motion.div
													// initial={{ opacity: 0, y: -20 }}
													// animate={{ opacity: 1, y: 0 }}
													className="text-sm"
												>
													{item.list.map((listItem, j) => (
														<div key={listItem.title}>
															<Suspense fallback={<>Loading...</>}>
																{listItem.group ? (
																	<div className="flex flex-row items-center gap-2 mx-5 my-1 ">
																		<p className="text-sm text-transparent bg-gradient-to-tr dark:from-gray-100 dark:to-stone-200 bg-clip-text from-gray-900 to-stone-900">
																			{listItem.title}
																		</p>
																		<div className="flex-grow h-px bg-gradient-to-r from-stone-800/90 to-stone-800/60" />
																	</div>
																) : (
																	<AsideLink
																		href={listItem.href}
																		startWith="/docs"
																		title={listItem.title}
																		className="break-words sm:w-[var(--fd-sidebar-width)] w-screen"
																		onClick={() => {
																			setIsOpen(false);
																		}}
																	>
																		<listItem.icon className="w-4 h-4 text-stone-950 dark:text-white" />
																		{listItem.title}
																	</AsideLink>
																)}
															</Suspense>
														</div>
													))}
												</motion.div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							))}
						</div>
						{levelOfDetailButton ? (
							<LevelofDetailButton
								levelOfDetail={levelOfDetail}
								set={set}
								setIsOpen={setIsOpen}
							/>
						) : null}
					</MotionConfig>
				</div>
			</aside>
		</div>
	);
}

function LevelofDetailButton({
	levelOfDetail,
	set,
	setIsOpen,
}: {
	levelOfDetail: "basic" | "comprehensive";
	set: (val: "basic" | "comprehensive") => void;
	setIsOpen: (isOpen: boolean) => void;
}) {
	return (
		<div className="w-full flex justify-center items-center h-16 gap-2 absolute bottom-0 border-t border-fd-border">
			<Select
				defaultValue="basic"
				value={levelOfDetail}
				onValueChange={(val: "basic" | "comprehensive") => {
					set(val);
					setIsOpen(false);
				}}
			>
				<SelectTrigger className="h-16 border w-full shadow-none border-b border-none rounded-none outline-none focus:ring-transparent">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="basic" className="h-12">
						<div className="flex justify-center items-center gap-3">
							<Book className="size-6 min-w-7" />
							<div className="flex flex-col justify-start items-start">
								Basic
								<p className="text-xs text-fd-muted-foreground ">
									Less detail & straight forward.
								</p>
							</div>
						</div>
					</SelectItem>
					<SelectItem value="comprehensive" className="h-12">
						<div className="flex justify-center items-center gap-3">
							<BookCopy className="size-6 min-w-7" />
							<div className="flex flex-col justify-start items-start">
								Comprehensive
								<p className="text-xs text-fd-muted-foreground ">
									More detail & comprehensive.
								</p>
							</div>
						</div>
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
