import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { Sun, ArrowLeft, Send, Bot, User, Sparkles, BookOpen, Coins, Infinity as InfinityIcon } from "lucide-react";

const SUBJECTS = [
  { key: "math", ru: "Математика", kk: "Математика", en: "Mathematics" },
  { key: "physics", ru: "Физика", kk: "Физика", en: "Physics" },
  { key: "chemistry", ru: "Химия", kk: "Химия", en: "Chemistry" },
  { key: "biology", ru: "Биология", kk: "Биология", en: "Biology" },
  { key: "kz_history", ru: "История Казахстана", kk: "Қазақстан тарихы", en: "History of Kazakhstan" },
  { key: "world_history", ru: "Всемирная история", kk: "Дүниежүзі тарихы", en: "World History" },
  { key: "geography", ru: "География", kk: "География", en: "Geography" },
  { key: "kazakh", ru: "Казахский язык", kk: "Қазақ тілі", en: "Kazakh Language" },
  { key: "russian", ru: "Русский язык", kk: "Орыс тілі", en: "Russian Language" },
  { key: "english", ru: "Английский язык", kk: "Ағылшын тілі", en: "English Language" },
  { key: "informatics", ru: "Информатика", kk: "Информатика", en: "Computer Science" },
  { key: "reading", ru: "Грамотность чтения", kk: "Оқу сауаттылығы", en: "Reading Literacy" },
];

const T = {
  ru: {
    backHome: "Назад в кабинет",
    title: "AI-ассистент",
    subtitle: "Задай вопрос по любой теме — объясню и подберу модуль для практики.",
    placeholder: "Например: объясни теорему Пифагора…",
    send: "Отправить",
    thinking: "Печатает…",
    examplesTitle: "Например, спроси:",
    example1: "Объясни теорему Пифагора",
    example2: "Как решать квадратные уравнения?",
    example3: "Расскажи про законы Ньютона",
    suggestionLabel: "Похожий модуль по теме:",
    openModule: "Пройти модуль →",
    freeNotice: "Первые 3 запроса к ИИ — бесплатно. Дальше нужен пакет промптов.",
    fallback: "Не удалось получить ответ от ИИ. Попробуй ещё раз чуть позже.",
    noModuleFound: "Пока не нашёл готового модуля по этой теме — загляни в раздел «Задания» позже.",
    pricingTitle: "Тарифы на запросы к ИИ",
    pricingSubtitle: "Первые 3 запроса бесплатны. Далее — оплата монетами.",
    unit: (n) => (n === 1 ? "1 запрос" : `${n} запросов`),
    unlimited: "Безлимит",
    coinsSuffix: "монет",
    bestValue: "Выгодно",
    buy: "Купить",
    buying: "Покупаем…",
    balanceFree: (n) => `Бесплатных запросов осталось: ${n}`,
    balancePaid: (coins, prompts) => `Монет: ${coins} · Купленных промптов: ${prompts}`,
    balanceUnlimited: "У вас безлимитный доступ к ИИ",
    buyOk: "Пакет успешно куплен!",
    buyNoCoins: "Недостаточно монет, пополните баланс",
    loginNeeded: "Войдите в аккаунт, чтобы пользоваться ИИ и покупать пакеты.",
  },
  kk: {
    backHome: "Кабинетке оралу",
    title: "AI-көмекші",
    subtitle: "Кез келген тақырып бойынша сұрақ қой — түсіндіремін және практикаға модуль табамын.",
    placeholder: "Мысалы: Пифагор теоремасын түсіндір…",
    send: "Жіберу",
    thinking: "Жазып жатыр…",
    examplesTitle: "Мысалы, сұра:",
    example1: "Пифагор теоремасын түсіндір",
    example2: "Квадрат теңдеулерді қалай шешеді?",
    example3: "Ньютон заңдары туралы айтып бер",
    suggestionLabel: "Осы тақырып бойынша ұқсас модуль:",
    openModule: "Модульді ашу →",
    freeNotice: "AI-ға алғашқы 3 сұрақ — тегін. Одан кейін промпт пакеті қажет.",
    fallback: "AI жауабын алу мүмкін болмады. Сәл кейінірек қайталап көр.",
    noModuleFound: "Бұл тақырып бойынша дайын модуль әлі табылмады — «Тапсырмалар» бөлімін кейінірек қараңыз.",
    pricingTitle: "AI сұрауларының тарифтері",
    pricingSubtitle: "Алғашқы 3 сұрақ тегін. Одан кейін — монетамен төлеу.",
    unit: (n) => (n === 1 ? "1 сұрау" : `${n} сұрау`),
    unlimited: "Шексіз",
    coinsSuffix: "монета",
    bestValue: "Тиімді",
    buy: "Сатып алу",
    buying: "Сатып алынуда…",
    balanceFree: (n) => `Тегін сұраныстар қалды: ${n}`,
    balancePaid: (coins, prompts) => `Монета: ${coins} · Сатып алынған промпт: ${prompts}`,
    balanceUnlimited: "Сізде AI-ға шексіз қолжетімділік бар",
    buyOk: "Пакет сәтті сатып алынды!",
    buyNoCoins: "Монета жеткіліксіз, балансты толтырыңыз",
    loginNeeded: "AI-ды пайдалану және пакет сатып алу үшін аккаунтқа кіріңіз.",
  },
  en: {
    backHome: "Back to cabinet",
    title: "AI Assistant",
    subtitle: "Ask about any topic — I'll explain it and find a module to practice with.",
    placeholder: "e.g. explain the Pythagorean theorem…",
    send: "Send",
    thinking: "Typing…",
    examplesTitle: "Try asking:",
    example1: "Explain the Pythagorean theorem",
    example2: "How do I solve quadratic equations?",
    example3: "Tell me about Newton's laws",
    suggestionLabel: "A related module:",
    openModule: "Open module →",
    freeNotice: "The first 3 AI requests are free. After that you'll need a prompt pack.",
    fallback: "Couldn't get a response from the AI. Please try again shortly.",
    noModuleFound: "Couldn't find a ready-made module on this topic yet — check the Modules section again later.",
    pricingTitle: "AI request pricing",
    pricingSubtitle: "First 3 requests are free. After that — pay with coins.",
    unit: (n) => (n === 1 ? "1 request" : `${n} requests`),
    unlimited: "Unlimited",
    coinsSuffix: "coins",
    bestValue: "Best value",
    buy: "Buy",
    buying: "Buying…",
    balanceFree: (n) => `Free requests left: ${n}`,
    balancePaid: (coins, prompts) => `Coins: ${coins} · Purchased prompts: ${prompts}`,
    balanceUnlimited: "You have unlimited AI access",
    buyOk: "Pack purchased successfully!",
    buyNoCoins: "Not enough coins, please top up your balance",
    loginNeeded: "Sign in to use the AI and buy packs.",
  },
};

