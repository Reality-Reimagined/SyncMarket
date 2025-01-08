# Digital Marketplace Platform

A modern digital marketplace platform similar to ClickBank, built with Next.js 14, Shadcn/UI, Stripe Connect, and Supabase. This platform enables vendors to sell digital products while allowing affiliate marketers to earn commissions.

## 🚀 Features

- **User Management**
  - Secure authentication via Supabase Auth
  - User roles (vendor, affiliate, or both)
  - Profile management

- **Vendor Features**
  - Product listing creation and management
  - Custom commission rate setting
  - Sales analytics and reporting
  - Flexible payout schedule configuration

- **Affiliate System**
  - Affiliate registration and management
  - Unique affiliate link generation
  - Commission tracking
  - Performance analytics dashboard
  - Customizable payout schedules (weekly, bi-weekly, monthly)

- **Payment Processing**
  - Secure payments via Stripe Connect
  - Automated affiliate payouts
  - Real-time payment tracking
  - Webhook integration for payment events

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **UI Components:** Shadcn/UI
- **Authentication & Database:** Supabase
- **Payment Processing:** Stripe Connect
- **Styling:** Tailwind CSS

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Stripe account with Connect enabled

## 🚀 Getting Started

1. Clone the repository:

env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret