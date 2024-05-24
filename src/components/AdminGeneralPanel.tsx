"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
const formSchema = z.object({
  placeholder: z.string().min(2).max(50),
})


export default function General() {
    // States
    const [publicSubmission, setPublicSubmission] = useState(false);

    // Methods for handling states
    const handlePublicSubmission = () => {
        setPublicSubmission(!publicSubmission);
    }
    
    const handleSaveChanges = () => {
        // ไอ้ควย
    }

    // Forms
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        placeholder: 'SUPA NIGGA',
      },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      console.log(values)
    }

    return (
    <Card className='min-w-max w-[350px] sm:w-[450px] md:w-[600px] xl:w-[700px] h-max'>
        <CardHeader>
            <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
            {/*
            <div className="flex flex-col gap-4">
                <div className='flex flex-row-reverse items-center justify-end gap-4'>
                    <Label htmlFor="public-submission">Public submissions</Label>
                    <Switch id="public-submission" checked={publicSubmission} onCheckedChange={handlePublicSubmission} />
                </div>
            </div>
            */}
            <Form {...form}>
                <form className='' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="placeholder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eat more</FormLabel>
                                <FormControl>
                                    <Input placeholder='placeholder' {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Submit</Button>
                </form>
            </Form>
        </CardContent>
        <CardFooter>
            {/* ไอ้ควย
            <Button onClick={handleSaveChanges}>Save changes</Button>
            */}
        </CardFooter>
    </Card>
    )
}