// Пакеты (только монеты). id — то, что уходит на /webhook/buy-prompts
const PRICING = [
  { id: "p1", prompts: 1, coins: 15, unlimited: false },
  { id: "p5", prompts: 5, coins: 65, unlimited: false },
  { id: "p10", prompts: 10, coins: 120, unlimited: false, best: true },
  { id: "unlimited", prompts: null, coins: 200, unlimited: true },
];

const DEMO_TOPICS = [
  { match: ["пифагор", "pythagor"], subjectKey: "math", searchTerms: ["пифагор", "pythagor", "треугольник", "triangle"] },
  { match: ["ньютон", "newton"], subjectKey: "physics", searchTerms: ["ньютон", "newton", "закон"] },
  { match: ["квадратн", "quadratic"], subjectKey: "math", searchTerms: ["квадратн", "quadratic", "уравнен"] },
];

function findDemoTopic(userText) {
  const lower = userText.toLowerCase();
  return DEMO_TOPICS.find((topic) => topic.match.some((kw) => lower.includes(kw)));
}

async function findMatchingModule(searchTerms, grade, subjects) {
  if (!subjects || subjects.length === 0) return null;
  let query = supabase.from("modules").select("id, title, subject, level").in("subject", subjects);
  const orFilter = searchTerms.map((kw) => `title.ilike.%${kw}%,description.ilike.%${kw}%`).join(",");
  query = query.or(orFilter);
  const { data, error } = await query.order("level", { ascending: true }).limit(1);
  if (error || !data || data.length === 0) return null;
  return data[0];
}

const N8N_WEBHOOK_URL =
  "https://alisheragzam.app.n8n.cloud/webhook/a8409a8a-0055-4648-99a6-1763b7af9210/chat";
const BUY_WEBHOOK_URL =
  "https://alisheragzam.app.n8n.cloud/webhook/buy-prompts";

async function getAIReply(userText, context) {
  const { grade, subjects, lang, userId } = context;
  const t = T[lang] || T.ru;

  let text = t.fallback;
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: userText,
        sessionId: userId || "anonymous",
        metadata: { userId },
      }),
    });
    const data = await res.json();
    text = data.output || t.fallback;
  } catch (err) {
    console.error("AI request failed:", err);
    text = t.fallback;
  }

  const demoTopic = findDemoTopic(userText);
  const searchTerms = demoTopic
    ? demoTopic.searchTerms
    : userText.split(/\s+/).filter((w) => w.length >= 4).slice(0, 4);
  const suggestedModule =
    searchTerms.length > 0 ? await findMatchingModule(searchTerms, grade, subjects) : null;

  return { text, suggestedModule };
}

