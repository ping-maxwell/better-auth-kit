import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { FormSchema } from "@/components/sign-up";

export function NameField({ form }: { form: UseFormReturn<FormSchema> }) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter your name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
