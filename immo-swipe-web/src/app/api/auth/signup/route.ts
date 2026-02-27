import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/store";
import { setSession } from "@/lib/auth";
import { Role } from "@/lib/types";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const role = (body.role as Role) ?? "seeker";
    const displayName = String(body.displayName ?? "").trim();

    if (!email || !password || !displayName) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (findUserByEmail(email)) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const user = createUser({ email, password, role, displayName });
    setSession(user.id);

    return NextResponse.json({ data: { id: user.id, email: user.email, role: user.role, displayName: user.displayName } });
}