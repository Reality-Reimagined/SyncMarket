"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Share2, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

// Import the demo products
// This will be replaced with real data from Supabase
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "Digital Marketing Course",
    description: "Complete guide to digital marketing with practical examples and case studies. Learn SEO, social media marketing, email marketing, and more.",
    price: 199.99,
    commission_rate: 30,
    image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
    features: [
      "12 hours of video content",
      "Downloadable resources",
      "Certificate of completion",
      "Lifetime access",
    ],
    category: "marketing",
    is_saas: false,
    demo_url: "https://demo.digitalmarketingcourse.com",
    refund_policy: "30-day",
    support_email: "support@digitalmarketingcourse.com",
    requirements: [],
    status: "active"
  },
  {
    id: "demo-2",
    name: "SEO Mastery",
    description: "Advanced SEO techniques and strategies for modern web. Learn technical SEO, content optimization, link building, and search analytics.",
    price: 149.99,
    commission_rate: 25,
    image_url: "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=800&auto=format&fit=crop&q=60",
    features: [
      "8 hours of video content",
      "SEO tools and templates",
      "Real-world case studies",
      "Monthly updates",
      "Expert community access"
    ],
    category: "marketing",
    is_saas: false,
    demo_url: "https://demo.seomastery.com",
    refund_policy: "14-day",
    support_email: "support@seomastery.com",
    requirements: [],
    status: "active"
  }
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const affiliateLink = `${window.location.origin}/products/${params.id}?ref=YOUR_ID`;

  useEffect(() => {
    async function loadProduct() {
      // First check if it's a demo product
      const demoProduct = DEMO_PRODUCTS.find(p => p.id === params.id);
      if (demoProduct) {
        setProduct(demoProduct);
        setLoading(false);
        return;
      }

      // If not a demo product, fetch from Supabase
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id, supabase]);

  const handlePurchase = async () => {
    setIsLoading(true);
    // Stripe checkout implementation will go here
    setIsLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto py-10">Product not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
            <p className="text-muted-foreground mt-2">
              Earn up to {formatCurrency(product.price * (product.commission_rate / 100))} per sale
            </p>
          </div>

          <p className="text-lg">{product.description}</p>

          <Card>
            <CardHeader>
              <CardTitle>What&apos;s Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Additional product details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="capitalize">{product.category}</p>
                </div>
                {product.demo_url && (
                  <div>
                    <h3 className="font-semibold">Demo</h3>
                    <a 
                      href={product.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Try Demo
                    </a>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">Refund Policy</h3>
                  <p>{product.refund_policy} money back guarantee</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handlePurchase}
              disabled={isLoading}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Affiliate Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Share this link to earn {product.commission_rate}% commission on each sale
                  </p>
                  <Input
                    value={affiliateLink}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(affiliateLink);
                      toast.success("Affiliate link copied to clipboard!");
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}