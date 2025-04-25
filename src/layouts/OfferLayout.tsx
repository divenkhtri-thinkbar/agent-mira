import type { ReactNode } from "react";
import Sidebar from "../components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
  address?: string;
  selectedCardId?: number | null;
  handleCardSelect?: (id: number) => void;
}

export default function Layout({ children, address, selectedCardId, handleCardSelect }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      <Sidebar
        address={address}
        selectedCardId={selectedCardId ?? null}
        handleCardSelect={handleCardSelect ?? (() => {})}
      />
      <main className="ml-[280px] w-full flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}