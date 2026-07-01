"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Supabase 정석 가입 방식
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ 오류: ${error.message}`);
    } else {
      // 대시보드에서 Confirm email을 껐으므로 즉시 가입 완료
      setMessage("💖 가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.");
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans antialiased text-slate-800">
      <Header />
      <div className="mx-auto max-w-md px-4 pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-black text-pink-600 tracking-tight">🎀 회원가입</h1>
        </div>

        {message && (
          <div className="mt-6 p-3.5 text-center text-xs font-black rounded-xl bg-pink-100 text-pink-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-6 space-y-4 rounded-2xl border-2 border-pink-100 bg-white p-6 shadow-sm">
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl outline-none focus:border-pink-500" required />
          <input type="password" placeholder="비밀번호 (6자리 이상)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl outline-none focus:border-pink-500" required />
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-xl transition-all active:scale-95">
            {loading ? "처리 중..." : "✨ 초텐샵 가입하기"}
          </button>
        </form>
      </div>
    </main>
  );
}