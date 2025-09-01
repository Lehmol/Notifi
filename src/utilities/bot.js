const rules = [
  { test: /hej|hello|tja/i, reply: () => "Hej! Kul att höras" },
  {
    test: /hur mår du|läget|hur är det/i,
    reply: () => "Jag är en bot, men jag mår bra.",
  },
  {
    test: /namn|vem är du|vad heter du/i,
    reply: () => "Jag heter Maja och är en bot!",
  },
];

export function botReply(userText) {
  const rule = rules.find((r) => r.test.test(userText));
  const base = rule ? rule.reply() : "Vad kul! Berätta mer...";
  const delay = 400 + Math.floor(Math.random() * 900);

  return new Promise((resolve) => setTimeout(() => resolve(base), delay));
}
