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
import { startTransition, useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { onboardingUserSchema } from "./schema";
import { z } from "zod";
import useFormPersist from 'react-hook-form-persist'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, handleFormSubmit } from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";



const OnboardingFormUser = () => {

  const {user} = useUser()
  const [state, formAction] = useActionState(completeOnboarding, {
    message: ""
  });
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.output<typeof onboardingUserSchema>>({
    resolver: zodResolver(onboardingUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
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
        await user.reload()
        redirect("/onboarding/company")
      })()
    }
  }, [state.success, user])

  return (
    <Card className="max-w-3xl w-full">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Welcome to propertify!</CardTitle>
            <CardDescription>
              Let&apos;s get to know you a little better
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
          {state?.message !== "" && !state.errors && (
            <div className="text-red-500">{state.message}</div>
          )}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
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

export default OnboardingFormUser
