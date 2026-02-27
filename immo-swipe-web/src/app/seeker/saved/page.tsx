import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { listSaved } from "@/lib/store";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        return NextResponse.json({ data: listSaved(userId) });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}