"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { NameField } from "@/components/name-field";
import { PasswordField } from "@/components/password-field";
import { EmailField } from "@/components/email-field";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface SignUpProps {
  onSuccess?: (context: SuccessContext) => void;
  onError?: (context: ErrorContext) => void;
  callbackURL?: string;
  className?: string;
}

export function SignUp(props?: SignUpProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    (values: FormSchema) => {
      authClient.signUp.email(
        {
          ...values,
          callbackURL: props?.callbackURL,
        },
        {
          onSuccess(context) {
            return props?.onSuccess?.(context);
          },
          onError(context) {
            return props?.onError?.(context);
          },
        }
      );
    },
    [props]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-8 w-96 border border-border rounded-2xl p-8 shadow-2xl bg-card text-card-foreground",
          props?.className
        )}
      >
        <Title />
        <div className="space-y-8">
          <NameField form={form} />
          <EmailField form={form} />
          <PasswordField form={form} />
          <Button type="submit" className="w-full cursor-pointer">
            Create account
          </Button>
        </div>
        <AlreadyHaveAccount />
      </form>
    </Form>
  );
}

function Title() {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <h1 className="text-lg font-bold">Create your account</h1>
      <p className="text-muted-foreground text-xs">
        Welcome! Please fill in your details to get started.
      </p>
    </div>
  );
}

function AlreadyHaveAccount() {
  return (
    <div className="w-full flex justify-center items-center gap-2 text-sm mt-5">
      <p className="text-muted-foreground">Already have an account?</p>
      <a href="/sign-in">Sign in</a>
    </div>
  );
}
