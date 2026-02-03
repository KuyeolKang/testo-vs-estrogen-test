import { useLocation, useNavigate } from "react-router";
import { products } from "@/data/products";

const resultDescriptions = {
  male_T: {
    title: "테토남",
    description: "강한 추진력과 리더십을 가진 당신! 목표 지향적이고 도전을 즐기는 당신은 테스토스테론 유형입니다. 논리적 사고와 결단력으로 앞서 나가는 스타일이에요.",
    color: "from-red-600 to-orange-600"
  },
  male_E: {
    title: "에겐남",
    description: "섬세하고 감성적인 당신! 타인의 감정을 잘 이해하고 배려심이 깊은 당신은 에스트로겐 유형입니다. 조화를 중시하고 따뜻한 마음을 가진 스타일이에요.",
    color: "from-green-500 to-teal-500"
  },
  female_T: {
    title: "테토녀",
    description: "당당하고 독립적인 당신! 주도적이고 활동적인 당신은 테스토스테론 유형입니다. 자신감 넘치고 목표를 향해 거침없이 나아가는 스타일이에요.",
    color: "from-pink-600 to-red-600"
  },
  female_E: {
    title: "에겐녀",
    description: "부드럽고 감수성이 풍부한 당신! 공감 능력이 뛰어나고 섬세한 당신은 에스트로겐 유형입니다. 따뜻한 감성과 배려로 주변을 행복하게 하는 스타일이에요.",
    color: "from-pink-400 to-purple-400"
  }
};

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, gender, resultType } = location.state as {
    name: string;
    gender: "male" | "female";
    resultType: "T" | "E";
  };

  const resultKey = `${gender}_${resultType}` as keyof typeof resultDescriptions;
  const result = resultDescriptions[resultKey];
  const recommendedProducts = products[resultType];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "테토 vs 에겐 호르몬 성향 테스트",
        text: `나는 ${result.title}! 당신도 테스트해보세요!`,
        url: window.location.origin
      });
    }
  };

  const handleRetry = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-600 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">
              <span className={`bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                {name}님은
              </span>
            </h1>
            <h2 className={`text-5xl font-bold bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
              {result.title}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto">
              {result.description}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              결과 공유하기
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-indigo-600 text-white hover:shadow-xl transition"
            >
              다시 하기
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            {result.title}에게 추천하는 상품
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {recommendedProducts.map((product, index) => (
              <a
                key={index}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <div className="pt-2">
                    <span className="text-purple-600 text-sm font-medium">
                      상품 보러가기 →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
