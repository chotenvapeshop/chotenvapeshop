"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

const categories = ["전체", "기기", "일회용기기", "액상", "소모품"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");

  const pathname = usePathname();

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      return;
    }
    setProducts(data || []);
    setFiltered(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== "전체") {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [category, search, products]);

  const navItems = [
    { href: "/", label: "홈", icon: "💖" },
    { href: "/cart", label: "장바구니", icon: "💕" },
    { href: "/orders", label: "구매내역", icon: "💕" },
  ];

  return (
    <main className="w-full min-h-screen bg-slate-50 pb-32 font-sans antialiased text-slate-800 overflow-x-hidden">
      
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-2 text-center text-[16px] font-black text-white tracking-wider shadow-sm">
        💖 초텐 VAPE 신용샵! 💖
      </div>

      <Header />

      {/* 부모 컨테이너를 mx-auto와 max-w-md로 제한하여 모바일 밖으로 튀어나가는 것 방지 */}
      <div className="mx-auto max-w-[440px] px-4 pt-3">
        
        {/* 수정된 배너 영역: aspect-ratio를 사용하여 이미지 영역 강제 고정 */}
        <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl shadow-md bg-pink-100 border border-pink-200">
          <Image
            src="/main-vape.jpg" 
            alt="초텐 VAPE샵 메인 배너"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 440px) 100vw, 440px"
          />
        </div>

        <div className="mt-7 text-center">
          <h1 className="text-3xl font-black tracking-tight text-pink-600 drop-shadow-sm">
            chotenvapeshop
          </h1>
          <p className="mt-1.5 text-xs font-black text-rose-600 tracking-wide">
            신용댈구샵 초텐샵!!
          </p>
        </div>

        <div className="mt-6">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="찾는 기기나 액상이 있으면 검색해바! 💕"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-2 border-pink-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none transition-all shadow-sm focus:border-pink-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-black tracking-wide transition-all duration-200 snap-center shadow-sm ${
                  isSelected
                    ? "bg-pink-600 text-white shadow-md scale-105"
                    : "bg-white text-slate-700 border-2 border-pink-100 hover:bg-pink-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-3xl">💕</span>
              <p className="mt-3 text-sm font-black text-slate-500">현재 준비된 상품이 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((product) => (
                <div 
                  key={product.id} 
                  className="transform transition-transform active:scale-95 bg-white rounded-2xl p-1 shadow-sm border border-pink-100"
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={`${Number(product.price).toLocaleString()}원`}
                    image={product.image}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border-2 border-pink-200 bg-white px-2 py-3 shadow-xl backdrop-blur-lg">
        <div className="flex w-full items-center justify-around">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center justify-center transition-all duration-200 active:scale-95"
              >
                <div className={`relative text-lg leading-none transition-transform duration-200 ${active ? "text-pink-600 -translate-y-0.5 scale-110" : "text-slate-300"}`}>
                  {item.icon}
                </div>
                <span className={`mt-1 text-[11px] font-black tracking-wider transition-colors ${active ? "text-pink-600" : "text-slate-700"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}