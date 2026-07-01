"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link"; 
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // 보안 체크 중일 때 사용할 로딩 상태
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [colors, setColors] = useState(""); 
  const [category, setCategory] = useState("일회용");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // 1. 관리자 권한 강력 방어 (보안 로직)
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      // 관리자가 아니거나 로그인이 안 되어 있다면 홈으로 튕겨냄
      if (!user || user.user_metadata?.is_admin !== true) {
        alert("관리자만 접근 가능합니다!");
        router.push("/");
      } else {
        setLoading(false); // 관리자 확인 완료, 화면 표시
        loadData();
      }
    };
    checkAdmin();
  }, []);

  async function loadData() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  // 보안 체크 중일 때 보여줄 화면
  if (loading) return <main className="flex h-screen items-center justify-center font-black">권한 확인 중...</main>;

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = async () => {
    if (!name || !price || !file) return alert("상품명, 가격, 사진은 필수입니다!");
    
    const filePath = `products/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) return alert("사진 업로드 실패: " + uploadError.message);
    
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    const colorArray = colors.split(',').map(c => c.trim());
    
    const { error } = await supabase.from('products').insert({
      name, price: Number(price), description: desc, colors: colorArray, image: publicUrl, category
    });
    
    if (error) alert("등록 실패: " + error.message);
    else {
      alert("상품 등록 완료!");
      setName(""); setPrice(""); setDesc(""); setColors(""); setFile(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status: status }).eq('id', id);
    if (error) alert("변경 실패: " + error.message);
    else await loadData();
  };

  return (
    <main className="max-w-md mx-auto p-5 bg-slate-50 min-h-screen text-slate-900 font-sans">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-sm font-bold text-slate-400 hover:text-pink-600 transition">
          ⬅️ 메인으로 가기
        </Link>
        <h1 className="text-xl font-black text-pink-600">👑 관리자 시스템</h1>
      </div>

      <section className="bg-white p-6 rounded-3xl mb-8 shadow-sm border border-pink-100">
        <h2 className="font-black mb-4">🍎 새 상품 등록</h2>
        <input placeholder="상품 이름" onChange={(e) => setName(e.target.value)} value={name} className="w-full p-3 mb-2 rounded-xl bg-slate-100 font-bold" />
        <input placeholder="가격" type="number" onChange={(e) => setPrice(e.target.value)} value={price} className="w-full p-3 mb-2 rounded-xl bg-slate-100 font-bold" />
        
        <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full p-3 mb-2 rounded-xl bg-slate-100 font-bold">
          <option value="일회용">일회용</option>
          <option value="기기">기기</option>
          <option value="액상">액상</option>
          <option value="소모품">소모품</option>
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full p-2 mb-2 text-sm" />
        <input placeholder="옵션(콤마구분)" onChange={(e) => setColors(e.target.value)} value={colors} className="w-full p-3 mb-2 rounded-xl bg-slate-100 font-bold" />
        <textarea placeholder="상품 설명" onChange={(e) => setDesc(e.target.value)} value={desc} className="w-full p-3 mb-4 rounded-xl bg-slate-100 font-bold" />
        <button onClick={addProduct} className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl">상품 등록하기</button>
      </section>

      <section className="mb-8">
        <Link href="/admin/products" className="block w-full py-4 bg-slate-800 text-white font-black rounded-2xl text-center">
          상품 수정 및 삭제하기 ➡️
        </Link>
      </section>

      <section>
        <div className="mb-6">
          <input placeholder="🔍 주문자 이름 검색..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-4 rounded-2xl bg-white border-2 border-slate-200 font-bold shadow-sm" />
        </div>
        
        <h2 className="font-black mb-4 text-slate-700">📦 주문 현황 ({filteredOrders.length}건)</h2>
        {filteredOrders.map((o) => (
          <div key={o.id} className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-black text-lg">{o.customer_name}</span>
              <span className="text-[10px] text-slate-400 font-bold">
                {new Date(o.created_at).toLocaleString('ko-KR', { 
                  month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-slate-500">{o.phone} | {o.address}</p>
              <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-black">{o.status || '결제대기중'}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl mb-4">
              <p className="font-black text-[11px] text-slate-400 mb-1">🛒 주문한 상품</p>
              {Array.isArray(o.items) && o.items.map((item: any, idx: number) => (
                <p key={idx} className="text-xs font-bold text-slate-700">
                  • {item.name} ({item.option}) x {item.quantity}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {['입금확인', '배송준비', '배송중', '배송완료'].map((s) => (
                <button key={s} onClick={() => updateStatus(o.id, s)} 
                  className={`py-3 rounded-xl text-[11px] font-black transition ${o.status === s ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {s}
                </button>
              ))}
            </div>

            <button 
              onClick={() => updateStatus(o.id, '취소됨')}
              className="w-full py-2 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-100 transition"
            >
              주문 취소하기
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}