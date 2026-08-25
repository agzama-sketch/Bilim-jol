import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Sun, ArrowLeft, Video, Check, Zap, Sparkles } from "lucide-react";

const XP_PER_MODULE = 20;

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
    title: "Модули",
    backHome: "В кабинет",
    empty: "Пока нет модулей для вашего класса и предметов.",
    loading: "Загрузка…",
    loadError: "Не удалось загрузить модули.",
    levelShort: "Уровень",
    openModule: "Открыть",
    backList: "К списку модулей",
    finish: "Завершить",
    next: "Далее",
    startQuiz: "Пройти вопросы",
    noQuestions: "У этого модуля пока нет вопросов — можно сразу завершить.",
    resultTitle: "Модуль пройден!",
    resultXp: (xp) => `+${xp} XP`,
    resultScore: (score, total) => `Правильных ответов: ${score} из ${total}`,
    question: (i, n) => `Вопрос ${i} из ${n}`,
    recommendedBadge: "Рекомендовано учителем",
    levelUpText: (level) => `Новый уровень ${level}! +5 монет`,
    deadlineLabel: (date) => `Дедлайн: ${date}`,
    deadlineOverdue: (date) => `Просрочено: ${date}`,
    completedBadge: "Пройден",
  },
  kk: {
    title: "Модульдер",
    backHome: "Кабинетке",
    empty: "Сіздің сыныбыңыз бен пәндеріңізге сәйкес модульдер әзірге жоқ.",
    loading: "Жүктелуде…",
    loadError: "Модульдерді жүктеу мүмкін болмады.",
    levelShort: "Деңгей",
    openModule: "Ашу",
    backList: "Модульдер тізіміне",
    finish: "Аяқтау",
    next: "Келесі",
    startQuiz: "Сұрақтарды өту",
    noQuestions: "Бұл модульде әзірге сұрақтар жоқ — бірден аяқтауға болады.",
    resultTitle: "Модуль аяқталды!",
    resultXp: (xp) => `+${xp} XP`,
    resultScore: (score, total) => `Дұрыс жауаптар: ${total}-дан ${score}`,
    question: (i, n) => `${n} сұрақтың ${i}-і`,
    recommendedBadge: "Мұғалім ұсынған",
    levelUpText: (level) => `Жаңа деңгей ${level}! +5 монета`,
    deadlineLabel: (date) => `Мерзімі: ${date}`,
    deadlineOverdue: (date) => `Мерзімі өтті: ${date}`,
    completedBadge: "Аяқталды",
  },
  en: {
    title: "Modules",
    backHome: "To dashboard",
    empty: "No modules yet for your grade and subjects.",
    loading: "Loading…",
    loadError: "Couldn't load modules.",
    levelShort: "Level",
    openModule: "Open",
    backList: "Back to modules",
    finish: "Finish",
    next: "Next",
    startQuiz: "Take the quiz",
    noQuestions: "This module has no questions yet — you can finish right away.",
    resultTitle: "Module complete!",
    resultXp: (xp) => `+${xp} XP`,
    resultScore: (score, total) => `Correct answers: ${score} of ${total}`,
    question: (i, n) => `Question ${i} of ${n}`,
    recommendedBadge: "Recommended by your teacher",
    levelUpText: (level) => `New level ${level}! +5 coins`,
    deadlineLabel: (date) => `Deadline: ${date}`,
    deadlineOverdue: (date) => `Overdue: ${date}`,
    completedBadge: "Completed",
  },
};

