"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailField } from "@/components/email-field";
import { RootError } from "@/components/root-error";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
	email: z.string().email(),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface ForgotPasswordProps {
	onSuccess?: (context: SuccessContext) => void;
	onError?: (context: ErrorContext) => void;
	redirectTo?: string;
	className?: string;
}

export function ForgotPassword(props?: ForgotPasswordProps) {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = useCallback(
		(values: FormSchema) => {
			setIsLoading(true);
			authClient.forgetPassword(
				{
					...values,
					redirectTo: props?.redirectTo,
				},
				{
					onSuccess(context) {
						setIsLoading(false);
						toast.success(`Check your email for a reset link!`);
						return props?.onSuccess?.(context);
					},
					onError(context) {
						setIsLoading(false);
						toast.error(`There was an issue sending a reset password link.`, {
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
					<EmailField form={form} isLoading={isLoading} />
					<RootError form={form} />
					<SubmitButton isLoading={isLoading} />
				</form>
				<LoginInstead />
			</Form>
		</div>
	);
}

function Title() {
	return (
		<div className="w-full flex flex-col gap-2 justify-center items-center">
			<h1 className="text-lg font-bold">Forgot your password?</h1>
			<p className="text-muted-foreground text-xs">
				Enter your email to reset your password.
			</p>
		</div>
	);
}

function LoginInstead() {
	return (
		<div className="w-full flex justify-center items-center gap-2 text-sm mt-5">
			<p className="text-muted-foreground">Remember your password?</p>
			<a href="/sign-in">Sign in</a>
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
