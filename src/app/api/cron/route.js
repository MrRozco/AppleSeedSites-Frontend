import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  if (!STRAPI_URL) {
    return NextResponse.json({ message: 'STRAPI_URL not defined' }, { status: 500 });
  }

  try {
    console.log(`Pinging Strapi at ${STRAPI_URL}...`);
    // Fetch a lightweight endpoint to wake up the server
    // Using a simple query to ensure it hits the database/server logic
    const response = await fetch(`${STRAPI_URL}/api/homepage`, {
        cache: 'no-store' 
    });
    
    const data = await response.json();

    return NextResponse.json({ 
        message: 'Strapi ping successful', 
        status: response.status,
        timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ message: 'Error pinging Strapi', error: error.message }, { status: 500 });
  }
}
