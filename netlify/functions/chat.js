import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { user_query, history = [] } = JSON.parse(event.body || "{}");

  if (!user_query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ai_response: "No query provided." }),
    };
  }

  try {
    const messages = history.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    messages.unshift({
      role: "system",
      content: "You are KoalaRoute AI, a helpful travel assistant.",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
    });

    const aiMessage =
      response.choices[0].message.content || "No response from AI";

    return {
      statusCode: 200,
      body: JSON.stringify({ ai_response: aiMessage }),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ai_response: "Error connecting to OpenAI API." }),
    };
  }
}
