"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AffiliateLinkGenerator } from "./affiliate-link-generator";
import { useAuth } from "@/lib/auth";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    commission_rate: number;
    image_url: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);

  return (
    <Card>
      <CardHeader>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <CardTitle className="mt-4">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="mt-4">
          <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
          <p className="text-sm text-muted-foreground">
            {product.commission_rate}% commission
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/products/${product.id}`} className="flex-1">
          <Button className="w-full">View Details</Button>
        </Link>
        {user && (
          <Dialog open={showLinkGenerator} onOpenChange={setShowLinkGenerator}>
            <DialogTrigger asChild>
              <Button variant="outline">Get Affiliate Link</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Affiliate Link</DialogTitle>
              </DialogHeader>
              <AffiliateLinkGenerator 
                affiliateId={user.id} 
                productUrl={`${window.location.origin}/products/${product.id}`}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
} 