import { cardById, tarotCards } from "../data/tarotCards.js";
import { categories, loveCategories, spreads } from "../data/options.js";
const positionNotes = {
  "Quá khứ":
    "Nhìn lại trải nghiệm đã góp phần tạo nên hiện tại; đây không phải khẳng định một sự kiện đã xảy ra.",
  "Hiện tại":
    "Quan sát điều đang diễn ra và phần bạn có thể chủ động ngay lúc này.",
  "Tương lai":
    "Đây là một hướng phát triển có thể xảy ra nếu cách ứng xử hiện tại tiếp diễn, không phải kết quả cố định.",
  Bạn: "Dùng lá này để soi chiếu nhu cầu và cách bạn hiện diện trong mối quan hệ.",
  "Người ấy":
    "Lá bài chỉ gợi một góc nhìn về tương tác; không thể biết chắc suy nghĩ của người khác.",
  "Mối quan hệ":
    "Xem xét sự trao đổi giữa hai bên và điều cần cùng nhau làm rõ.",
  "Trở ngại":
    "Chủ đề này có thể trở thành điểm vướng khi bị bỏ qua hoặc đẩy đến cực đoan.",
  "Lời khuyên":
    "Chuyển thông điệp thành một hành động nhỏ, cụ thể và trong tầm kiểm soát.",
  "Nguyên nhân":
    "Đây là một giả thuyết để tự nhìn lại, cần đối chiếu với hoàn cảnh thực tế.",
  "Điều bạn chưa thấy":
    "Cân nhắc góc nhìn còn bị bỏ sót; đừng coi điều chưa rõ là bằng chứng.",
  "Hướng phát triển":
    "Hướng đi còn có thể thay đổi theo lựa chọn và hoàn cảnh của bạn.",
  "Điều kiện": "Quan sát điều cần chuẩn bị hoặc làm rõ trước khi quyết định.",
  "Xu hướng":
    "Đây là xu hướng biểu tượng để cân nhắc, không phải dự báo chắc chắn.",
  "Nền tảng":
    "Xem lại nguồn lực và giả định mà quyết định của bạn đang dựa vào.",
};
const pairs = [
  [
    "The Lovers",
    "Two of Cups",
    "Sự kết nối và tính tương hỗ được nhấn mạnh. Hãy xem hai bên có cùng nhu cầu và giá trị không.",
  ],
  [
    "Death",
    "The Tower",
    "Hai biểu tượng chuyển hóa gợi ý việc xem lại một cấu trúc cũ. Ưu tiên ổn định thực tế trong lúc thay đổi.",
  ],
  [
    "The Star",
    "The Sun",
    "Hy vọng gặp sự rõ ràng: những bước hồi phục nhỏ có thể giúp bạn lấy lại niềm tin.",
  ],
  [
    "The Moon",
    "Seven of Swords",
    "Trải bài gợi ý sự thiếu rõ ràng. Hãy hỏi và kiểm chứng thông tin; đây không phải bằng chứng ai đó nói dối.",
  ],
];
const suitNotes = {
  Cups: "Cảm xúc và nhu cầu kết nối đang nổi bật. Việc lắng nghe có thể quan trọng hơn một phản ứng nhanh.",
  Wands:
    "Hành động và cảm hứng đang nổi bật. Chọn một bước thực tế để năng lượng không bị phân tán.",
  Swords:
    "Suy nghĩ và giao tiếp đang nổi bật. Phân biệt dữ kiện với lo lắng trước khi kết luận.",
  Pentacles:
    "Nguồn lực và sự ổn định đang nổi bật. Chú ý thói quen, thời gian và kế hoạch lâu dài.",
};
const contextNotes = {
  "Đang yêu":
    "Hãy đối chiếu lời giải với cam kết và cách hai người chăm sóc mối quan hệ hiện tại.",
  "Đang tìm hiểu":
    "Cho kết nối thời gian phát triển và làm rõ mong đợi từng bước.",
  "Người yêu cũ":
    "Trước khi nghĩ đến quay lại, hãy xem nguyên nhân chia xa có thật sự được giải quyết không.",
  Crush:
    "Một cuộc trò chuyện chân thành sẽ cung cấp thông tin đáng tin hơn việc đoán cảm xúc.",
  "Đang giận nhau":
    "Đợi khi bình tĩnh rồi trao đổi bằng nhu cầu cụ thể, tránh quy kết.",
  "Không còn liên lạc":
    "Tôn trọng ranh giới và quyền không phản hồi của mỗi người.",
  "Đang đi làm":
    "Quan sát khối lượng công việc, phản hồi thực tế và khả năng trao đổi với đội nhóm.",
  "Đang tìm việc":
    "Dùng lời giải để rà soát kỹ năng, hồ sơ và bước ứng tuyển tiếp theo.",
  "Muốn nghỉ việc":
    "Xem lại lý do, nguồn dự phòng và lựa chọn thực tế trước khi quyết định.",
  "Muốn chuyển ngành":
    "Tìm hiểu yêu cầu ngành mới và thử một dự án nhỏ để đánh giá độ phù hợp.",
  "Đang học":
    "Chia mục tiêu học tập thành các bước và tìm phản hồi từ người hướng dẫn.",
};
function questionFocus(question) {
  return question.trim()
    ? `Với điều bạn đang hỏi: “${question.trim()}”`
    : "Với điều bạn đang chiêm nghiệm lúc này";
}

