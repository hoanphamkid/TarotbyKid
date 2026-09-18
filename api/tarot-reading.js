import { interpretTarot } from "../src/services/tarotEngine.js";
import { buildAiReadingPayload } from "../src/services/aiPayload.js";
import { analyzeQuestion } from "../src/services/questionAnalyzer.js";
import { categories, contexts, spreads } from "../src/data/options.js";

const categoryIds = new Set(categories.map(([id]) => id));
const requestsByIp = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;

export const systemPrompt = `Bạn là bộ máy diễn giải Tarot cho HPTAROT. Chỉ dùng dữ liệu trong JSON người dùng gửi: câu hỏi, chủ đề, ngữ cảnh, kiểu trải, vị trí, lá bài, chiều xuôi/ngược, meanings và analysis. Dữ liệu HPTAROT luôn được ưu tiên; không tự thêm, đổi lá hay đổi orientation.

Đọc mỗi lá theo CARD + ORIENTATION + POSITION + TOPIC + QUESTION + CONTEXT. Lá reversed không mặc định là xấu: có thể là năng lượng bị trì hoãn, hướng nội, mất cân bằng hoặc điều cần điều chỉnh. Không khẳng định biết suy nghĩ thật của người khác. Không khẳng định tương lai chắc chắn; dùng “trải bài gợi ý”, “có thể”, “nếu hoàn cảnh tiếp tục theo hướng hiện tại”.

Không đưa chẩn đoán y tế/tâm lý, mang thai, cái chết, pháp lý, tội phạm, đầu tư, mua bán, vay nợ, cờ bạc, phản bội hoặc người thứ ba như sự thật. Với nội dung nhạy cảm, chuyển trọng tâm về cảm xúc, dữ kiện thực tế, ranh giới và hành động người dùng kiểm soát được.

Viết tiếng Việt tự nhiên, nhẹ nhàng, rõ ràng, không huyền bí quá mức. Không giải thích process nội bộ. Không lặp lại cùng một ý. Trả lời khoảng 650-900 từ với chính xác các đề mục Markdown:
## Tổng quan
## Từng lá bài
## Mối liên hệ giữa các lá
## Trả lời câu hỏi
## Điều cần chú ý
## Lời khuyên
## Thông điệp ngắn

Phần “Trả lời câu hỏi” phải đi thẳng vào câu hỏi. Nêu sự mâu thuẫn khi dữ liệu lá thể hiện hai chiều, không ép thành một kết luận. “Thông điệp ngắn” chỉ 1-2 câu, phù hợp để chia sẻ.`;

function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  return typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : "unknown";
}

function isRateLimited(req) {
  const now = Date.now();
  const ip = getClientIp(req);
  const recent = (requestsByIp.get(ip) || []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );
  recent.push(now);
  requestsByIp.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function validReading(body) {
  return Boolean(
    body &&
    JSON.stringify(body).length <= 16000 &&
    typeof body.question === "string" &&
    body.question.length <= 500 &&
    typeof body.context === "string" &&
    body.context.length <= 100 &&
    typeof body.category === "string" &&
    categoryIds.has(body.category) &&
    typeof body.spread === "string" &&
    spreads[body.spread] &&
    Array.isArray(body.cards) &&
    body.cards.length === spreads[body.spread].positions.length &&
    body.cards.every(
      (card) =>
        card &&
        typeof card.id === "string" &&
        ["upright", "reversed"].includes(card.orientation),
    ) &&
    (!body.context || contexts[body.category]?.options.includes(body.context)),
  );
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (
    process.env.AI_ENABLED !== "true" ||
    !process.env.AI_API_KEY ||
    !process.env.AI_API_URL ||
    !process.env.AI_MODEL
  )
    return res.status(503).json({ error: "AI is disabled or not configured" });
  if (isRateLimited(req))
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again shortly." });

  let body;
  let aiPayload;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!validReading(body)) throw new Error("Invalid reading");
    body.questionAnalysis = analyzeQuestion({
      question: body.question,
      selectedCategory: body.category,
      selectedContext: body.context,
      spread: body.spread,
    });
    aiPayload = buildAiReadingPayload(body, interpretTarot(body));
  } catch {
    return res.status(400).json({ error: "Invalid reading" });
  }

  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(aiPayload) },
        ],
        temperature: 0.3,
        max_tokens: 2200,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Provider failed");
    const data = await response.json();
    const narrative = data.choices?.[0]?.message?.content;
    if (typeof narrative !== "string" || !narrative.trim())
      throw new Error("Invalid provider response");
    return res.status(200).json({ narrative });
  } catch {
    return res.status(502).json({ error: "AI temporarily unavailable" });
  }
}
