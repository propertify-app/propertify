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
import { completeOnboarding } from "./actions";
import { LoaderIcon } from "lucide-react";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { onboardingCompanySchema } from "./schema";
import { z } from "zod";
import useFormPersist from 'react-hook-form-persist'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";



const OnboardingFormCompany = () => {

  const { user } = useUser()
  const [state, formAction] = useActionState(completeOnboarding, {
    message: ""
  });
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.output<typeof onboardingCompanySchema>>({
    resolver: zodResolver(onboardingCompanySchema),
    defaultValues: {
      name: "",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null)

  useFormPersist("storageKey", {
    watch: form.watch, 
    setValue: form.setValue
  });

  const handleSubmit = () => {
    startTransition(() => {
      formAction(new FormData(formRef.current!))
    })
  }

  useEffect(() => {
    if(state.success && user) {
      (async () => {
        user.reload()
        redirect("/")
      })()
    }
  }, [state.success, user])

  return (
    <Card className="max-w-3xl w-full">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Let&apos;s create a company</CardTitle>
            <CardDescription>
              A company is where your rentals reside
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
          {state?.message !== "" && !state.errors && (
            <div className="text-red-500">{state.message}</div>
          )}
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
          </CardContent>
          <CardFooter className="justify-end">
            <Button disabled={isPending} type="submit">
              {isPending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Please wait" : "Next"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default OnboardingFormCompany
