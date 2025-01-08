"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Globe, Users, Award, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface AffiliateProfile {
  id: string;
  name: string;
  bio: string;
  website: string;
  social_links: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  marketing_channels: string[];
  audience_size: string;
  categories: string[];
  is_public: boolean;
  paypal_email: string;
}

export default function AffiliateProfilePage({ params }: { params: { id: string } }) {
  const [affiliate, setAffiliate] = useState<AffiliateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadAffiliate() {
      try {
        const { data, error } = await supabase
          .from('affiliates')
          .select(`
            *,
            affiliate_sales (
              total_sales,
              total_commission,
              conversion_rate
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setAffiliate(data);
      } catch (error) {
        console.error('Error loading affiliate:', error);
        toast.error("Failed to load affiliate profile");
      } finally {
        setLoading(false);
      }
    }

    loadAffiliate();
  }, [params.id, supabase]);

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!affiliate) {
    return <div className="container mx-auto py-10">Affiliate not found</div>;
  }

  const handleContact = async () => {
    await navigator.clipboard.writeText(affiliate.paypal_email);
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 