"use client"

import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input";
import GoogleSignIn from "../GoogleSignIn";
import { useSession, signIn, signOut } from "next-auth/react"
const FormSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1,'Password is required').min(8,'Password must have more than 8 characters'),

  })
const SignInForm = () => {
    const { data: session } = useSession()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      });
    const onSubmit = (values:z.infer<typeof FormSchema>) => {
        console.log(values);
    }
    if (session) {
        return (
        <>
            {/* Signed in as {session.user.email} <br /> */}
            <button onClick={() => signOut()}>Sign out</button>
        </>
        )
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="Email-ID" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Button className="w-full mt-6" type="submit">Sign Me In!</Button>
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
      or
      </div>
      {/* <GoogleSignIn>Sign in with Google!</GoogleSignIn> */}
      <Button onClick={() => signIn()} className="w-full">Sign in with Google!</Button>


    </Form>
  )
}

export default SignInForm