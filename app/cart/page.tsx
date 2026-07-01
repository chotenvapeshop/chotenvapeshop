"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton"; 

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('carts').select('*').eq('user_id', user.id);
    if (data) setItems(data);
  };

  const updateQuantity = async (id: number, delta: number, currentQuantity: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    await supabase.from('carts').update({ quantity: newQuantity }).eq('id', id);
    fetchCart();
  };

  const removeItem = async (id: number) => {
    await supabase.from('carts').delete().eq('id', id);
    fetchCart();
  };

  const totalPrice = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <main className="min-h-screen bg-pink-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-pink-500"><BackButton /></div>
        <h1 className="text-3xl font-extrabold text-pink-900 mb-8 tracking-tighter">장바구니 🎀</h1>

        {items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-pink-200 rounded-3xl bg-white shadow-inner">
            <p className="font-semibold text-pink-400">담으신 상품이 없어요! 💖</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-pink-950 text-lg">{item.name}</p>
                    <p className="text-sm font-medium text-pink-400 mt-1">{item.option}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-pink-300 hover:text-red-400 font-bold text-xl">×</button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-pink-50 border border-pink-100 rounded-2xl p-1 shadow-inner">
                    <button onClick={() => updateQuantity(item.id, -1, item.quantity)} className="w-9 h-9 font-bold text-pink-600 hover:bg-pink-100 rounded-xl">-</button>
                    <span className="w-10 text-center font-extrabold text-pink-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1, item.quantity)} className="w-9 h-9 font-bold text-pink-600 hover:bg-pink-100 rounded-xl">+</button>
                  </div>
                  <p className="font-extrabold text-pink-600 text-lg">{(Number(item.price) * item.quantity).toLocaleString()}원</p>
                </div>
              </div>
            ))}
            
            <div className="pt-6 border-t-2 border-dashed border-pink-200">
              <div className="flex justify-between items-center mb-8">
                <span className="font-semibold text-pink-500">총 주문 금액</span>
                <span className="text-3xl font-extrabold text-pink-900 tracking-tight">{totalPrice.toLocaleString()}원</span>
              </div>

              <button 
                onClick={() => router.push("/checkout")}
                className="w-full py-5 bg-pink-500 text-white font-bold text-lg rounded-3xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all active:scale-[0.98]"
              >
                주문하기 ({totalPrice.toLocaleString()}원) 🎀
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}