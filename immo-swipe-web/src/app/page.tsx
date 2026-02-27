import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default function Home() {
    const user = getSessionUser();
    if (!user) redirect("/login");
    if (user.role === "seeker") redirect("/feed");
    redirect("/dashboard");
}