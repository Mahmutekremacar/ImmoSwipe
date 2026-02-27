"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
    const p = usePathname();
    const active = p === href;
    return (
        <Link className={`px-3 py-2 rounded ${active ? "bg-black text-white" : "hover:bg-gray-100"}`} href={href}>
            {label}
        </Link>
    );
}

export default function Nav({ role }: { role: "seeker" | "agent" }) {
    return (
        <nav className="flex items-center gap-2 border-b p-3">
            <Link href="/" className="font-semibold mr-4">PropertySwipe</Link>

            {role === "seeker" ? (
                <>
                    <NavLink href="/preferences" label="Preferences" />
                    <NavLink href="/feed" label="Swipe" />
                    <NavLink href="/saved" label="Saved" />
                    <NavLink href="/matches" label="Messages" />
                </>
            ) : (
                <>
                    <NavLink href="/dashboard" label="Dashboard" />
                    <NavLink href="/listings/new" label="Post Listing" />
                    <NavLink href="/leads" label="Leads" />
                    <NavLink href="/agent/matches" label="Messages" />
                </>
            )}

            <form className="ml-auto" action="/api/auth/logout" method="post">
                <button className="px-3 py-2 rounded border hover:bg-gray-50" type="submit">Logout</button>
            </form>
        </nav>
    );
}