import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { getPreferences, upsertPreferences } from "@/lib/store";
import { SeekerPreferences } from "@/lib/types";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        return NextResponse.json({ data: getPreferences(userId) ?? null });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        const prefs = (await req.json()) as SeekerPreferences;
        if (!prefs?.city) return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
        return NextResponse.json({ data: upsertPreferences(userId, prefs) });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}