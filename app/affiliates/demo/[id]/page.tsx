"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Globe, Users, Award, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const DEMO_AFFILIATES = [
    {
      id: "demo-1",
      name: "Sarah Johnson",
      bio: "Digital marketing expert with 8+ years of experience specializing in SaaS and tech products. I help companies scale their digital presence through strategic marketing and authentic promotion.",
      website: "https://sarahjohnson.com",
      totalSales: 156,
      conversionRate: "4.2%",
      categories: ["Marketing", "Technology", "Education"],
      audience_size: "10000-50000",
      marketing_channels: ["Email Marketing", "Social Media", "Blog/Content"],
      social_links: {
        twitter: "https://twitter.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        instagram: "https://instagram.com/sarahj.digital",
        youtube: "https://youtube.com/@sarahjohnson"
      },
      is_public: true,
      email: "sarah@example.com",
      paypal_email: "sarah@example.com",
      affiliate_sales: {
        total_sales: 156,
        total_commission: 15600,
        conversion_rate: 4.2
      }
    },
    {
      id: "demo-2",
      name: "Michael Chen",
      bio: "Tech reviewer and software development instructor reaching over 100k developers monthly. Focused on helping developers and tech enthusiasts make informed decisions about development tools and educational resources.",
      website: "https://michaelchen.dev",
      totalSales: 89,
      conversionRate: "3.8%",
      categories: ["Technology", "Development", "Education"],
      audience_size: "50000+",
      marketing_channels: ["YouTube", "Blog/Content", "Social Media", "Email Marketing"],
      social_links: {
        youtube: "https://youtube.com/@michaelchendev",
        twitter: "https://twitter.com/michaelchendev",
        linkedin: "https://linkedin.com/in/michaelchendev",
      },
      is_public: true,
      email: "michael@example.com",
      paypal_email: "michael@example.com",
      affiliate_sales: {
        total_sales: 89,
        total_commission: 8900,
        conversion_rate: 3.8
      }
    },
  ];
  

export default function DemoAffiliateProfilePage({ params }: { params: { id: string } }) {
  const affiliate = DEMO_AFFILIATES.find(a => a.id === params.id);

  if (!affiliate) {
    return <div className="container mx-auto py-10">Affiliate not found</div>;
  }

  const handleContact = async () => {
    await navigator.clipboard.writeText(affiliate.email);
    toast.success("Email copied to clipboard!");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{affiliate.name}</CardTitle>
                <div className="flex gap-2 mt-4">
                  {affiliate.categories.map((category, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <Button onClick={handleContact} variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Bio Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{affiliate.bio}</p>
            </div>

            {/* Marketing Channels & Audience */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Marketing Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {affiliate.marketing_channels.map((channel, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audience Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{affiliate.audience_size}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Links */}
            {affiliate.social_links && Object.keys(affiliate.social_links).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(affiliate.social_links).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary hover:underline"
                      >
                        <span className="capitalize">{platform}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Website */}
            {affiliate.website && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Website</h3>
                <a
                  href={affiliate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  <span>{affiliate.website}</span>
                </a>
              </div>
            )}

            {/* Performance Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{affiliate.totalSales}</div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{affiliate.conversionRate}</div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">${(affiliate.affiliate_sales.total_commission / 100).toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Total Commission</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 