export default function OrderCompletePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-sm w-full bg-white p-8 rounded-3xl border-2 border-pink-100 shadow-sm text-center">
        {/* 성공 아이콘 */}
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">💖</span>
        </div>

        <h2 className="text-2xl font-black text-pink-600 mb-2">구매 요청 완료!</h2>
        <p className="text-xs font-bold text-slate-400 mb-8">
          아래 계좌로 입금해주시면 배송이 시작될거야!
        </p>
        
        {/* 계좌 안내 박스 */}
        <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-4 border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 mb-1">입금 계좌야!</p>
            <p className="text-sm font-black text-slate-800">토스뱅크 : 아직 미개설</p>
            <p className="text-sm font-black text-slate-800">예금주 : 이진호</p>
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[10px] font-black text-slate-400 mb-1">입금자명</p>
            <p className="text-sm font-black text-pink-600">주문서에 있는 이름이랑 같아야해!!</p>
          </div>
        </div>

        {/* 홈으로 버튼 */}
        <a 
          href="/" 
          className="block w-full py-4 mt-8 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          메인화면으로 돌아가기!
        </a>
      </div>
    </main>
  );
}