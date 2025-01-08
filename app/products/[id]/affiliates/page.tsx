"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function ProductAffiliatesPage({ params }: { params: { id: string } }) {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadData() {
      // Load product details
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (productData) {
        setProduct(productData);

        // Load affiliates for this product
        const { data: affiliatesData } = await supabase
          .from('affiliate_sales')
          .select(`
            *,
            affiliates (
              name,
              email
            )
          `)
          .eq('product_id', params.id);

        if (affiliatesData) {
          setAffiliates(affiliatesData);
        }
      }
    }

    loadData();
  }, [params.id, supabase]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{product?.title} - Affiliates</h1>
          <p className="text-muted-foreground">
            Manage affiliates and track their performance
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {affiliates.map((affiliate) => (
          <Card key={affiliate.id}>
            <CardHeader>
              <CardTitle>{affiliate.affiliates.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{affiliate.total_sales}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission Earned</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(affiliate.total_commission)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {((affiliate.total_sales / affiliate.total_clicks) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 