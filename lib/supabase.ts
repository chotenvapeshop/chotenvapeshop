import { createClient } from '@supabase/supabase-js';

// 환경 변수가 제대로 있는지 체크 (없으면 에러를 띄워 알려줌)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase 환경 변수가 설정되지 않았습니다! .env.local을 확인하세요.");
}

// 클라이언트 생성 (싱글톤 패턴으로 어디서든 가져다 쓰기 편하게)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 모바일/브라우저 세션 유지 필수!
    autoRefreshToken: true,
  },
});