export default function AiPage({ lang = "ru", grade, subjects = [], onBack, onOpenModule }) {
  const t = T[lang] || T.ru;
  const langKey = lang === "kk" ? "kk" : lang === "en" ? "en" : "ru";
  const subjectLabel = (key) => SUBJECTS.find((s) => s.key === key)?.[langKey] || key;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [buyingId, setBuyingId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null;
      setUserId(id);
      if (id) loadProfile(id);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  async function loadProfile(id) {
    const { data } = await supabase
      .from("profiles")
      .select("coins, ai_prompts_used, ai_prompts_balance, ai_unlimited")
      .eq("id", id)
      .single();
    if (data) setProfile(data);
  }

  const send = async (textOverride) => {
    const text = (textOverride !== undefined ? textOverride : input).trim();
    if (!text || thinking) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    try {
      const reply = await getAIReply(text, { grade, subjects, lang, userId });
      setMessages((prev) => [...prev, { role: "assistant", text: reply.text, suggestedModule: reply.suggestedModule }]);
      if (userId) loadProfile(userId); // обновляем баланс после запроса
    } catch (err) {
      console.error("AI reply failed:", err);
      setMessages((prev) => [...prev, { role: "assistant", text: t.fallback, suggestedModule: null }]);
    } finally {
      setThinking(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const buyPack = async (packId) => {
    if (!userId) {
      alert(t.loginNeeded);
      return;
    }
    if (buyingId) return;
    setBuyingId(packId);
    try {
      const res = await fetch(BUY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pack: packId }),
      });
      const data = await res.json();
      if (data?.success) {
        setProfile((p) => ({
          ...(p || {}),
          coins: data.coins,
          ai_prompts_balance: data.ai_prompts_balance,
          ai_unlimited: data.ai_unlimited,
        }));
        alert(t.buyOk);
      } else {
        alert(t.buyNoCoins);
      }
    } catch (err) {
      console.error("Buy failed:", err);
      alert(t.buyNoCoins);
    } finally {
      setBuyingId(null);
    }
  };

  const planTitle = (p) => (p.unlimited ? t.unlimited : t.unit(p.prompts));

  const freeLeft = profile ? Math.max(0, 3 - (profile.ai_prompts_used || 0)) : 3;

  const balanceLine = () => {
    if (!profile) return t.freeNotice;
    if (profile.ai_unlimited) return t.balanceUnlimited;
    if (freeLeft > 0) return t.balanceFree(freeLeft);
    return t.balancePaid(profile.coins ?? 0, profile.ai_prompts_balance ?? 0);
  };

  return (
    <div className="ai-app">
      <style>{CSS}</style>
      <header className="ai-header">
        <div className="ai-logo">
          <Sun size={20} strokeWidth={2.4} />
          <span>Bilim Jol</span>
        </div>
      </header>

      <section className="ai-section">
        <div className="ai-wrap">
          <button type="button" className="back-link" onClick={onBack}>
            <ArrowLeft size={16} /> {t.backHome}
          </button>

          <div className="ai-title-row">
            <div className="ai-title-icon">
              <Bot size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="page-title">{t.title}</h1>
              <p className="ai-subtitle">{t.subtitle}</p>
            </div>
          </div>

          <div className="demo-notice">
            <Sparkles size={14} strokeWidth={2.4} />
            <span>{balanceLine()}</span>
          </div>

          <div className="chat-card">
            <div className="chat-scroll" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="chat-empty">
                  <div className="chat-empty-icon">
                    <Bot size={28} strokeWidth={2} />
                  </div>
                  <div className="examples-title">{t.examplesTitle}</div>
                  <div className="example-chips">
                    {[t.example1, t.example2, t.example3].map((ex) => (
                      <button key={ex} type="button" className="example-chip" onClick={() => send(ex)}>
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={"chat-row " + (m.role === "user" ? "chat-row-user" : "chat-row-assistant")}>
                  <div className="chat-avatar">
                    {m.role === "user" ? <User size={15} strokeWidth={2.4} /> : <Bot size={15} strokeWidth={2.4} />}
                  </div>
                  <div className="chat-bubble-col">
                    <div className={"chat-bubble " + (m.role === "user" ? "bubble-user" : "bubble-assistant")}>
                      {m.text}
                    </div>
                    {m.role === "assistant" && m.suggestedModule && (
                      <div className="suggestion-card">
                        <div className="suggestion-head">
                          <BookOpen size={14} strokeWidth={2.4} />
                          <span>{t.suggestionLabel}</span>
                        </div>
                        <div className="suggestion-body">
                          <div>
                            <div className="suggestion-title">{m.suggestedModule.title}</div>
                            <div className="suggestion-meta">
                              {subjectLabel(m.suggestedModule.subject)} · Lv.{m.suggestedModule.level}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-solid btn-sm"
                            onClick={() => onOpenModule && onOpenModule(m.suggestedModule.id)}
                          >
                            {t.openModule}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="chat-row chat-row-assistant">
                  <div className="chat-avatar">
                    <Bot size={15} strokeWidth={2.4} />
                  </div>
                  <div className="chat-bubble bubble-assistant bubble-thinking">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-row">
              <textarea
                className="chat-input"
                rows={1}
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                type="button"
                className="btn btn-solid chat-send"
                onClick={() => send()}
                disabled={thinking || !input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Блок тарифов (только монеты, с покупкой) */}
          <div className="pricing">
            <div className="pricing-head">
              <h2 className="pricing-title">{t.pricingTitle}</h2>
              <p className="pricing-subtitle">{t.pricingSubtitle}</p>
            </div>

            <div className="plans">
              {PRICING.map((p) => (
                <div key={p.id} className={"plan " + (p.best ? "plan-best" : "") + (p.unlimited ? " plan-unlimited" : "")}>
                  {p.best && <div className="plan-badge">{t.bestValue}</div>}
                  <div className="plan-icon">
                    {p.unlimited ? <InfinityIcon size={20} strokeWidth={2.4} /> : <Sparkles size={18} strokeWidth={2.4} />}
                  </div>
                  <div className="plan-title">{planTitle(p)}</div>
                  <div className="plan-price">
                    <span className="plan-price-main">
                      {p.coins} <span className="plan-price-unit">{t.coinsSuffix}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className={"btn btn-sm plan-buy " + (p.unlimited ? "btn-orange" : "btn-solid")}
                    onClick={() => buyPack(p.id)}
                    disabled={buyingId !== null || (profile && profile.ai_unlimited)}
                  >
                    <Coins size={13} strokeWidth={2.6} />
                    {buyingId === p.id ? t.buying : t.buy}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CSS = `
.ai-app {
  --dark-1: #0F3941;
  --orange: #F5A623;
  --orange-dark: #DE9312;
  --cream: #F6F8F8;
  --muted: #5C7278;
  --line: #E3EAEB;
  min-height: 100vh;
  background: var(--cream);
  font-family: 'Manrope', sans-serif;
  color: var(--dark-1);
}
.ai-app button:focus-visible, .ai-app textarea:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }
.ai-header { background: #EEF4F5; border-bottom: 1px solid var(--line); padding: 14px 24px; }
.ai-logo { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 8px; font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 18px; color: var(--dark-1); }
.ai-logo svg { color: var(--orange); }
.ai-section { padding: 28px 20px 60px; }
.ai-wrap { max-width: 760px; margin: 0 auto; }
.back-link { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--muted); font-weight: 700; font-size: 13.5px; margin-bottom: 18px; padding: 0; cursor: pointer; }
.back-link:hover { color: var(--dark-1); }
.ai-title-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.ai-title-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(245,166,35,0.14); color: var(--orange-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.page-title { font-family: 'Unbounded', sans-serif; font-size: 22px; margin: 0 0 4px; }
.ai-subtitle { color: var(--muted); font-size: 13.5px; margin: 0; }
.demo-notice {
  display: flex; align-items: center; gap: 8px; background: rgba(245,166,35,0.12); color: var(--orange-dark);
  border: 1px solid rgba(245,166,35,0.3); border-radius: 12px; padding: 10px 14px; font-size: 12.5px; font-weight: 600; margin-bottom: 18px;
}
.chat-card { background: #fff; border: 1px solid var(--line); border-radius: 18px; display: flex; flex-direction: column; overflow: hidden; height: 62vh; min-height: 420px; }
.chat-scroll { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.chat-empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; margin: auto 0; padding: 20px; }
.chat-empty-icon { width: 56px; height: 56px; border-radius: 999px; background: rgba(15,57,65,0.06); color: var(--dark-1); display: flex; align-items: center; justify-content: center; }
.examples-title { font-size: 12.5px; font-weight: 700; color: var(--muted); }
.example-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.example-chip { background: var(--cream); border: 1px solid var(--line); border-radius: 999px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--dark-1); cursor: pointer; }
.example-chip:hover { border-color: var(--orange); color: var(--orange-dark); }

.chat-row { display: flex; gap: 10px; align-items: flex-start; }
.chat-row-user { flex-direction: row-reverse; }
.chat-avatar { width: 28px; height: 28px; border-radius: 999px; background: var(--dark-1); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-row-user .chat-avatar { background: var(--orange); color: #26210a; }
.chat-bubble-col { display: flex; flex-direction: column; gap: 8px; max-width: 78%; }
.chat-row-user .chat-bubble-col { align-items: flex-end; }
.chat-bubble { padding: 11px 15px; border-radius: 14px; font-size: 13.5px; line-height: 1.55; white-space: pre-wrap; }
.bubble-assistant { background: var(--cream); color: var(--dark-1); border: 1px solid var(--line); border-top-left-radius: 4px; }
.bubble-user { background: var(--dark-1); color: #fff; border-top-right-radius: 4px; }
.bubble-thinking { display: flex; gap: 4px; align-items: center; padding: 14px 16px; }
.dot { width: 6px; height: 6px; border-radius: 999px; background: var(--muted); animation: aiBounce 1.1s infinite ease-in-out; }
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes aiBounce { 0%, 80%, 100% { opacity: 0.35; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }

.suggestion-card { background: #fff; border: 1px solid var(--line); border-left: 3px solid var(--orange); border-radius: 12px; padding: 12px 14px; width: 100%; }
.suggestion-head { display: flex; align-items: center; gap: 6px; color: var(--orange-dark); font-size: 11.5px; font-weight: 800; margin-bottom: 8px; }
.suggestion-body { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.suggestion-title { font-size: 13.5px; font-weight: 700; }
.suggestion-meta { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

.chat-input-row { display: flex; gap: 10px; padding: 14px 16px; border-top: 1px solid var(--line); align-items: flex-end; }
.chat-input { flex: 1; resize: none; border: 1px solid var(--line); border-radius: 12px; padding: 11px 14px; font-size: 13.5px; font-family: inherit; color: var(--white-1); max-height: 120px; }
.chat-input:focus { border-color: var(--orange); outline: none; }
.chat-send { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; }

.btn { border-radius: 999px; font-weight: 700; padding: 11px 18px; font-size: 13.5px; border: 1px solid transparent; cursor: pointer; }
.btn-solid { background: var(--dark-1); color: #fff; }
.btn-solid:hover { background: #0b2b31; }
.btn-solid:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-orange { background: var(--orange); color: #26210a; }
.btn-orange:hover { background: var(--orange-dark); }
.btn-orange:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-sm { padding: 7px 13px; font-size: 12px; white-space: nowrap; }
.plan-buy { display: inline-flex; align-items: center; gap: 6px; margin-top: 2px; }
.empty-text { color: var(--muted); font-size: 13px; }

/* Тарифы */
.pricing { margin-top: 26px; }
.pricing-head { text-align: center; margin-bottom: 16px; }
.pricing-title { font-family: 'Unbounded', sans-serif; font-size: 18px; margin: 0 0 4px; }
.pricing-subtitle { color: var(--muted); font-size: 13px; margin: 0; }
.plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.plan { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px 14px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.plan-best { border-color: var(--orange); box-shadow: 0 4px 16px rgba(245,166,35,0.16); }
.plan-unlimited { background: linear-gradient(160deg, #0F3941, #124751); border-color: #0F3941; color: #fff; }
.plan-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--orange); color: #26210a; font-size: 10.5px; font-weight: 800; padding: 3px 10px; border-radius: 999px; white-space: nowrap; }
.plan-icon { width: 40px; height: 40px; border-radius: 12px; background: rgba(245,166,35,0.14); color: var(--orange-dark); display: flex; align-items: center; justify-content: center; }
.plan-unlimited .plan-icon { background: rgba(245,166,35,0.22); color: var(--orange); }
.plan-title { font-size: 13.5px; font-weight: 700; }
.plan-price-main { font-family: 'Unbounded', sans-serif; font-size: 18px; font-weight: 700; }
.plan-price-unit { font-family: 'Manrope', sans-serif; font-size: 11.5px; font-weight: 600; color: var(--muted); }
.plan-unlimited .plan-price-unit { color: rgba(255,255,255,0.7); }

@media (max-width: 600px) {
  .chat-bubble-col { max-width: 88%; }
  .chat-card { height: 68vh; }
  .plans { grid-template-columns: repeat(2, 1fr); }
}
`;