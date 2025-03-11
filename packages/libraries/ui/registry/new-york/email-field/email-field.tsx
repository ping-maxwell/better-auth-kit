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

export function EmailField({
  form,
}: {
  form: UseFormReturn<FormSchema>;
}) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="shadcn" {...field} />
          </FormControl>
          <FormDescription>Enter your email.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