// Local YYYY-MM-DD so deadline comparisons match the date strings stored
// by the teacher's calendar picker, regardless of the visitor's timezone.
function todayStr() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export default function ModulesPage({
  lang = "ru",
  grade,
  subjects = [],
  recommendedIds = [],
  moduleDeadlines = {},
  completedIds = [],
  initialModuleId = null,
  onInitialModuleConsumed = () => {},
  onBack,
  onFinish,
}) {
  const t = T[lang] || T.ru;
  const langKey = lang === "kk" ? "kk" : lang === "en" ? "en" : "ru";
  const subjectLabel = (key) => SUBJECTS.find((s) => s.key === key)?.[langKey] || key;
  const isRecommended = (moduleId) => recommendedIds.includes(moduleId);
  const isCompleted = (moduleId) => completedIds.includes(moduleId);

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModule, setOpenModule] = useState(null); // module object or null
  const [stage, setStage] = useState("content"); // "content" | "quiz" | "result"
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [levelUp, setLevelUp] = useState(null); // { newLevel } or null
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      // Fetch everything and filter client-side rather than building a
      // fragile OR-query string: a module counts as relevant if it
      // matches the student's own grade+subject, OR if a teacher
      // specifically recommended it (which can be outside that match on
      // purpose — e.g. a harder module from another subject/grade).
      const { data, error: err } = await supabase.from("modules").select("*").order("level", { ascending: true });
      if (err) {
        setError(t.loadError);
        setModules([]);
      } else {
        const relevant = (data || []).filter(
          (m) => (m.grade === grade && subjects.includes(m.subject)) || isRecommended(m.id)
        );
        relevant.sort((a, b) => {
          const aCompleted = isCompleted(a.id) ? 1 : 0;
          const bCompleted = isCompleted(b.id) ? 1 : 0;
          if (aCompleted !== bCompleted) return aCompleted - bCompleted;
          const aRec = isRecommended(a.id) ? 0 : 1;
          const bRec = isRecommended(b.id) ? 0 : 1;
          if (aRec !== bRec) return aRec - bRec;
          return a.level - b.level;
        });
        setModules(relevant);
      }
      setLoading(false);
    })();
  }, [grade, JSON.stringify(subjects), JSON.stringify(recommendedIds)]);

  // If the student arrived here via the AI assistant's "Open module"
  // button, jump straight into that module once it's loaded — then clear
  // the pending id so navigating back here later doesn't reopen it.
  useEffect(() => {
    if (!initialModuleId || modules.length === 0) return;
    const match = modules.find((m) => m.id === initialModuleId);
    if (match) openModuleDetail(match);
    onInitialModuleConsumed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModuleId, modules]);

  const openModuleDetail = (m) => {
    setOpenModule(m);
    setStage("content");
    setQIndex(0);
    setSelected(null);
    setAnswers([]);
    setXpAwarded(false);
    setLevelUp(null);
  };

  const startQuiz = () => {
    setStage("quiz");
    setQIndex(0);
    setSelected(null);
    setAnswers([]);
  };

  const nextQuestion = () => {
    const updated = [...answers, selected];
    setAnswers(updated);
    setSelected(null);
    const total = openModule.questions.length;
    if (qIndex + 1 < total) {
      setQIndex(qIndex + 1);
    } else {
      setStage("result");
    }
  };

  const finishModule = () => {
    setStage("result");
  };

  const score =
    openModule && openModule.questions && openModule.questions.length
      ? answers.reduce((acc, a, i) => acc + (a === openModule.questions[i].correct ? 1 : 0), 0)
      : 0;

  // A "100%" module completion means it actually had questions and every
  // one was answered correctly — a module with no quiz never counts.
  const isPerfectRun =
    !!openModule && !!openModule.questions && openModule.questions.length > 0 && score === openModule.questions.length;

  const awardAndMaybeLevelUp = async () => {
    if (!onFinish) return;
    const result = await onFinish(XP_PER_MODULE, isPerfectRun, openModule.id);
    if (result && result.levelsGained > 0) setLevelUp({ newLevel: result.newLevel });
  };

  // If we reached "result" via the quiz path (not the no-questions
  // shortcut above), award XP exactly once when we arrive at that stage.
  useEffect(() => {
    if (stage === "result" && !xpAwarded) {
      setXpAwarded(true);
      awardAndMaybeLevelUp();
    }
  }, [stage]);

  return (
    <div className="mod-app">
      <style>{CSS}</style>
      <header className="mod-header">
        <div className="mod-logo">
          <Sun size={20} strokeWidth={2.4} />
          <span>Bilim Jol</span>
        </div>
      </header>

      <section className="mod-section">
        <div className="mod-wrap">
          {!openModule && (
            <>
              <button type="button" className="back-link" onClick={onBack}>
                <ArrowLeft size={16} /> {t.backHome}
              </button>
              <h1 className="page-title">{t.title}</h1>

              {loading && <div className="empty-text">{t.loading}</div>}
              {!loading && error && <div className="empty-text error">{error}</div>}
              {!loading && !error && modules.length === 0 && <div className="empty-text">{t.empty}</div>}

              {!loading && !error && modules.length > 0 && (
                <div className="module-grid">
                  {modules.map((m) => (
                    <div className={"module-card" + (isCompleted(m.id) ? " completed" : "")} key={m.id}>
                      <div className="module-card-head">
                        <span className="module-title">{m.title}</span>
                        <span className="level-tag">
                          {t.levelShort} {m.level}
                        </span>
                      </div>
                      <div className="module-meta">{subjectLabel(m.subject)}</div>
                      {isCompleted(m.id) ? (
                        <div className="completed-badge">
                          <Check size={12} strokeWidth={3} /> {t.completedBadge}
                        </div>
                      ) : (
                        isRecommended(m.id) && <div className="rec-badge">{t.recommendedBadge}</div>
                      )}
                      {!isCompleted(m.id) && moduleDeadlines[m.id] && (
                        <div className={"deadline-badge" + (moduleDeadlines[m.id] < todayStr() ? " overdue" : "")}>
                          {moduleDeadlines[m.id] < todayStr()
                            ? t.deadlineOverdue(moduleDeadlines[m.id])
                            : t.deadlineLabel(moduleDeadlines[m.id])}
                        </div>
                      )}
                      {m.description && <div className="module-desc">{m.description}</div>}
                      <button
                        type="button"
                        className={"btn btn-block " + (isCompleted(m.id) ? "btn-outline" : "btn-solid")}
                        disabled={isCompleted(m.id)}
                        onClick={() => openModuleDetail(m)}
                      >
                        {isCompleted(m.id) ? (
                          <>
                            <Check size={14} strokeWidth={3} /> {t.completedBadge}
                          </>
                        ) : (
                          t.openModule
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {openModule && stage === "content" && (
            <>
              <button type="button" className="back-link" onClick={() => setOpenModule(null)}>
                <ArrowLeft size={16} /> {t.backList}
              </button>
              <div className="card">
                <h2 className="card-title">{openModule.title}</h2>
                <div className="module-meta">
                  {subjectLabel(openModule.subject)} · {t.levelShort} {openModule.level}
                </div>

                {openModule.video_url && (
                  <a className="module-video" href={openModule.video_url} target="_blank" rel="noreferrer">
                    <Video size={15} /> {openModule.video_url}
                  </a>
                )}

                <div className="content-blocks">
                  {(openModule.content || []).map((block, i) =>
                    block.type === "image" ? (
                      <figure className="content-image" key={i}>
                        <img src={block.value} alt={block.caption || ""} />
                        {block.caption && <figcaption>{block.caption}</figcaption>}
                      </figure>
                    ) : (
                      <p className="content-text" key={i}>
                        {block.value}
                      </p>
                    )
                  )}
                </div>

                {openModule.questions && openModule.questions.length > 0 ? (
                  <button type="button" className="btn btn-solid btn-block" onClick={startQuiz}>
                    {t.startQuiz}
                  </button>
                ) : (
                  <>
                    <div className="hint-text">{t.noQuestions}</div>
                    <button type="button" className="btn btn-solid btn-block" onClick={finishModule}>
                      {t.finish}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {openModule && stage === "quiz" && (
            <div className="card">
              <div className="progress-row">
                <span className="progress-label">{t.question(qIndex + 1, openModule.questions.length)}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(qIndex / openModule.questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <h2 className="question-text">{openModule.questions[qIndex].q}</h2>
              <div className="options-col">
                {openModule.questions[qIndex].options.map((opt, i) => (
                  <button
                    type="button"
                    key={i}
                    className={"option" + (selected === i ? " active" : "")}
                    onClick={() => setSelected(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-solid btn-block"
                disabled={selected === null}
                onClick={nextQuestion}
              >
                {qIndex + 1 === openModule.questions.length ? t.finish : t.next}
              </button>
            </div>
          )}

          {openModule && stage === "result" && (
            <div className="card done-card">
              <div className="done-icon">
                <Check size={28} strokeWidth={3} />
              </div>
              <h2 className="card-title center">{t.resultTitle}</h2>
              {openModule.questions && openModule.questions.length > 0 && (
                <p className="card-subtitle center">{t.resultScore(score, openModule.questions.length)}</p>
              )}
              <div className="xp-badge">
                <Zap size={15} strokeWidth={2.6} /> {t.resultXp(XP_PER_MODULE)}
              </div>
              {levelUp && (
                <div className="levelup-badge">
                  <Sparkles size={15} strokeWidth={2.4} /> {t.levelUpText(levelUp.newLevel)}
                </div>
              )}
              <button type="button" className="btn btn-solid btn-block" onClick={onBack}>
                {t.backHome}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.mod-app {
  --dark-1: #0F3941;
  --orange: #F5A623;
  --orange-dark: #DE9312;
  --cream: #F6F8F8;
  --ink: #0F2A30;
  --muted: #5C7278;
  --line: #E3EAEB;
  font-family: 'Manrope', sans-serif;
  color: var(--ink);
  background: var(--cream);
  min-height: 100vh;
}
.mod-app * { box-sizing: border-box; }
.mod-app button { font-family: inherit; cursor: pointer; }
.mod-app button:disabled { opacity: .5; cursor: not-allowed; }
.mod-app button:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }

.mod-header { background: #EEF4F5; border-bottom: 1px solid var(--line); padding: 14px 24px; }
.mod-logo { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 8px; font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 18px; color: var(--dark-1); }
.mod-logo svg { color: var(--orange); }

.mod-section { padding: 32px 24px 80px; }
.mod-wrap { max-width: 720px; margin: 0 auto; }

.back-link { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--muted); font-weight: 700; font-size: 13.5px; margin-bottom: 16px; padding: 0; }
.back-link:hover { color: var(--dark-1); }

.page-title { font-family: 'Unbounded', sans-serif; font-size: 22px; margin: 0 0 18px; }

.empty-text { color: var(--muted); font-size: 13.5px; text-align: center; padding: 30px 0; }
.empty-text.error { color: #E0553F; }

.module-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
.module-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 6px; }
.module-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.module-title { font-weight: 800; font-size: 14.5px; }
.level-tag { background: rgba(15,57,65,0.08); color: var(--dark-1); font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
.module-meta { color: var(--muted); font-size: 12.5px; }
.module-desc { color: var(--ink); font-size: 12.5px; line-height: 1.4; margin-bottom: 6px; }
.module-video { display: flex; align-items: center; gap: 6px; color: var(--orange-dark); font-size: 12.5px; font-weight: 700; text-decoration: none; margin: 8px 0 4px; }
.module-video:hover { text-decoration: underline; }
.rec-badge { display: inline-block; background: rgba(245,166,35,0.14); color: var(--orange-dark); font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px; margin-top: 2px; }
.deadline-badge { display: inline-block; background: rgba(15,57,65,0.08); color: var(--dark-1); font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px; margin-top: 2px; width: fit-content; }
.deadline-badge.overdue { background: rgba(224,85,63,0.14); color: #E0553F; }
.completed-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(47,158,82,0.14); color: #2F9E52; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px; margin-top: 2px; width: fit-content; }
.module-card.completed { opacity: 0.85; }

.card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 28px; }
.card-title { font-family: 'Unbounded', sans-serif; font-size: 20px; margin: 0 0 6px; }
.card-title.center { text-align: center; }
.card-subtitle { color: var(--muted); font-size: 14px; margin: 0 0 14px; }
.card-subtitle.center { text-align: center; }

.content-blocks { display: flex; flex-direction: column; gap: 14px; margin: 18px 0 22px; }
.content-text { font-size: 14.5px; line-height: 1.6; color: var(--ink); margin: 0; white-space: pre-wrap; }
.content-image img { width: 100%; border-radius: 12px; display: block; }
.content-image figcaption { color: var(--muted); font-size: 12px; margin-top: 6px; text-align: center; }

.hint-text { color: var(--muted); font-size: 12.5px; margin-bottom: 14px; text-align: center; }

.progress-row { margin-bottom: 18px; }
.progress-label { font-size: 12.5px; font-weight: 700; color: var(--muted); }
.progress-bar { height: 6px; background: var(--line); border-radius: 999px; margin-top: 8px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--orange); border-radius: 999px; transition: width .3s ease; }

.question-text { font-family: 'Unbounded', sans-serif; font-size: 17px; font-weight: 600; line-height: 1.4; margin: 0 0 18px; }
.options-col { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.option { text-align: left; border: 1px solid var(--line); background: #FAFCFC; border-radius: 12px; padding: 13px 16px; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.option:hover { border-color: #cfd9da; }
.option.active { border-color: var(--orange); background: rgba(245,166,35,0.1); }

.btn { border-radius: 999px; font-weight: 700; padding: 12px 18px; font-size: 14.5px; border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.btn-solid { background: var(--orange); color: #26210a; }
.btn-solid:hover:not(:disabled) { background: #ffb63c; }
.btn-outline { background: transparent; border-color: var(--dark-1); color: var(--dark-1); }
.btn-outline:hover:not(:disabled) { background: rgba(15,57,65,0.06); }
.btn-block { width: 100%; text-align: center; }

.done-card { text-align: center; }
.done-icon { width: 56px; height: 56px; border-radius: 999px; background: rgba(245,166,35,0.16); color: var(--orange-dark); display: flex; align-items: center; justify-content: center; margin: 4px auto 18px; }
.xp-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(47,158,82,0.12); color: #2F9E52; font-weight: 800; font-size: 14px; padding: 8px 16px; border-radius: 999px; margin: 4px auto 8px; }
.levelup-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(245,166,35,0.14); color: var(--orange-dark); font-weight: 800; font-size: 13.5px; padding: 8px 16px; border-radius: 999px; margin: 0 auto 20px; }

@media (max-width: 640px) { .card { padding: 20px; } }
`;