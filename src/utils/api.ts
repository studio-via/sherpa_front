const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface FeedbackResponse {
    data: {
      content: string;
      hypotheses: { hypothesis: string }[];
    };
    message: string;
  }
  
// GPT 응답 요청
export async function sendMessageToServer(userPrompt: string): Promise<any> {
  try {
    const response = await fetch(`${SERVER_URL}/gpt/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPrompt }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch response from backend. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("GPT Response:", data);
    return data;
  } catch (error) {
    console.error("Failed to send message:", error);
    return null;
  }
}

// Feedback 전송 요청
export async function sendFeedback(feedback: string, hypothesis: string): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${SERVER_URL}/gpt/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback, hypothesis }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send feedback. Status: ${response.status}`);
      }
  
      const data: FeedbackResponse = await response.json();
      console.log("Feedback Response:", data); // 디버깅용 로그
      return data; // 서버 응답 반환
    } catch (error) {
      console.error("Failed to send feedback:", error);
      throw error; // 에러를 호출한 곳으로 전달
    }
  }
  
