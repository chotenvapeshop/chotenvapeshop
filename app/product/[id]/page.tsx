"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton"; // 뒤로가기 버튼 추가

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  async function loadProduct() {
    if (!id) return;
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) { router.push("/"); return; }
    setProduct(data);
    if (data?.colors?.length > 0) setSelectedColor(data.colors[0]);
    setLoading(false);
  }

  useEffect(() => { loadProduct(); }, [id]);

  async function handleAddToCart() {
    if (!product) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("로그인이 필요해요! 💖"); return; }

    const { error } = await supabase.from("carts").insert([
      { 
        user_id: user.id, 
        name: product.name, 
        option: selectedColor || "기본", 
        price: product.price * quantity, 
        quantity: quantity 
      }
    ]);

    if (error) alert("저장에 실패했어요. 🥺");
    else alert("장바구니에 예쁘게 담겼어요! ✨");
  }

  if (loading) return <div className="p-10 text-center font-black text-pink-500">로딩 중... 💕</div>;
  if (!product) return null;

  return (
    <main className="min-h-screen bg-slate-50 pb-40 text-slate-900">
      <Header />
      <div className="mx-auto max-w-md px-4 pt-6">
        {/* 여기서부터 뒤로가기 버튼 적용 */}
        <BackButton />
        
        <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-black">{product.name}</h1>
          <p className="mt-2 text-2xl font-black text-pink-600">{Number(product.price * quantity).toLocaleString()}원</p>
        </div>

        {product.colors && (
          <div className="mt-8">
            <label className="text-sm font-black text-slate-500 mb-3 block">🎀 옵션 선택</label>
            <div className="flex gap-2">
              {product.colors.map((c: string) => (
                <button key={c} onClick={() => setSelectedColor(c)} 
                  className={`px-5 py-3 rounded-2xl font-black text-sm transition-all ${selectedColor === c ? "bg-pink-500 text-white shadow-lg" : "bg-white border border-slate-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-sm font-black text-slate-500 mb-3 block">🎀 상품 상세 정보</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
            {product.description}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50">
        <div className="mx-auto max-w-md flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 font-black text-slate-600">-</button>
            <span className="w-10 text-center font-black">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 font-black text-slate-600">+</button>
          </div>
          <button onClick={handleAddToCart} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-200">
            장바구니 담기 🎀
          </button>
        </div>
      </div>
    </main>
  );
}