import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/inquiry
 *
 * Receives merchant application form submissions and forwards them
 * to the MGO Support system for ticket creation.
 */

interface InquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  island: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as InquiryPayload;

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "businessName", "businessType", "island"];
    for (const field of requiredFields) {
      if (!payload[field as keyof InquiryPayload]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get MGO Support webhook URL and API key from environment
    const mgoSupportUrl = process.env.MGO_SUPPORT_URL;
    const mgoApiKey = process.env.MGO_SUPPORT_API_KEY;

    if (!mgoSupportUrl || !mgoApiKey) {
      console.error("Missing MGO Support configuration");
      // Fallback: return success but log the issue
      // In production, you might want to queue this for later processing
      console.log("Merchant application received (MGO Support not configured):", payload);
      return NextResponse.json({
        success: true,
        message: "Application received",
        fallback: true,
      });
    }

    // Forward to MGO Support webhook
    const response = await fetch(`${mgoSupportUrl}/api/webhooks/merchant-application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": mgoApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("MGO Support webhook failed:", response.status, errorData);

      // Don't expose internal errors to client
      return NextResponse.json(
        { error: "Failed to submit application. Please try again later." },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      ticketId: result.ticketId,
    });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
