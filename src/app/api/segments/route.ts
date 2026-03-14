import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client lazily
let supabase: ReturnType<typeof createClient> | null = null;

// Rate limiting: track IP and request count
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per minute

function getSupabaseClient() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  if (!limitData || now > limitData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limitData.count >= RATE_LIMIT_MAX) {
    return false;
  }

  limitData.count++;
  return true;
}

function validateSegments(segments: unknown): segments is Array<{
  id: string;
  timestamp: string;
  title: string;
  [key: string]: unknown;
}> {
  if (!Array.isArray(segments)) return false;

  return segments.every((seg) => {
    return (
      typeof seg === "object" &&
      seg !== null &&
      typeof seg.id === "string" &&
      typeof seg.timestamp === "string" &&
      typeof seg.title === "string" &&
      seg.id.length <= 50 &&
      seg.timestamp.length <= 50 &&
      seg.title.length <= 500
    );
  });
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const client = getSupabaseClient();

  if (!client) {
    return NextResponse.json(
      {
        error:
          "Database not configured. Please set Supabase environment variables.",
      },
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validate ID parameter
    if (id && (typeof id !== "string" || id.length > 50)) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 },
      );
    }

    if (id) {
      // Get a single segment collection
      const { data, error } = await client
        .from("segment_collections")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "Segment collection not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(data);
    } else {
      // Get all segment collections (with limit)
      const { data, error } = await client
        .from("segment_collections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const client = getSupabaseClient();

  if (!client) {
    return NextResponse.json(
      {
        error:
          "Database not configured. Please set Supabase environment variables.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { id, segments, name } = body;

    // Validate input
    if (!validateSegments(segments)) {
      return NextResponse.json(
        { error: "Invalid segments data format" },
        { status: 400 },
      );
    }

    if (name && (typeof name !== "string" || name.length > 500)) {
      return NextResponse.json(
        { error: "Invalid name parameter" },
        { status: 400 },
      );
    }

    if (id && (typeof id !== "string" || id.length > 50)) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 },
      );
    }

    // Check payload size (max 1MB)
    const payloadSize = JSON.stringify(body).length;
    if (payloadSize > 1024 * 1024) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const collectionId = id || `collection_${Date.now()}`;

    const { data, error } = await client
      .from("segment_collections")
      .upsert(
        {
          id: collectionId,
          name: name || "Timeline",
          segments: segments,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ...(data as any) });
  } catch (error) {
    console.error("POST /api/segments error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const client = getSupabaseClient();

  if (!client) {
    return NextResponse.json(
      {
        error:
          "Database not configured. Please set Supabase environment variables.",
      },
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 },
      );
    }

    // Validate ID
    if (typeof id !== "string" || id.length > 50) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 },
      );
    }

    const { error } = await client
      .from("segment_collections")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
