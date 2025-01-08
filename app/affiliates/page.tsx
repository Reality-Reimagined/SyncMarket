"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Award, TrendingUp, Mail, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

// Keep demo affiliates for showcase
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

interface Affiliate {
  id: string;
  name: string;
  bio: string;
  website: string;
  categories: string[];
  marketing_channels: string[];
  audience_size: string;
  paypal_email: string;
  is_public: boolean;
}

export default function AffiliatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadAffiliates();
  }, []);

  async function loadAffiliates() {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('is_public', true);

      if (error) throw error;
      setAffiliates(data || []);
    } catch (error) {
      console.error('Error loading affiliates:', error);
      toast.error("Failed to load affiliates");
    } finally {
      setLoading(false);
    }
  }

  const handleContact = async (email: string) => {
    // Copy email to clipboard
    await navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };

  const filteredDemoAffiliates = DEMO_AFFILIATES.filter(affiliate =>
    affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRealAffiliates = affiliates.filter(affiliate =>
    affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Directory</h1>
          <p className="text-muted-foreground">Connect with top-performing affiliates</p>
        </div>
        <div className="space-x-4">
          <Link href="/affiliates/join">
            <Button>Become an Affiliate</Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search affiliates..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Demo Affiliates Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured Affiliates</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {filteredDemoAffiliates.map((affiliate) => (
            <AffiliateCard 
              key={affiliate.id} 
              affiliate={affiliate} 
              onContact={() => handleContact(affiliate.email)}
              demo={true}
            />
          ))}
        </div>
      </div>

      {/* Real Affiliates Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Affiliates</h2>
        {loading ? (
          <div className="text-center py-8">Loading affiliates...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredRealAffiliates.map((affiliate) => (
              <AffiliateCard 
                key={affiliate.id} 
                affiliate={affiliate} 
                onContact={() => handleContact(affiliate.paypal_email)}
                demo={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for affiliate cards
function AffiliateCard({ 
  affiliate, 
  onContact,
  demo 
}: { 
  affiliate: any, 
  onContact: () => void,
  demo: boolean 
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href={
                demo 
                  ? `/affiliates/demo/${affiliate.id}` 
                  : `/affiliates/${affiliate.id}`
              }
            >
              <CardTitle className="hover:text-primary cursor-pointer">
                {affiliate.name}
              </CardTitle>
            </Link>
            <div className="flex gap-2 mt-2">
              {(demo ? affiliate.categories : affiliate.categories || []).map((category: string, i: number) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {category}
                </span>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onContact}>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{affiliate.bio}</p>
        <div className="grid grid-cols-2 gap-4">
          {demo ? (
            <>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Sales</p>
                  <p className="text-2xl font-bold">{affiliate.totalSales}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold">{affiliate.conversionRate}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Audience Size</p>
                  <p className="text-2xl font-bold">{affiliate.audience_size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Marketing Channels</p>
                  <p className="text-sm">{(affiliate.marketing_channels || []).join(", ")}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}