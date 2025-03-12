import type { UseFormReturn } from "react-hook-form";

export function RootError({ form }: { form: UseFormReturn<any> }) {
	if (!form.formState.errors.root) return null;
	return (
		<p className="text-destructive-foreground text-sm mb-3">
			{form.formState.errors.root.message}
		</p>
	);
}
