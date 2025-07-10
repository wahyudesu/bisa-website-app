import { NextResponse } from 'next/server'

export async function GET() {
  // Assume you already have the access token available here
  const accessToken = 'YOUR_ACCESS_TOKEN_HERE'

  try {
    // Your Frontend API URL can be found on the API keys page in the Clerk Dashboard
    // https://dashboard.clerk.com/last-active?path=api-keys
    const response = await fetch(`${process.env.CLERK_FRONTEND_API_URL}/oauth/userinfo`, {
      headers: {
        // Include the access token as a Bearer token in the Authorization header
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch user info', details: (error as Error).message },
      { status: 500 },
    )
  }
}