function buildFocusSummary(question, context, resolved, reversed) {
  const first = resolved[0];
  const last = resolved.at(-1);
  const contextLine = context
    ? ` Ngữ cảnh “${context}” cho thấy lời giải nên được đối chiếu với hoàn cảnh thực tế của bạn.`
    : " Hãy đối chiếu lời giải với hoàn cảnh thực tế của bạn.";
  const reversedLine = reversed
    ? ` Có ${reversed} lá ngược, nên phần cần chú ý nằm ở những điều chưa được nói rõ, đang chậm lại hoặc cần được điều chỉnh.`
    : " Các lá bài cùng nhắc bạn quan sát cả cảm xúc lẫn hành động cụ thể trước khi đi đến kết luận.";
  return `${questionFocus(question)}, mạch trải bài đi từ ${first.card.vietnameseName} ở vị trí ${first.position.toLowerCase()} đến ${last.card.vietnameseName} ở vị trí ${last.position.toLowerCase()}. Điều này gợi ý bạn bắt đầu bằng việc nhìn rõ ${first.card.keywords[0]}, rồi dồn sự chú ý vào ${last.card.keywords[0]} như một bước thực tế tiếp theo.${contextLine}${reversedLine}`;
}

function buildConclusion(question, resolved, details) {
  const last = resolved.at(-1);
  const lastDetail = details.at(-1);
  return `${questionFocus(question)}, trọng tâm không nằm ở việc đoán một kết quả cố định. ${last.card.vietnameseName} tại vị trí ${last.position.toLowerCase()} nhấn mạnh ${last.card.keywords[0]} và ${last.card.keywords[1]}. ${lastDetail.meaning} Hãy dùng gợi ý này để chọn một hành động cụ thể: ${lastDetail.advice.toLocaleLowerCase()}`;
}

