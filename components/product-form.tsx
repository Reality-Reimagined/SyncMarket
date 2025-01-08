"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).min(1, "Add at least one feature"),
  pricingType: z.enum(["one_time", "subscription", "hybrid"]),
  oneTimePrice: z.string().optional(),
  subscriptionPrice: z.string().optional(),
  subscriptionInterval: z.enum(["month", "year"]).optional(),
  setupFee: z.string().optional(),
  commission: z.object({
    oneTime: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid commission rate"),
    recurring: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid commission rate").optional(),
  }),
  image_url: z.string().url("Invalid image URL"),
  download_url: z.string().url("Invalid download URL").optional(),
  isSaas: z.boolean().default(false),
  category: z.string().min(1, "Please select a category"),
  demoUrl: z.string().url("Invalid demo URL").optional(),
  refundPolicy: z.string().min(1, "Please specify refund policy"),
  supportEmail: z.string().email("Invalid support email"),
  requirements: z.array(z.string()).default([]),
}).refine((data) => {
  if (data.pricingType === "one_time") {
    return !!data.oneTimePrice;
  }
  if (data.pricingType === "subscription") {
    return !!data.subscriptionPrice && !!data.subscriptionInterval;
  }
  if (data.pricingType === "hybrid") {
    return !!data.oneTimePrice && !!data.subscriptionPrice && !!data.subscriptionInterval;
  }
  return false;
}, "Invalid pricing configuration");

interface ProductFormProps {
  initialData?: z.infer<typeof productSchema>;
  onSubmit: (values: z.infer<typeof productSchema>) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      pricingType: "one_time",
      isSaas: false,
      commission: {
        oneTime: "30",
        recurring: "15",
      },
      features: [],
      requirements: [],
    },
  });

  const [newFeature, setNewFeature] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const pricingType = form.watch("pricingType");
  const isSaas = form.watch("isSaas");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Copy all form fields from create product page */}
        <FormField
          control={form.control}
          name="isSaas"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">SaaS Product</FormLabel>
                <FormDescription>
                  This is a software as a service product
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your product..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Download/Service URL based on isSaas */}
        <FormField
          control={form.control}
          name="download_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isSaas ? "Service URL" : "Download URL"}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                {isSaas 
                  ? "URL where customers can access your SaaS product"
                  : "Secure URL where customers can download the product"
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a product feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newFeature.trim()) {
                  const currentFeatures = form.getValues("features") || [];
                  form.setValue("features", [...currentFeatures, newFeature.trim()]);
                  setNewFeature("");
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.watch("features")?.map((feature, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {feature}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const features = form.getValues("features");
                    form.setValue(
                      "features",
                      features.filter((_, i) => i !== index)
                    );
                  }}
                />
              </Badge>
            ))}
          </div>
          <FormMessage>{form.formState.errors.features?.message}</FormMessage>
        </div>

        {/* Pricing Type */}
        <FormField
          control={form.control}
          name="pricingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="one_time">One-time Payment</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Setup Fee + Subscription)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Commission Structure */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="commission.oneTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {pricingType === "subscription" 
                    ? "Commission Rate" 
                    : "One-time Commission Rate"}
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Percentage of the sale price
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {(pricingType === "subscription" || pricingType === "hybrid") && (
            <FormField
              control={form.control}
              name="commission.recurring"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Commission Rate</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Percentage of recurring payments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Category Selection */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Support Email */}
        <FormField
          control={form.control}
          name="supportEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="support@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Email address for customer support inquiries
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
} 