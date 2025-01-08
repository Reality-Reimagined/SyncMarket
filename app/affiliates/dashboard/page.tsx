"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { AffiliateLinkGenerator } from "@/app/components/affiliate-link-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { date: "2024-01-01", earnings: 1200 },
  { date: "2024-01-02", earnings: 1800 },
  { date: "2024-01-03", earnings: 1400 },
  { date: "2024-01-04", earnings: 2200 },
  { date: "2024-01-05", earnings: 1900 },
  { date: "2024-01-06", earnings: 2400 },
  { date: "2024-01-07", earnings: 2100 },
];

// Mock data for commission tracking
const commissionData = [
  { date: "2024-01-01", earnings: 1200, clicks: 450, conversions: 15 },
  { date: "2024-01-02", earnings: 1800, clicks: 680, conversions: 22 },
  { date: "2024-01-03", earnings: 1400, clicks: 520, conversions: 18 },
  { date: "2024-01-04", earnings: 2200, clicks: 790, conversions: 25 },
  { date: "2024-01-05", earnings: 1900, clicks: 600, conversions: 20 },
  { date: "2024-01-06", earnings: 2400, clicks: 850, conversions: 28 },
  { date: "2024-01-07", earnings: 2100, clicks: 720, conversions: 24 },
];

// Mock data for product performance
const productPerformance = [
  { 
    productName: "Digital Marketing Course",
    sales: 45,
    commission: 1350,
    conversionRate: "3.2%"
  },
  { 
    productName: "SEO Masterclass",
    sales: 38,
    commission: 950,
    conversionRate: "2.8%"
  },
  { 
    productName: "Social Media Strategy Guide",
    sales: 52,
    commission: 1560,
    conversionRate: "3.5%"
  },
];

export default function AffiliateDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(13450.89)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.8%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2024-01-07", amount: 850.00, status: "Completed" },
                { date: "2024-01-01", amount: 720.50, status: "Completed" },
                { date: "2023-12-24", amount: 945.20, status: "Completed" },
              ].map((payout, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payout.date}</p>
                    <p className="text-sm text-muted-foreground">{payout.status}</p>
                  </div>
                  <p className="font-bold">{formatCurrency(payout.amount)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent>
            <AffiliateLinkGenerator affiliateId="mock-affiliate-id" />
          </CardContent>
        </Card>
      </div> */}

      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Performance Overview</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Commission Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={commissionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        yAxisId="left"
                        width={60}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value: number) => `$${value}`}
                        domain={['auto', 'auto']}
                        padding={{ top: 20, bottom: 20 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        width={60}
                        tick={{ fontSize: 12 }}
                        domain={['auto', 'auto']}
                        padding={{ top: 20, bottom: 20 }}
                      />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="hsl(var(--primary))" 
                        name="Earnings ($)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="hsl(var(--secondary))" 
                        name="Clicks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase">
                      <tr>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">Sales</th>
                        <th className="px-6 py-3">Commission</th>
                        <th className="px-6 py-3">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPerformance.map((product, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-6 py-4">{product.productName}</td>
                          <td className="px-6 py-4">{product.sales}</td>
                          <td className="px-6 py-4">{formatCurrency(product.commission)}</td>
                          <td className="px-6 py-4">{product.conversionRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}