"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton"; 

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase.from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-pink-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
          <h2 className="text-2xl font-black text-pink-600">🎀 나의 구매 내역</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-pink-200 rounded-3xl bg-white shadow-sm">
            <p className="font-semibold text-pink-400">주문 내역이 아직 없어요! 🎀</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100">
                {/* 헤더: 날짜/시간과 상태 (날짜 시간 추가 완료) */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(order.created_at).toLocaleString('ko-KR', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-black">
                    {order.status || '결제대기중'}
                  </span>
                </div>

                {/* 주문 상품 리스트 */}
                <div className="space-y-2 mb-4">
                  {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">옵션: {item.option}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">{item.quantity}개</p>
                    </div>
                  ))}
                </div>

                {/* 총액 */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">총 결제 금액</span>
                  <span className="font-black text-lg text-slate-900">{order.total_price.toLocaleString()}원</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}