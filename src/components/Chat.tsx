import React, { useState } from "react";
import { sendMessageToServer, sendFeedback } from "../utils/api";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [hypotheses, setHypotheses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // 사용자 입력 메시지 추가
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setLoading(true); // 로딩 상태 시작

    // 서버로 요청 전송
    const gptResponse = await sendMessageToServer(userInput);

    if (gptResponse) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: gptResponse.data.content },
      ]);
      setHypotheses(gptResponse.data.hypotheses.map((h: any) => h.hypothesis));
    }

    setLoading(false); // 로딩 상태 종료
    setUserInput(""); // 입력 필드 초기화
  };

  const handleSendFeedback = async (selectedHypothesis: string) => {
    if (!feedback.trim()) {
      alert("Please provide feedback before submitting.");
      return;
    }

    try {
      // 선택한 hypothesis와 feedback 서버로 전송
      const feedbackResponse = await sendFeedback(feedback, selectedHypothesis);

      // 서버 응답 데이터를 화면에 추가
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Feedback: ${feedbackResponse.data.content}` },
      ]);

      // 가설 출력
      setHypotheses(feedbackResponse.data.hypotheses.map((h) => h.hypothesis));
      alert("Feedback submitted successfully!");
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setFeedback(""); // feedback 초기화
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-4">
        <h1 className="text-xl font-bold text-center mb-4">The First Sherpa*AI</h1>

        {/* 대화 창 */}
        <div
          id="chatBox"
          className="border border-gray-300 rounded p-3 h-80 overflow-y-auto bg-gray-50"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "user"
                  ? "text-blue-500 text-right flex justify-end"
                  : "text-green-500 text-left flex justify-start"
              }`}
            >
              <span className="inline-block bg-gray-200 rounded p-2 max-w-sm">
                {msg.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-green-500 text-left flex justify-start">
              <span className="inline-block bg-gray-200 rounded p-2 max-w-sm">
                Loading...
              </span>
            </div>
          )}
        </div>

        {/* Feedback 입력 */}
        <div className="mt-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback here..."
            className="w-full md:w-3/4 border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* 가설(Hypotheses) 버튼 */}
        <div className="mt-4 flex flex-col gap-2">
          {hypotheses.map((hypothesis, index) => (
            <button
              key={index}
              onClick={() => handleSendFeedback(hypothesis)}
              className="block w-full bg-gray-200 hover:bg-[#453D66] hover:text-white text-gray-700 text-left p-2 rounded transition"
            >
              {hypothesis}
            </button>
          ))}
        </div>

        {/* 사용자 입력 */}
        <div className="mt-4 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
