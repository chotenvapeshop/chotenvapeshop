"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/BackButton";

function ProductItem({ product, onUpdate, onDelete }: { product: any, onUpdate: any, onDelete: any }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [desc, setDesc] = useState(product.description);
  const [colors, setColors] = useState(product.colors?.join(', ') || "");
  const [file, setFile] = useState<File | null>(null);

  const handleUpdate = async () => {
    let publicUrl = product.image;
    if (file) {
      const filePath = `products/${Date.now()}_${file.name}`;
      await supabase.storage.from('images').upload(filePath, file);
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      publicUrl = data.publicUrl;
    }
    onUpdate(product.id, { name, price: Number(price), description: desc, colors: colors.split(',').map((c: string) => c.trim()), image: publicUrl });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
      <img src={product.image} alt="상품" className="w-full h-40 object-cover rounded-2xl mb-4" />
      
      <label className="text-[10px] font-black text-slate-400 uppercase">상품명</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full font-bold text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-200" />
      
      <label className="text-[10px] font-black text-slate-400 uppercase">가격</label>
      <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full font-bold text-pink-600 p-3 bg-slate-50 rounded-xl border border-slate-200" />
      
      <label className="text-[10px] font-black text-slate-400 uppercase">상세 설명</label>
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full text-sm text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200" />
      
      <label className="text-[10px] font-black text-slate-400 uppercase">이미지 변경</label>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-slate-600" />

      <div className="flex gap-2 pt-2">
        <button onClick={handleUpdate} className="flex-1 py-4 bg-pink-500 text-white font-black rounded-2xl">수정 저장</button>
        <button onClick={() => onDelete(product.id)} className="px-6 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl">삭제</button>
      </div>
    </div>
  );
}

export default function EditProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    supabase.from('products').select('*').order('id', { ascending: true }).then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  const handleUpdate = async (id: string, updatedData: any) => {
    const { error } = await supabase.from('products').update(updatedData).eq('id', id);
    if (!error) { alert("수정 성공!"); location.reload(); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제할까요?")) {
      await supabase.from('products').delete().eq('id', id);
      location.reload();
    }
  };

  return (
    <main className="max-w-md mx-auto p-5 bg-slate-50 min-h-screen font-sans">
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-xl font-black text-slate-800">상품 수정 및 삭제</h1>
      </div>

      <input 
        placeholder="🔍 상품 검색..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="w-full p-4 rounded-2xl mb-6 font-bold bg-white text-slate-900 border-2 border-slate-200 placeholder:text-slate-400" 
      />

      <div className="space-y-4 pb-10">
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
          <ProductItem key={p.id} product={p} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </main>
  );
}