export function interpretTarot(input) {
  const {
    question = "",
    category = "general",
    context = "",
    cards = [],
  } = input;
  const spread = input.spreadType || input.spread || "single";
  if (!spreads[spread] || cards.length !== spreads[spread].positions.length)
    throw new Error("Số lá không khớp kiểu trải bài.");
  const topic = loveCategories.includes(category)
    ? "love"
    : ["career", "study"].includes(category)
      ? "career"
      : category === "finance"
        ? "finance"
        : "general";
  const resolved = cards.map((c, i) => {
    const card = cardById[c.id] || tarotCards.find((t) => t.name === c.name);
    if (!card || !["upright", "reversed"].includes(c.orientation))
      throw new Error("Lá bài không hợp lệ.");
    return { ...c, card, position: spreads[spread].positions[i] };
  });
  if (new Set(resolved.map((c) => c.card.id)).size !== resolved.length)
    throw new Error("Trải bài có lá trùng.");
  const reversed = resolved.filter((c) => c.orientation === "reversed").length;
  const counts = resolved.reduce((a, c) => {
    const key = c.card.suit || "Major";
    a[key] = (a[key] || 0) + 1;
    return a;
  }, {});
  const links = [];
  for (const [suit, note] of Object.entries(suitNotes))
    if ((counts[suit] || 0) >= 2) links.push(note);
  if ((counts.Major || 0) >= 2)
    links.push(
      "Nhiều Major Arcana gợi ý một chủ đề có ý nghĩa lớn hoặc giai đoạn thay đổi đáng chú ý, không phải định mệnh.",
    );
  for (const [a, b, note] of pairs) {
    const match = resolved.filter((c) => [a, b].includes(c.card.name));
    if (match.length === 2)
      links.push(
        `${a} + ${b}: ${note}${match.some((c) => c.orientation === "reversed") ? " Có lá ngược trong cặp này, nên xem chủ đề như điều cần điều chỉnh hoặc nuôi dưỡng thêm." : ""}`,
      );
  }
  if (resolved.length > 1) {
    const first = resolved[0],
      last = resolved.at(-1);
    links.push(
      `Từ ${first.position.toLowerCase()} đến ${last.position.toLowerCase()}, ${first.card.vietnameseName} đặt trọng tâm vào ${first.card.keywords[0]}, còn ${last.card.vietnameseName} đưa sự chú ý tới ${last.card.keywords[0]}. ${first.orientation === last.orientation ? "Hai vị trí có cùng chiều lá, giúp bạn theo dõi một mạch trải nghiệm xuyên suốt." : "Sự khác biệt xuôi/ngược gợi ý nhịp chuyển giữa biểu hiện bên ngoài và điều cần xử lý bên trong."}`,
    );
  } else
    links.push(
      "Trải một lá không có cặp tương tác. Đọc thông điệp trong mối liên hệ với câu hỏi và hoàn cảnh của bạn.",
    );
  const details = resolved.map((c) => ({
    id: c.card.id,
    position: c.position,
    meaning: c.card[c.orientation][topic],
    positionMeaning:
      positionNotes[c.position] ||
      "Dùng thông điệp như một điểm tựa để quan sát hoàn cảnh hiện tại.",
    advice: c.card[c.orientation].advice,
    application: `${questionFocus(question)}: ý nghĩa của ${c.card.vietnameseName} ở vị trí ${c.position.toLowerCase()} cần được đọc như một góc nhìn cho tình huống này, không phải kết luận thay bạn.`,
  }));
  const normalized = question.toLocaleLowerCase("vi");
  let questionNote =
    "Câu hỏi được giữ làm trọng tâm chiêm nghiệm; lời giải không thể xác minh một sự kiện hay đọc suy nghĩ của người khác.";
  if (/quay lại|người yêu cũ/.test(normalized))
    questionNote = contextNotes["Người yêu cũ"];
  else if (/nghĩ gì|tình cảm|chú ý/.test(normalized))
    questionNote =
      "Để hiểu cảm xúc của người ấy, hãy quan sát hành vi nhất quán và giao tiếp trực tiếp thay vì coi lá bài là câu trả lời thay họ.";
  else if (/chuyển|nghỉ việc/.test(normalized))
    questionNote = contextNotes["Muốn nghỉ việc"];
  const score =
    resolved.reduce(
      (sum, c, i) => sum + c.card.energy[c.orientation] * (i === 2 ? 1.5 : 1),
      0,
    ) / 3.5;
  const yesNo =
    spread === "yes-no"
      ? score >= 1.2
        ? "Nghiêng về Có"
        : score >= 0.35
          ? "Có nhưng có điều kiện"
          : score <= -0.7
            ? "Nghiêng về Không"
            : "Chưa rõ"
      : null;
  return {
    focusSummary: buildFocusSummary(question, context, resolved, reversed),
    overview: `Trải bài ${spreads[spread].name.toLowerCase()} về ${categories.find((c) => c[0] === category)?.[1].toLowerCase() || "câu hỏi của bạn"} gồm ${cards.length} lá, với ${reversed} lá ngược. ${contextNotes[context] || "Đối chiếu những gợi ý dưới đây với hoàn cảnh và trải nghiệm của chính bạn."}`,
    details,
    connections: links,
    conclusion: buildConclusion(question, resolved, details),
    message: `Trải bài gợi ý: ${resolved.at(-1).card[resolved.at(-1).orientation].general} ${question ? questionNote : ""}`,
    attention:
      reversed > cards.length / 2
        ? "Phần lớn lá ngược gợi ý những điều đang diễn ra bên trong, sự trì hoãn hoặc nhu cầu điều chỉnh. Lá ngược không mặc định là xấu."
        : "Hãy quan sát cả cơ hội lẫn giới hạn; biểu tượng Tarot không thay thế dữ kiện thực tế.",
    advice: details.at(-1).advice,
    yesNo,
  };
}
