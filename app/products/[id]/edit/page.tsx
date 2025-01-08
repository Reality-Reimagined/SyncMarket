"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ProductForm } from "@/components/product-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        toast.error("Failed to load product");
        router.push('/dashboard');
        return;
      }

      // Transform the data to match the form schema
      const transformedData = {
        name: data.title,
        description: data.description,
        image_url: data.image_url,
        isSaas: data.is_subscription,
        download_url: data.download_url,
        pricingType: data.additional_prices ? "hybrid" : (data.is_subscription ? "subscription" : "one_time"),
        commission: {
          oneTime: data.commission_rate.toString(),
          recurring: data.recurring_commission_rate?.toString(),
        },
        // Add other fields as needed
      };

      setProduct(transformedData);
      setLoading(false);
    }

    loadProduct();
  }, [params.id, router, supabase]);

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm 
            initialData={product} 
            onSubmit={async (values) => {
              try {
                // Transform form values back to database schema
                const updateData = {
                  title: values.name,
                  description: values.description,
                  image_url: values.image_url,
                  is_subscription: values.isSaas,
                  download_url: values.download_url,
                  commission_rate: parseFloat(values.commission.oneTime),
                  recurring_commission_rate: values.commission.recurring 
                    ? parseFloat(values.commission.recurring)
                    : null,
                  // Add other fields as needed
                };

                const { error } = await supabase
                  .from('products')
                  .update(updateData)
                  .eq('id', params.id);

                if (error) throw error;

                toast.success("Product updated successfully");
                router.push('/dashboard');
              } catch (error) {
                console.error('Error updating product:', error);
                toast.error("Failed to update product");
              }
            }} 
          />
        </CardContent>
      </Card>
    </div>
  );
} 