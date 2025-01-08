"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Store, Users, BarChart2, LogIn, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8" />
            <span className="font-bold">SyncMarket</span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/products">
            <Button variant="ghost" className={pathname === "/products" ? "bg-accent" : ""}>
              Products
            </Button>
          </Link>
          
          {user ? (
            <>
              <Link href="/affiliates">
                <Button variant="ghost" className={pathname === "/affiliates" ? "bg-accent" : ""}>
                  <Users className="mr-2 h-4 w-4" />
                  Affiliates
                </Button>
              </Link>
              <Link href="/affiliates/dashboard">
                <Button variant="ghost" className={pathname.startsWith("/affiliates/dashboard") ? "bg-accent" : ""}>
                  <Users className="mr-2 h-4 w-4" />
                  Affiliate Dashboard
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className={pathname === "/dashboard" ? "bg-accent" : ""}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <ThemeToggle />
              <Button onClick={() => signOut()} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/login">
                <Button>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}