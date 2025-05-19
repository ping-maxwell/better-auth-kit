"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCallback, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordField } from "@/components/password-field";
import { EmailField } from "@/components/email-field";
import { RootError } from "@/components/root-error";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters",
	}),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface SignInProps {
	onSuccess?: (context: SuccessContext) => void;
	onError?: (context: ErrorContext) => void;
	callbackURL?: string;
	className?: string;
}

export function SignIn(props?: SignInProps) {
	const form = useForm({
		resolver: zodResolver(formSchema as any),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = useCallback(
		(values: FormSchema) => {
			setIsLoading(true);
			authClient.signIn.email(
				{
					...values,
					callbackURL: props?.callbackURL,
				},
				{
					onSuccess(context) {
						setIsLoading(false);
						toast.success(`Welcome back ${context.data.user.name}!`);
						return props?.onSuccess?.(context);
					},
					onError(context) {
						setIsLoading(false);
						toast.error(`There was an issue signing you in.`, {
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
					<PasswordField form={form} isLoading={isLoading} />
					<RootError form={form} />
					<SubmitButton isLoading={isLoading} />
				</form>
				<DontHaveAccount />
			</Form>
		</div>
	);
}

function Title() {
	return (
		<div className="w-full flex flex-col gap-2 justify-center items-center">
			<h1 className="text-lg font-bold">Sign in to your account</h1>
			<p className="text-muted-foreground text-xs">
				Welcome back! Please sign in to continue.
			</p>
		</div>
	);
}

function DontHaveAccount() {
	return (
		<div className="w-full flex justify-center items-center gap-2 text-sm mt-5">
			<p className="text-muted-foreground">Don't have an account?</p>
			<a href="/sign-up">Sign up</a>
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
