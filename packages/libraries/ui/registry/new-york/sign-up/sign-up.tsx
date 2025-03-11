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

export function SignUp() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback((values: FormSchema) => {
    authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/",
    });
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <NameField form={form} />
        <EmailField form={form} />
        <PasswordField form={form} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
