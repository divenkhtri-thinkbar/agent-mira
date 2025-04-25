import type { ReactNode } from "react";
import Sidebar from "../components/ui/sidebar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#FFFFFF]">
            <Sidebar />
            <main className="ml-[280px] w-full flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}