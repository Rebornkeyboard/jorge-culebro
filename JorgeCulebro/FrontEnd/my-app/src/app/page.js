"use client";
import Login from "@/app/login/page";
import { useRouter } from "next/navigation";

export default function Home() {
  //router for navigation
  const router = useRouter(); 
  const handleNavigation = () => {
    router.push("/catalog");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Login onNavigate={handleNavigation}/>
      </main>
    </div>
  );
}