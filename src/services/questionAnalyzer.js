const abbreviations = [
  [/\bnyc\b|\bng\s*iu\s*cu\b|\bngyeucu\b/gi, "người yêu cũ"],
  [/\bny\b|\bng\s*iu\b/gi, "người yêu"],
  [/\bcr\b/gi, "crush"],
  [/\btcinh\b/gi, "tài chính"],
  [/\btc\b|\bcxuc\b|\bcamxuc\b/gi, "tình cảm"],
  [/\bmqh\b|\bqhe\b/gi, "mối quan hệ"],
  [/\bcv\b/gi, "công việc"],
  [/\bnt\b|\bib\b/gi, "nhắn tin"],
  [/\bqlai\b|\bql\b/gi, "quay lại"],
  [/\bngta\b/gi, "người ấy"],
  [/\bntn\b/gi, "như thế nào"],
  [/\bctay\b/gi, "chia tay"],
  [/\bko\b|\bkh\b|\bhk\b|\bhong\b|\bhông\b|\bk\b/gi, "không"],
  [/\bdc\b|\bđc\b/gi, "được"],
  [/\bvs\b/gi, "với"],
  [/\bthg\b|\bthang\b/gi, "tháng"],
  [/(^|[\s,?!])t(?=$|[\s,?!])/gi, "$1tôi"],
];

const stripVietnamese = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
const haystack = (value) => stripVietnamese(value.toLowerCase());
const hasAny = (text, phrases) =>
  phrases.some((phrase) => text.includes(phrase));

function normalizeQuestion(question) {
  let normalized = question.trim().replace(/\s+/g, " ");
  for (const [pattern, replacement] of abbreviations)
    normalized = normalized.replace(pattern, replacement);
  const plain = haystack(normalized);
  const noAccentReplacements = [
    ["nguoi yeu cu", "người yêu cũ"],
    ["nguoi yeu", "người yêu"],
    ["tinh cam", "tình cảm"],
    ["cong viec", "công việc"],
    ["tai chinh", "tài chính"],
    ["nhan tin", "nhắn tin"],
    ["nghi viec", "nghỉ việc"],
    ["chia tay", "chia tay"],
    ["co nen", "có nên"],
  ];
  for (const [plainPhrase, replacement] of noAccentReplacements) {
    if (plain.includes(plainPhrase))
      normalized = normalized.replace(
        new RegExp(plainPhrase, "gi"),
        replacement,
      );
  }
  return normalized.replace(/\s+/g, " ").trim();
}

