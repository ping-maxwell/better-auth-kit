import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function BuilderExport() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					className="absolute bottom-[25px] right-[calc(var(--fd-sidebar-width)_+_25px)] drop-shadow-lg"
					variant={"outline"}
				>
					Export
				</Button>
			</SheetTrigger>
			<SheetContent side="bottom" className="h-[300px] mx-auto w-screen">
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
