import { NextResponse } from "next/server"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; source?: string }
    | null

  const email = body?.email?.trim().toLowerCase() ?? ""
  const source = body?.source?.trim() || "unknown"

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { message: "Enter a valid email address to join the list." },
      { status: 400 },
    )
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      {
        message:
          "Newsletter intake isn’t connected yet. Add NEWSLETTER_WEBHOOK_URL to capture signups.",
      },
      { status: 503 },
    )
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: "We couldn’t save your signup right now. Please try again shortly." },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { message: "We couldn’t save your signup right now. Please try again shortly." },
      { status: 500 },
    )
  }
}
