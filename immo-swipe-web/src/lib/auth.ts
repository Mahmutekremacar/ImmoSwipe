import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "./store";

const COOKIE = "mvp_session_user_id";

export function setSession(userId: string) {
    cookies().set(COOKIE, userId, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function clearSession() {
    cookies().delete(COOKIE);
}

export function getSessionUserId() {
    return cookies().get(COOKIE)?.value ?? null;
}

export function requireUserId(req: NextRequest): string {
    const userId = req.cookies.get(COOKIE)?.value;
    if (!userId) throw new Error("UNAUTHORIZED");
    return userId;
}

export function getSessionUser() {
    const userId = getSessionUserId();
    if (!userId) return null;
    return db.users.find(u => u.id === userId) ?? null;
}