export function analyzeQuestion({
  question = "",
  selectedCategory = "general",
  selectedContext = "",
  spread = "single",
}) {
  const originalQuestion = question.trim();
  const normalizedQuestion = normalizeQuestion(originalQuestion);
  const text = haystack(normalizedQuestion);
  const selected = haystack(`${selectedCategory} ${selectedContext}`);
  const careerSignal = hasAny(text, [
    "cong viec",
    "nghi viec",
    "chuyen viec",
    "phong van",
    "thang chuc",
    "sep",
    "dong nghiep",
  ]);
  const financeSignal = hasAny(text, [
    "tai chinh",
    "tien",
    "thu nhap",
    "chi tieu",
    "no",
    "ngan sach",
  ]);
  const studySignal = hasAny(text, [
    "hoc",
    "thi do",
    "phong van",
    "truong",
    "nganh",
  ]);
  const loveSignal = hasAny(text, [
    "nguoi yeu",
    "crush",
    "tinh cam",
    "moi quan he",
    "chia tay",
    "lanh nhat",
    "ghost",
    "seen",
    "rep",
  ]);
  const contextLove = hasAny(selected, [
    "love",
    "ex",
    "crush",
    "relationship",
    "nguoi yeu",
    "lien lac",
  ]);
  const category = careerSignal
    ? "career"
    : financeSignal
      ? "finance"
      : studySignal
        ? "study"
        : loveSignal
          ? "love"
          : selectedCategory || "general";
  const subject =
    hasAny(text, ["nguoi yeu cu", "chia tay", "quay lai"]) ||
    hasAny(selected, ["ex", "nguoi cu", "nguoi yeu cu", "chia tay"])
      ? "ex"
      : hasAny(text, ["crush"])
        ? "crush"
        : hasAny(text, ["nguoi ay", "nguoi yeu", "ngta"])
          ? "partner"
          : careerSignal
            ? "career"
            : financeSignal
              ? "money"
              : contextLove
                ? "relationship"
                : "self";
  const isDecision = hasAny(text, ["co nen", "nen ", "chon ", "quyet dinh"]);
  const isReconciliation = hasAny(text, [
    "quay lai",
    "cuu",
    "con co hoi",
    "co co hoi",
    "han gan",
  ]);
  const isFeelings = hasAny(text, [
    "tinh cam",
    "con yeu",
    "con nho",
    "co thich",
    "cam xuc",
  ]);
  const isPerception = hasAny(text, ["nghi gi", "nhin nhan"]);
  const isObstacle = hasAny(text, [
    "tai sao",
    "vi sao",
    "can tro",
    "lanh nhat",
    "khong thuan",
    "seen",
  ]);
  const isTiming = hasAny(text, ["bao gio", "khi nao"]);
  const isFuture = hasAny(text, [
    "sap toi",
    "thoi gian toi",
    "tuong lai",
    "3 thang",
    "6 thang",
    "nam nay",
  ]);
  const yesNo =
    /\b(co|nen)\b.*\b(khong|chua)\b|\bkhong\s*\??$/.test(text) || isDecision;
  const primaryIntent = isDecision
    ? "decision"
    : isReconciliation
      ? "reconciliation"
      : isFeelings
        ? "feelings"
        : isPerception
          ? "perception"
          : isObstacle
            ? "obstacle"
            : isTiming
              ? "timing"
              : isFuture
                ? "future_trend"
                : originalQuestion
                  ? "current_situation"
                  : "general_message";
  const secondaryIntents = [
    isDecision && "next_step",
    isReconciliation && "future_trend",
    isFeelings && "feelings",
    isFuture && "future_trend",
    yesNo && "yes_no",
    hasAny(text, ["seen", "rep", "nhan tin"]) && "communication",
  ]
    .filter(Boolean)
    .filter(
      (item, index, list) =>
        item !== primaryIntent && list.indexOf(item) === index,
    );
  const timeframe = hasAny(text, ["3 thang", "ba thang"])
    ? "next_3_months"
    : hasAny(text, ["6 thang", "sau thang"])
      ? "next_6_months"
      : text.includes("tuan toi")
        ? "next_week"
        : text.includes("thang toi")
          ? "next_month"
          : text.includes("hom nay")
            ? "today"
            : isFuture
              ? "upcoming"
              : "unspecified";
  const confidence = originalQuestion
    ? Math.min(
        0.95,
        0.45 +
          [
            careerSignal,
            financeSignal,
            studySignal,
            loveSignal,
            Boolean(selectedContext),
            yesNo,
            isDecision,
            isFuture,
          ].filter(Boolean).length *
            0.07,
      )
    : 0.5;
  return {
    originalQuestion,
    normalizedQuestion,
    normalizationConfidence: normalizedQuestion === originalQuestion ? 1 : 0.82,
    category,
    subcategory: subject,
    primaryIntent,
    secondaryIntents,
    subject,
    timeframe,
    relationshipContext: contextLove
      ? selectedContext || "unspecified"
      : "unspecified",
    decisionType: isDecision ? "user_choice" : "none",
    yesNo,
    focusAreas: [category, primaryIntent, subject, timeframe].filter(
      (item) => item && item !== "unspecified",
    ),
    interpretationHints: [
      isDecision &&
        "Prioritize options, risks, constraints, and controllable next steps.",
      isTiming && "Discuss conditions and phases, never an exact date.",
      subject !== "self" &&
        "Do not present another person's private thoughts as fact.",
    ].filter(Boolean),
    confidence,
    spread,
  };
}
