import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

const resendApiUrl = 'https://api.resend.com/emails'

type EmailOtpRequest = {
  email?: string
  redirectTo?: string
}

function createEmailHtml(emailOtp: string, actionLink: string | null) {
  const actionMarkup = actionLink
    ? `<p style="margin:24px 0 0;">
         <a href="${actionLink}" style="display:inline-block;border-radius:9999px;background:#000000;color:#ffffff;padding:12px 20px;text-decoration:none;font-weight:600;">
           Open secure sign in link
         </a>
       </p>`
    : ''

  return `
    <div style="background:#000000;padding:32px 16px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#ffffff;">
      <div style="max-width:440px;margin:0 auto;border:1px solid #1c1c1c;border-radius:28px;background:#050505;padding:32px;">
        <div style="margin-bottom:24px;font-family:'Pixelify Sans',monospace;font-size:28px;letter-spacing:0.24em;color:#555555;">
          Nap
        </div>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;color:#b8b8b8;font-weight:600;">
          Your SignIn OTP
        </h1>
        <p style="margin:0 0 24px;color:#727272;line-height:1.6;">
          Use this 6-digit code to sign in. If you did not request this, you can ignore this email.
        </p>
        <div style="border:1px solid #1f1f1f;border-radius:18px;background:#0b0b0b;padding:20px;text-align:center;">
          <div style="font-size:30px;letter-spacing:0.45em;color:#d0d0d0;font-weight:700;">
            ${emailOtp}
          </div>
          <img src="/copy.png" alt="copy btn" style="margin-top:20px;width:100%;border-radius:12px;" />
        </div>
        ${actionMarkup}
      </div>
    </div>
  `
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Napster <onboarding@resend.dev>'

  if (!resendApiKey) {
    return NextResponse.json(
      { error: 'Missing RESEND_API_KEY environment variable.' },
      { status: 500 }
    )
  }

  let body: EmailOtpRequest

  try {
    body = (await request.json()) as EmailOtpRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: body.redirectTo ? { redirectTo: body.redirectTo } : undefined,
    })

    if (error || !data?.properties?.email_otp) {
      return NextResponse.json(
        { error: error?.message || 'Failed to generate email code.' },
        { status: 500 }
      )
    }

    const resendResponse = await fetch(resendApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [email],
        subject: 'Your Napster sign-in code',
        html: createEmailHtml(data.properties.email_otp, data.properties.action_link || null),
      }),
    })

    const resendPayload = await resendResponse.json()

    if (!resendResponse.ok) {
      const resendError =
        resendPayload?.error?.message ||
        resendPayload?.message ||
        'Failed to send sign-in email.'

      return NextResponse.json({ error: resendError }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send sign-in email.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
