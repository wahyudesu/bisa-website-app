import { NextRequest, NextResponse } from 'next/server'

// Assume you already have the access token and refresh token available here
const tokens = {
  accessToken: 'YOUR_ACCESS_TOKEN_HERE',
  refreshToken: 'YOUR_REFRESH_TOKEN_HERE',
}

export async function POST(req: NextRequest) {
  try {
    // Your Frontend API URL can be found on the API keys page in the Clerk Dashboard
    // https://dashboard.clerk.com/last-active?path=api-keys
    const response = await fetch(`${process.env.CLERK_FRONTEND_API_URL}/oauth/token_info`, {
      method: 'POST',
      headers: {
        // Include the access token as a Bearer token in the Authorization header
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        // Include the refresh token in the body
        token: tokens.refreshToken,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch token info' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}