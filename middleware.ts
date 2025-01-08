import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if this is a product page with a ref parameter
  const { pathname, searchParams } = new URL(req.url);
  const refId = searchParams.get('ref');

  if (pathname.startsWith('/products/') && refId) {
    try {
      // Update click count using a raw increment
      const { error } = await supabase
        .from('affiliate_links')
        .update({ 
          clicks: supabase.rpc('increment', { row_id: refId, increment_amount: 1 }),
          last_clicked_at: new Date().toISOString()
        })
        .eq('custom_ref_id', refId);

      if (error) {
        console.error('Error updating affiliate link clicks:', error);
      }

      // Store the ref ID in a cookie for 24 hours
      const response = NextResponse.next();
      response.cookies.set('affiliate_ref', refId, { 
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/' 
      });
      return response;
    } catch (err) {
      console.error('Error in affiliate tracking middleware:', err);
    }
  }

  return res;
}

export const config = {
  matcher: '/products/:path*',
}; 