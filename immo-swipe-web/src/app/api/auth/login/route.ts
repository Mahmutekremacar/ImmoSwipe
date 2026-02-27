import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/store";
import { setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    setSession(user.id);
    return NextResponse.json({ data: { id: user.id, role: user.role, displayName: user.displayName } });
}