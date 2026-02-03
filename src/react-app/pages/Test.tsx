import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { questions } from "@/data/questions";

export default function TestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, gender } = location.state as { name: string; gender: "male" | "female" };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ T: 0, E: 0 });

  const handleAnswer = (type: "T" | "E") => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const resultType = newScores.T > newScores.E ? "T" : "E";
      navigate("/result", { state: { name, gender, resultType } });
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-gray-600">
            <span>{name}님의 테스트</span>
            <span>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="py-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.type)}
                className="w-full py-4 px-6 rounded-xl text-left font-medium text-gray-700 bg-white border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition transform hover:scale-105"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
