import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { feedForUser, getPreferences } from "@/lib/store";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        const prefs = getPreferences(userId);
        const items = feedForUser(userId, prefs);
        return NextResponse.json({ data: items });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}