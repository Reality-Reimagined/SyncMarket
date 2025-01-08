"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Users, Rocket, Zap, Shield, DollarSign } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigation = (destination: string) => {
    if (user) {
      router.push(destination);
    } else {
      router.push(`/signup?redirect=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary font-semibold mb-6"
          >
            Introducing SyncMarket
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Where Digital Products Meet Their 
            <span className="text-primary"> Perfect Promoters</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Connect passionate creators with motivated affiliates. Launch your digital product 
            or start earning commissions promoting products you believe in.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg" 
              className="h-12 px-8"
              onClick={() => handleNavigation('/products/create')}
            >
              Start Selling
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8"
              onClick={() => handleNavigation('/affiliates/join')}
            >
              Become an Affiliate
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Value Proposition Cards */}
        <motion.div 
          className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="bg-card p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Launch Fast</h3>
            <p className="text-muted-foreground">
              Set up your digital product in minutes with our streamlined platform
            </p>
          </motion.div>
          <motion.div variants={item} className="bg-card p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Flexible Commissions</h3>
            <p className="text-muted-foreground">
              Set custom commission rates and reward your top performers
            </p>
          </motion.div>
          <motion.div variants={item} className="bg-card p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Secure Payments</h3>
            <p className="text-muted-foreground">
              Automated payments and commission tracking you can trust
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Updated Features Section with Connection Animation */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Connecting Both Sides of the Marketplace</h2>
            <p className="text-xl text-muted-foreground">
              A seamless platform for creators and promoters
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Creators Column */}
            <motion.div variants={item} className="space-y-6">
              <h3 className="text-2xl font-semibold">Creators</h3>
              <ul className="space-y-4">
                {[
                  "Easy product listing creation",
                  "Customizable commission structures",
                  "Affiliate performance tracking",
                  "Automated commission payouts",
                  "Product analytics dashboard"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Connection Animation Column */}
            <motion.div 
              variants={item} 
              className="flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-ping" />
                <div className="relative">
                  <svg
                    className="w-24 h-24 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      d="M8 12h8m-4-4v8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Affiliates Column */}
            <motion.div variants={item} className="space-y-6">
              <h3 className="text-2xl font-semibold">Affiliates</h3>
              <ul className="space-y-4">
                {[
                  "Browse quality digital products",
                  "Real-time commission tracking",
                  "Instant affiliate link generation",
                  "Performance analytics",
                  "Weekly/monthly payouts"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section - update the text to match new branding */}
      <section className="py-20 px-4 bg-primary/5">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Join SyncMarket Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your journey in the digital product marketplace
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="h-12 px-8"
              onClick={() => handleNavigation('/signup')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-8"
              onClick={() => handleNavigation('/products')}
            >
              Browse Products
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}