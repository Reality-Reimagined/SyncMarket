"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// This will be replaced with real data from Supabase
const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Digital Marketing Course",
    price: 199.99,
    commission_rate: 30,
    total_sales: 45,
    revenue: 8999.55,
    top_affiliates: [
      { name: "John Doe", sales: 15, revenue: 2999.85 },
      { name: "Jane Smith", sales: 12, revenue: 2399.88 },
    ]
  },
  // ... more products
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Link href="/products/create">
          <Button>Create New Product</Button>
        </Link>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(45231.89)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25.5%</div>
            <p className="text-xs text-muted-foreground">Average commission rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Products</h2>
        {DEMO_PRODUCTS.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{product.name}</CardTitle>
                <div className="space-x-2">
                  <Link href={`/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit Product
                    </Button>
                  </Link>
                  <Link href={`/products/${product.id}/affiliates`}>
                    <Button variant="outline" size="sm">
                      View Affiliates
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <p>Price: {formatCurrency(product.price)}</p>
                  <p>Commission Rate: {product.commission_rate}%</p>
                  <p>Total Sales: {product.total_sales}</p>
                  <p>Total Revenue: {formatCurrency(product.revenue)}</p>
                </div>
                
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">Top Performing Affiliates</h3>
                  <div className="space-y-2">
                    {product.top_affiliates.map((affiliate, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium">{affiliate.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {affiliate.sales} sales
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(affiliate.revenue)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}