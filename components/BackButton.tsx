"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.back()} 
      className="flex items-center gap-1 mb-4 text-sm font-bold text-slate-500 hover:text-pink-600 transition active:scale-95 px-2 py-1"
    >
      <span>←</span> 돌아가기
    </button>
  );
}