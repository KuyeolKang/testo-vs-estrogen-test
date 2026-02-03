import { useState } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  const handleStart = () => {
    if (name && gender) {
      navigate("/test", { state: { name, gender } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
            테토 vs 에겐
          </h1>
          <p className="text-lg font-semibold text-gray-800">
            호르몬 성향 테스트
          </p>
          <p className="text-sm text-gray-600">
            나는 테스토스테론형? 에스트로겐형?
            <br />
            나의 진짜 성향을 알아보세요!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender("male")}
                className={`py-3 px-4 rounded-xl font-medium transition ${
                  gender === "male"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                남성
              </button>
              <button
                onClick={() => setGender("female")}
                className={`py-3 px-4 rounded-xl font-medium transition ${
                  gender === "female"
                    ? "bg-rose-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                여성
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name || !gender}
          className={`w-full py-4 rounded-xl font-bold text-lg transition ${
            name && gender
              ? "bg-gradient-to-r from-rose-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          테스트 시작하기
        </button>

        <p className="text-xs text-center text-gray-500">
          총 10개의 질문 · 약 2분 소요
        </p>
      </div>
    </div>
  );
}
