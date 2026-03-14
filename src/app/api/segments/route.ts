import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client lazily
let supabase: ReturnType<typeof createClient> | null = null;

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

export async function GET(request: NextRequest) {
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

    if (!segments || !Array.isArray(segments)) {
      return NextResponse.json(
        { error: "Invalid segments data" },
        { status: 400 },
      );
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ...(data as any) });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
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
