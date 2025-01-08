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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth"; // You'll need to create this hook
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const affiliateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  payoutSchedule: z.string(),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  website: z.string().url("Please enter a valid URL"),
  socialLinks: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  paypalEmail: z.string().email("Please enter a valid email"),
  taxInfo: z.object({
    country: z.string(),
    vatNumber: z.string().optional(),
    businessType: z.enum(["individual", "company"]),
  }),
  marketingChannels: z.array(z.string()).min(1, "Select at least one marketing channel"),
  audienceSize: z.string(),
  isPublic: z.boolean().default(false),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export default function JoinAffiliatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  // Redirect if not logged in
  if (!user) {
    router.push('/login');
    return null;
  }

  const form = useForm<z.infer<typeof affiliateSchema>>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      name: "",
      company: "",
      payoutSchedule: "monthly",
      bio: "",
      website: "",
      socialLinks: {
        twitter: "",
        instagram: "",
        youtube: "",
        linkedin: "",
      },
      paypalEmail: "",
      taxInfo: {
        country: "",
        vatNumber: "",
        businessType: "individual",
      },
      marketingChannels: [],
      audienceSize: "",
      isPublic: false,
      categories: [],
      agreement: false,
    },
  });

  async function onSubmit(values: z.infer<typeof affiliateSchema>) {
    try {
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Create affiliate profile in Supabase
      const { data, error } = await supabase
        .from('affiliates')
        .insert({
          profile_id: user.id,
          name: values.name,
          company: values.company,
          payout_schedule: values.payoutSchedule,
          bio: values.bio,
          website: values.website,
          social_links: values.socialLinks,
          paypal_email: values.paypalEmail,
          tax_info: values.taxInfo,
          marketing_channels: values.marketingChannels,
          audience_size: values.audienceSize,
          is_public: values.isPublic,
          categories: values.categories,
          agreement_accepted: values.agreement,
          agreement_accepted_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Successfully joined the affiliate program!");
      router.push('/affiliates/dashboard');
    } catch (error) {
      console.error('Error creating affiliate profile:', error);
      toast.error("Failed to create affiliate profile");
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Become an Affiliate</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Profile</FormLabel>
                      <FormDescription>
                        Make your profile visible to vendors looking for affiliates
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
                name="payoutSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payout Schedule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payout frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself and your audience..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be shown on your affiliate profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website or Social Media</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paypalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We&apos;ll send your earnings to this PayPal account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange([...field.value, value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {field.value.map((category, index) => (
                        <div
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-2"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => {
                              const newCategories = field.value.filter((_, i) => i !== index);
                              field.onChange(newCategories);
                            }}
                            className="text-primary hover:text-primary/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company LLC" {...field} />
                    </FormControl>
                    <FormDescription>
                      If you're representing a company
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media Presence</h3>
                {Object.entries({
                  twitter: "Twitter",
                  instagram: "Instagram",
                  youtube: "YouTube",
                  linkedin: "LinkedIn"
                }).map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`socialLinks.${key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label} Profile</FormLabel>
                        <FormControl>
                          <Input placeholder={`${label} URL`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="marketingChannels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Channels</FormLabel>
                    <FormDescription>
                      How do you plan to promote products?
                    </FormDescription>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Email Marketing",
                        "Social Media",
                        "Blog/Content",
                        "YouTube",
                        "Paid Advertising",
                        "Other"
                      ].map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value.includes(channel)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, channel]);
                              } else {
                                field.onChange(field.value.filter((value) => value !== channel));
                              }
                            }}
                          />
                          <label>{channel}</label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="audienceSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your audience size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1000">0-1,000</SelectItem>
                        <SelectItem value="1000-5000">1,000-5,000</SelectItem>
                        <SelectItem value="5000-10000">5,000-10,000</SelectItem>
                        <SelectItem value="10000-50000">10,000-50,000</SelectItem>
                        <SelectItem value="50000+">50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxInfo.businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Terms and Conditions
                      </FormLabel>
                      <FormDescription>
                        I agree to the affiliate program terms and conditions
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Submit Application</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}