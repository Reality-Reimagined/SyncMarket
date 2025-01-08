import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProductCard } from "@/app/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function ProductsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Digital Products</h1>
        <Link href="/products/create">
          <Button>Create Product</Button>
        </Link>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}