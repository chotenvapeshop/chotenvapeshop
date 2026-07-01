"use client";

import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  price: string;
  image: string;
};

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    // 💕 상품 상세 페이지(/product/아이디)로 이동할 수 있도록 Link로 감쌌습니다.
    <Link href={`/product/${id}`} className="group block w-full">
      <div className="overflow-hidden rounded-2xl border border-pink-100/50 bg-white p-2.5 shadow-sm transition-all duration-300 hover:shadow-md active:scale-98">
        
        {/* 📸 상품 이미지 영역 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-pink-50/50">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            // 이미지가 없을 때 보여줄 예쁜 연핑크 대체 박스
            <div className="flex h-full w-full items-center justify-center text-2xl">
              💕
            </div>
          )}
        </div>

        {/* ✍️ 상품 정보 영역 (폰트 가독성 극대화) */}
        <div className="mt-3 px-1">
          {/* 상품 이름: 두 줄 이상 길어지면 말줄임표(...) 처리 */}
          <h3 className="line-clamp-2 text-xs font-bold leading-tight text-gray-800 group-hover:text-pink-600">
            {name}
          </h3>
          
          {/* 상품 가격: 또렷하고 굵게 처리해서 가장 먼저 보이도록 세팅 */}
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-sm font-black text-pink-600">
              {price}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}