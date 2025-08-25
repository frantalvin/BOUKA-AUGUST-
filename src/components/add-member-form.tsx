
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Upload } from "lucide-react";
import type { Person } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";


const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom de famille est requis."),
  dob: z.string().min(1, "La date de naissance est requise."),
  profilePictureUrl: z.string().nullable().optional(),
  parentId: z.string().nullable(),
});

type AddMemberFormValues = z.infer<typeof formSchema>;

interface AddMemberFormProps {
  onSubmit: (data: Omit<Person, "id">) => void;
  onCancel: () => void;
  existingMembers: Person[];
}

export function AddMemberForm({ onSubmit, onCancel, existingMembers }: AddMemberFormProps) {
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      profilePictureUrl: null,
      parentId: null,
    },
  });

  const profilePictureUrlValue = form.watch("profilePictureUrl");

  const handleSubmit = (values: AddMemberFormValues) => {
    onSubmit({
      ...values,
      parentId: values.parentId === "null" || values.parentId === null ? null : values.parentId,
    });
    form.reset();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("profilePictureUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de famille</FormLabel>
                <FormControl>
                  <Input placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="ex: 15/03/1890" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePictureUrl"
          render={() => (
            <FormItem>
              <FormLabel>Photo de profil</FormLabel>
              <div className="flex items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={profilePictureUrlValue ?? undefined} />
                    <AvatarFallback>
                      <User className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                <FormControl>
                  <Button asChild variant="outline">
                    <label className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Téléverser
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </Button>
                </FormControl>
              </div>
               <FormDescription>
                Téléversez une photo depuis votre appareil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""} defaultValue="">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Aucun (Membre racine)</SelectItem>
                  {existingMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Ajouter un membre</Button>
        </div>
      </form>
    </Form>
  );
}
