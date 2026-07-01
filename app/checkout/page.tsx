"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isConvenience, setIsConvenience] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    async function fetchCart() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('carts').select('*').eq('user_id', user.id);
      if (data) setItems(data);
    }
    fetchCart();
  }, []);

  const totalPrice = items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  const handleOrder = async () => {
    if (!name || !address || !phone) return alert("필수 정보를 모두 입력해주세요! 🎀");
    if (!agreed) return alert("교환/환불 불가 약관에 동의해주세요! 🎀");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("로그인이 필요합니다.");

    // DB에 주문 정보 저장
    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      items: items, // 장바구니 상품들
      total_price: totalPrice,
      status: '결제 대기 중',
      customer_name: name,
      address: address,
      phone: phone,
      is_convenience: isConvenience
    });

    if (error) {
      console.error(error);
      return alert("주문 저장에 실패했습니다. 다시 시도해주세요!");
    }

    // 주문 성공 후 장바구니 비우기 (선택 사항)
    await supabase.from('carts').delete().eq('user_id', user.id);

    alert("결제 요청이 완료되었습니다! ✨");
    router.push("/order-complete");
  };

  return (
    <main className="min-h-screen bg-pink-50 p-6 text-slate-800">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-black text-pink-600 mb-8 tracking-tight">🎀 결제하기</h2>
        
        <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
          <input type="text" placeholder="받으실 분 성함" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 rounded-2xl bg-pink-50 border-none font-bold placeholder:text-pink-300 focus:ring-2 focus:ring-pink-300" />
          <input type="text" placeholder="상세 주소" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-4 rounded-2xl bg-pink-50 border-none font-bold placeholder:text-pink-300 focus:ring-2 focus:ring-pink-300" />
          <input type="tel" placeholder="연락처 (010-0000-0000)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 rounded-2xl bg-pink-50 border-none font-bold placeholder:text-pink-300 focus:ring-2 focus:ring-pink-300" />
          
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-pink-50 rounded-xl transition">
              <input type="checkbox" checked={isConvenience} onChange={(e) => setIsConvenience(e.target.checked)} className="w-5 h-5 accent-pink-500" />
              <span className="font-bold text-pink-700">편의점 택배로 받기(2000원 추가로 보내줘야해!) (GS25/CU)</span>
            </label>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-3xl border border-pink-100 flex justify-between items-center shadow-sm">
          <span className="font-black text-slate-500">최종 결제 금액</span>
          <span className="text-2xl font-black text-pink-600">{totalPrice.toLocaleString()}원</span>
        </div>

        <div className="mt-6 flex items-center gap-3 pl-2">
          <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-6 h-6 accent-pink-500 rounded-full" />
          <label htmlFor="agree" className="text-xs font-black text-pink-500 underline decoration-pink-300 underline-offset-4">
            교환,환불,반품은 아쉽게도 불가능해!
          </label>
        </div>

        <button 
          onClick={handleOrder}
          className="w-full mt-8 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-pink-200 hover:scale-[1.01] transition-all"
        >
          결제 요청하기 💖
        </button>
      </div>
    </main>
  );
}