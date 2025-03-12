import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

export function PasswordField({
	form,
	isLoading,
}: {
	form: UseFormReturn<any>;
	isLoading: boolean;
}) {
	const [hide, setHide] = useState(true);
	return (
		<div className="relative">
			<FormField
				control={form.control}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Password</FormLabel>
						<FormControl>
							<Input
								type={hide ? "text" : "password"}
								placeholder="Enter your password"
								disabled={isLoading}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Button
				className="right-2 absolute top-7 size-6 z-10"
				size={"sm"}
				variant={"ghost"}
				role="button"
				type="button"
				onClick={() => setHide(!hide)}
			>
				{hide ? <Eye /> : <EyeClosed />}
			</Button>
		</div>
	);
}
