"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. 초기 세션 및 관리자 확인
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      setIsLoggedIn(!!user);
      
      // Supabase metadata에서 is_admin 확인
      if (user?.user_metadata?.is_admin === true) {
        setIsAdmin(true);
      }
    };
    checkUser();
    
    // 2. 로그인/로그아웃 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.user_metadata?.is_admin === true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      alert("이미 성공하셨습니다! 💕");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false); 
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100 bg-white/80 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between px-4">
        
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-black tracking-tighter text-pink-500">choten</span>
          <span className="rounded bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-pink-600">VAPE</span>
        </Link>

        {/* 조건부 버튼 및 관리자 링크 */}
        <div className="flex items-center gap-3">
          {/* 관리자일 때만 노출되는 링크 */}
          {isAdmin && (
            <Link href="/admin" className="text-[11px] font-extrabold text-pink-600 hover:text-pink-800 transition-colors">
              👑 관리자
            </Link>
          )}

          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="text-[11px] font-extrabold text-slate-500 hover:text-rose-500 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                onClick={handleAuthClick} 
                className="text-[11px] font-extrabold text-gray-400 hover:text-pink-400 transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/signup" 
                onClick={handleAuthClick} 
                className="text-[11px] font-extrabold text-gray-400 hover:text-pink-400 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}