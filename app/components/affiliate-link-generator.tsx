"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from 'nanoid';

interface AffiliateLinkGeneratorProps {
  affiliateId: string;
  productId: string;
}

export function AffiliateLinkGenerator({ affiliateId, productId }: AffiliateLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const supabase = createClientComponentClient();

  const generateAffiliateLink = async () => {
    try {
      // Generate a unique reference ID
      const refId = nanoid(8); // 8 character unique ID

      // Store the affiliate link in the database
      const { error } = await supabase
        .from('affiliate_links')
        .insert({
          affiliate_id: affiliateId,
          product_id: productId,
          custom_ref_id: refId,
        });

      if (error) throw error;

      // Generate the full URL
      const baseUrl = window.location.origin;
      return `${baseUrl}/products/${productId}?ref=${refId}`;
    } catch (err) {
      console.error('Error generating affiliate link:', err);
      throw err;
    }
  };

  const copyToClipboard = async () => {
    try {
      const affiliateLink = await generateAffiliateLink();
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      toast.success("Affiliate link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to generate affiliate link");
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full"
        variant="outline"
        onClick={copyToClipboard}
        disabled={copied}
      >
        {copied ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Generate & Copy Affiliate Link
          </>
        )}
      </Button>
    </div>
  );
} 