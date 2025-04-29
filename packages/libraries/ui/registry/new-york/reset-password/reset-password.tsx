"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootError } from "@/components/root-error";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { PasswordField } from "@/components/password-field";

const formSchema = z.object({
	password: z.string().min(6, {
		message: "Password must be at least 6 characters",
	}),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface ResetPasswordProps {
	onSuccess?: (context: SuccessContext) => void;
	onError?: (context: ErrorContext) => void;
	redirectTo?: string;
	className?: string;
}

export function ResetPassword(props?: ResetPasswordProps) {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = useCallback(
		(values: FormSchema) => {
			setIsLoading(true);
			authClient.resetPassword(
				{
					newPassword: values.password,
					token: new URLSearchParams(window.location.search).get("token") ?? "",
				},
				{
					onSuccess(context) {
						setIsLoading(false);
						toast.success(`Password successfully reset!`);
						return props?.onSuccess?.(context);
					},
					onError(context) {
						setIsLoading(false);
						toast.error(`There was an issue resetting your password.`, {
							description: <>{context.error.message}</>,
						});
						form.setError("root", { message: context.error.message });
						return props?.onError?.(context);
					},
				},
			);
		},
		[props, form.setError],
	);

	return (
		<div
			className={cn(
				"space-y-8 w-96 border border-border rounded-2xl p-8 shadow-2xl bg-card text-card-foreground",
				props?.className,
			)}
		>
			<Form {...form}>
				<Title />
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<PasswordField form={form} isLoading={isLoading} />
					<RootError form={form} />
					<SubmitButton isLoading={isLoading} />
				</form>
			</Form>
		</div>
	);
}

function Title() {
	return (
		<div className="w-full flex flex-col gap-2 justify-center items-center">
			<h1 className="text-lg font-bold">Reset your password</h1>
			<p className="text-muted-foreground text-xs">Enter your new password.</p>
		</div>
	);
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
	return (
		<Button
			type="submit"
			className="w-full cursor-pointer"
			disabled={isLoading}
		>
			{isLoading ? <LoaderCircle className="animate-spin" /> : "Continue"}
		</Button>
	);
}
