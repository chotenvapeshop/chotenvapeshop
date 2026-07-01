"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage("💕 이메일과 비밀번호를 모두 입력해주세요!");
      return;
    }

    setLoading(true);
    setMessage("");

    // 🔐 Supabase Auth 로그인 API 호출
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      setMessage("❌ 로그인 실패: 이메일이나 비밀번호를 다시 확인하세요.");
    } else {
      setMessage("💖 로그인 성공! 홈 화면으로 이동합니다.");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans antialiased text-slate-800">
      <Header />

      <div className="mx-auto max-w-md px-4 pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-black text-pink-600 tracking-tight">🎀 로그인</h1>
          <p className="mt-1.5 text-xs font-black text-slate-500">초텐 VAPE샵에 오신 것을 환영합니다 💕</p>
        </div>

        {message && (
          <div className={`mt-5 rounded-xl p-3.5 text-center text-xs font-black shadow-sm ${
            message.startsWith("💖") ? "bg-pink-100 text-pink-700" : "bg-rose-100 text-rose-700 border border-rose-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4 rounded-2xl border-2 border-pink-100 bg-white p-6 shadow-sm">
          {/* 이메일 입력 */}
          <div>
            <label className="block text-xs font-black text-pink-600 mb-1.5">이메일 주소</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-pink-100 bg-white px-4 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-xs font-black text-pink-600 mb-1.5">비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-pink-100 bg-white px-4 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3.5 text-xs font-black text-white shadow-md shadow-pink-200 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? "인증 정보 확인 중... 💕" : "✨ 로그인하기"}
          </button>
        </form>

        {/* 회원가입 유도 링크 */}
        <div className="mt-6 text-center">
          <p className="text-xs font-bold text-slate-500">
            아직 계정이 없으신가요?{" "}
            <button onClick={() => router.push("/signup")} className="text-pink-600 font-black underline underline-offset-2">
              회원가입하러 가기
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}