"use client"

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCompanyAction } from "./action";
import { LoaderIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { redirect, useRouter } from "next/navigation";
import { createCompanyFormSchema } from "./schema";
import { useSetAtom } from "jotai";
import { useMolecule } from "bunshi/react";
import { companyMolecule } from "@/lib/molecules/company";



export default function CreateCompanyForm() {
  const router = useRouter();
  const { invalidateCompanyQueriesAtom } = useMolecule(companyMolecule)
  const invalidateCompanyQueries = useSetAtom(invalidateCompanyQueriesAtom)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.output<typeof createCompanyFormSchema>>({
    resolver: zodResolver(createCompanyFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.output<typeof createCompanyFormSchema>) => {
    startTransition(async () => {
      try {
        const result = await createCompanyAction(data);
        if (result.success) {
          invalidateCompanyQueries()
          router.back();
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Company name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending} type="submit">
          {isPending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Please wait" : "Create"}
        </Button>
      </form>
    </Form>
  );
};
