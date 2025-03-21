import { cn } from "@/lib/utils";

export const BentoGrid = ({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
				className,
			)}
		>
			{children}
		</div>
	);
};

export const BentoGridItem = ({
	className,
	title,
	description,
	header,
	icon,
	onMouseEnter,
	onMouseLeave,
	onClick,
}: {
	className?: string;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	header?: React.ReactNode;
	icon?: React.ReactNode;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onClick?: () => void;
}) => {
	return (
		<div
			className={cn(
				"row-span-1 rounded-xl group/bento transition duration-200 shadow-input dark:shadow-none p-4  border border-fd-border justify-between flex flex-col space-y-4",
				className,
			)}
			onMouseEnter={() => onMouseEnter?.()}
			onMouseLeave={() => onMouseLeave?.()}
			onClick={() => onClick?.()}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onClick?.();
				}
			}}
		>
			{header}
			<div className="group-hover/bento:translate-x-2 transition duration-200">
				{icon}
				<div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
					{title}
				</div>
				<div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
					{description}
				</div>
			</div>
		</div>
	);
};
