import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { FormSchema } from "@/components/sign-up";

export function PasswordField({
  form,
}: {
  form: UseFormReturn<FormSchema>;
}) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="shadcn" {...field} />
          </FormControl>
          <FormDescription>Enter your password.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
