import React, { useState } from "react";
import {
  Sun,
  Home,
  LayoutGrid,
  Bot,
  LogOut,
  Zap,
  Coins,
  Flame,
  Gauge,
  Bell,
  Trophy,
  Target,
  Map as MapIcon,
  Award,
  Pencil,
  Check,
  X,
  Star,
  Lock,
} from "lucide-react";

// Achievement tiers. Streak and module-count achievements share the same
// step sequence; the 100%-module achievement is a single one-off unlock.
const STREAK_TIERS = [1, 3, 5, 10, 20, 50, 100];
const MODULE_TIERS = [1, 3, 5, 10, 20, 50, 100];

const LANGS = [
  { code: "kk", label: "KK" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

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
    welcome: (name) => `С возвращением, ${name}`,
    navCabinet: "Кабинет",
    navModules: "Модули",
    navAI: "AI-ассистент",
    logout: "Выйти",
    statLevel: "Уровень",
    statXP: "Опыт (XP)",
    statCoins: "Монеты",
    statStreak: "Дней подряд",
    levelLabel: (lvl, xp, next) => `Level ${lvl} (${xp}/${next} XP)`,
    levelSubtitle: (grade, subjNames) => (subjNames ? `${subjNames} · ${grade} класс` : `${grade} класс`),
    weakTitle: "Слабые темы",
    weakHint: "На основе диагностики",
    weakEmpty: "Пройдите диагностику, чтобы увидеть свои темы.",
    deadlinesTitle: "Дедлайны и повторения",
    deadlinesEmpty: "Пока нет активных дедлайнов.",
    deadlineOverdue: "Просрочено",
    deadlineToday: "Сегодня",
    deadlineDaysLeft: (n) => `Осталось ${n} дн.`,
    achievementsTitle: "Достижения",
    achievementsEmpty: "Пока нет достижений — они появятся по мере прохождения заданий.",
    achievementStreak: (n) => `${n} ${n === 1 ? "день" : "дней"} подряд`,
    achievementModules: (n) => `${n} ${n === 1 ? "модуль" : "модулей"} пройдено`,
    achievementPerfect: "Модуль на 100%",
    achievementLocked: "Ещё не открыто",
    goalTitle: "Цель",
    goalEmpty: "Цель ещё не выбрана.",
    setGoal: "Задать цель",
    editGoal: "Изменить",
    goalPlaceholder: "Например: сдать ЕНТ на 120+ баллов",
    goalSave: "Сохранить",
    goalCancel: "Отмена",
    roadmapTitle: "План подготовки (roadmap)",
    roadmapEmpty: "План появится после того, как накопится больше данных о ваших результатах.",
    roadmapStage: { foundations: "Основы темы", practice: "Практика и разбор ошибок", review: "Закрепление и повторение" },
    roadmapPct: (pct) => `Текущий результат: ${pct}%`,
    goToTasks: "Перейти к заданиям",
    competitionsTitle: "Олимпиады и конкурсы",
    competitionsEmpty: "Пока нет конкурсов по вашим предметам.",
  },
  kk: {
    welcome: (name) => `Қайта келуіңізбен, ${name}`,
    navCabinet: "Кабинет",
    navModules: "Модульдер",
    navAI: "ЖИ-көмекші",
    logout: "Шығу",
    statLevel: "Деңгей",
    statXP: "Тәжірибе (XP)",
    statCoins: "Монеталар",
    statStreak: "Қатарынан күн",
    levelLabel: (lvl, xp, next) => `Level ${lvl} (${xp}/${next} XP)`,
    levelSubtitle: (grade, subjNames) => (subjNames ? `${subjNames} · ${grade} сынып` : `${grade} сынып`),
    weakTitle: "Әлсіз тақырыптар",
    weakHint: "Диагностика негізінде",
    weakEmpty: "Тақырыптарыңызды көру үшін диагностикадан өтіңіз.",
    deadlinesTitle: "Мерзімдер мен қайталаулар",
    deadlinesEmpty: "Әзірге белсенді мерзімдер жоқ.",
    deadlineOverdue: "Мерзімі өтті",
    deadlineToday: "Бүгін",
    deadlineDaysLeft: (n) => `${n} күн қалды`,
    achievementsTitle: "Жетістіктер",
    achievementsEmpty: "Әзірге жетістіктер жоқ — олар тапсырмаларды орындаған сайын пайда болады.",
    achievementStreak: (n) => `${n} күн қатарынан`,
    achievementModules: (n) => `${n} модуль өтілді`,
    achievementPerfect: "Модуль 100%-ға",
    achievementLocked: "Әлі ашылмаған",
    goalTitle: "Мақсат",
    goalEmpty: "Мақсат әлі таңдалмаған.",
    setGoal: "Мақсат қою",
    editGoal: "Өзгерту",
    goalPlaceholder: "Мысалы: ҰБТ-да 120+ балл алу",
    goalSave: "Сақтау",
    goalCancel: "Бас тарту",
    roadmapTitle: "Дайындық жоспары (roadmap)",
    roadmapEmpty: "Нәтижелеріңіз туралы деректер жиналған соң жоспар пайда болады.",
    roadmapStage: { foundations: "Тақырып негіздері", practice: "Практика және қателерді талдау", review: "Бекіту және қайталау" },
    roadmapPct: (pct) => `Ағымдағы нәтиже: ${pct}%`,
    goToTasks: "Тапсырмаларға өту",
    competitionsTitle: "Олимпиадалар мен конкурстар",
    competitionsEmpty: "Әзірге пәндеріңіз бойынша конкурстар жоқ.",
  },
  en: {
    welcome: (name) => `Welcome back, ${name}`,
    navCabinet: "Dashboard",
    navModules: "Modules",
    navAI: "AI assistant",
    logout: "Log out",
    statLevel: "Level",
    statXP: "XP",
    statCoins: "Coins",
    statStreak: "Day streak",
    levelLabel: (lvl, xp, next) => `Level ${lvl} (${xp}/${next} XP)`,
    levelSubtitle: (grade, subjNames) => (subjNames ? `${subjNames} · grade ${grade}` : `grade ${grade}`),
    weakTitle: "Weak topics",
    weakHint: "Based on diagnostics",
    weakEmpty: "Take the diagnostics quiz to see your topics.",
    deadlinesTitle: "Deadlines & reviews",
    deadlinesEmpty: "No active deadlines yet.",
    deadlineOverdue: "Overdue",
    deadlineToday: "Today",
    deadlineDaysLeft: (n) => `${n} day${n === 1 ? "" : "s"} left`,
    achievementsTitle: "Achievements",
    achievementsEmpty: "No achievements yet — they'll appear as you complete tasks.",
    achievementStreak: (n) => `${n}-day streak`,
    achievementModules: (n) => `${n} module${n === 1 ? "" : "s"} completed`,
    achievementPerfect: "100% module",
    achievementLocked: "Not unlocked yet",
    goalTitle: "Goal",
    goalEmpty: "No goal set yet.",
    setGoal: "Set a goal",
    editGoal: "Edit",
    goalPlaceholder: "E.g. score 120+ on UNT",
    goalSave: "Save",
    goalCancel: "Cancel",
    roadmapTitle: "Prep roadmap",
    roadmapEmpty: "Your plan will appear once there's more data on your results.",
    roadmapStage: { foundations: "Core fundamentals", practice: "Practice and error review", review: "Consolidation and review" },
    roadmapPct: (pct) => `Current score: ${pct}%`,
    goToTasks: "Go to tasks",
    competitionsTitle: "Olympiads & competitions",
    competitionsEmpty: "No competitions for your subjects yet.",
  },
};

function pctColor(pct) {
  if (pct >= 80) return "green";
  if (pct >= 50) return "orange";
  return "red";
}

export default function CabinetPage({
  lang = "ru",
  onChangeLang = () => {},
  user = "",
  grade,
  subjects = [],
  subjectResults = [],
  xp = 0,
  coins = 0,
  level = 1,
  streak = 1,
  maxStreak = 1,
  modulesCompleted = 0,
  perfectModuleCompleted = false,
  deadlines = [],
  goal = "",
  onSetGoal = () => {},
  competitions = [],
  roadmap = [],
  onNavigate = () => {},
  onLogout = () => {},
  onGoToTasks = () => {},
}) {
  const t = T[lang] || T.ru;
  const langKey = lang === "kk" ? "kk" : lang === "en" ? "en" : "ru";

  // Build the achievement list from raw stats: streak/module tiers unlock
  // once the best-ever value reaches that step, the 100% badge unlocks
  // the first time a module is finished with a perfect quiz score.
  const achievements = [
    ...STREAK_TIERS.map((n) => ({
      key: `streak-${n}`,
      icon: Flame,
      label: t.achievementStreak(n),
      unlocked: maxStreak >= n,
    })),
    ...MODULE_TIERS.map((n) => ({
      key: `modules-${n}`,
      icon: Trophy,
      label: t.achievementModules(n),
      unlocked: modulesCompleted >= n,
    })),
    {
      key: "perfect",
      icon: Star,
      label: t.achievementPerfect,
      unlocked: !!perfectModuleCompleted,
    },
  ];

  const todayIso = (() => {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  })();
  const daysUntil = (dateStr) => {
    const ms = new Date(dateStr + "T00:00:00") - new Date(todayIso + "T00:00:00");
    return Math.round(ms / 86400000);
  };

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(goal);

  const startEditGoal = () => {
    setGoalDraft(goal);
    setEditingGoal(true);
  };
  const saveGoal = () => {
    onSetGoal(goalDraft.trim());
    setEditingGoal(false);
  };

  const displayEmail = user || "";
  const friendlyName = displayEmail.includes("@") ? displayEmail.split("@")[0] : displayEmail || "—";

  const subjectLabel = (key) => SUBJECTS.find((s) => s.key === key)?.[langKey] || key;
  const subjNames = subjects.map(subjectLabel).join(", ");

  const XP_PER_LEVEL = 100;
  const xpInLevel = xp % XP_PER_LEVEL;

  const navItems = [
    { key: "cabinet", label: t.navCabinet, icon: Home, active: true },
    { key: "modules", label: t.navModules, icon: LayoutGrid, active: false },
    { key: "ai", label: t.navAI, icon: Bot, active: false },
  ];

  return (
    <div className="cab-app">
      <style>{CSS}</style>

      <aside className="sidebar">
        <div className="sb-logo">
          <Sun size={20} strokeWidth={2.4} />
          <span>Bilim Jol</span>
        </div>

        <nav className="sb-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                className={"sb-item" + (item.active ? " active" : "")}
                onClick={() => (item.active ? null : onNavigate(item.key))}
              >
                <Icon size={17} strokeWidth={2.2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sb-bottom">
          <div className="sb-lang-switch">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={"sb-lang-chip" + (lang === l.code ? " active" : "")}
                onClick={() => onChangeLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="sb-user">
            <div className="sb-avatar">{friendlyName.charAt(0).toUpperCase()}</div>
            <div className="sb-user-text">
              <div className="sb-user-name" title={displayEmail}>
                {displayEmail || "—"}
              </div>
            </div>
          </div>
          <button type="button" className="sb-logout" onClick={onLogout}>
            <LogOut size={16} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <h1 className="topbar-title">{t.welcome(friendlyName)} 👋</h1>
          <div className="topbar-pills">
            <div className="pill">
              <Zap size={14} strokeWidth={2.4} />
              <span>{xp} XP · Lv.{level}</span>
            </div>
            <div className="pill">
              <Coins size={14} strokeWidth={2.4} />
              <span>{coins}</span>
            </div>
            <div className="pill">
              <Flame size={14} strokeWidth={2.4} />
              <span>{streak}</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t.statLevel}</div>
            <div className="stat-value">{level}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t.statXP}</div>
            <div className="stat-value">{xp}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t.statCoins}</div>
            <div className="stat-value">{coins}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t.statStreak}</div>
            <div className="stat-value">
              {streak} <span className="flame">🔥</span>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="col-main">
            <div className="card">
              <div className="level-head">
                <Zap size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="level-label">{t.levelLabel(level, xpInLevel, XP_PER_LEVEL)}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (xpInLevel / XP_PER_LEVEL) * 100)}%` }} />
              </div>
              <div className="level-sub">{t.levelSubtitle(grade, subjNames)}</div>
            </div>

            <div className="card">
              <div className="card-head">
                <Gauge size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="card-head-title">{t.weakTitle}</span>
              </div>
              <div className="card-hint">{t.weakHint}</div>

              {subjects.length === 0 && <div className="empty-text">{t.weakEmpty}</div>}

              {subjects.length > 0 && (
                <div className="weak-list">
                  {subjects.map((key) => {
                    const result = subjectResults.find((r) => r.subjectKey === key);
                    const pct = result && result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
                    const color = pctColor(pct);
                    return (
                      <div className="weak-row" key={key}>
                        <span className="weak-name">{subjectLabel(key)}</span>
                        <div className="weak-bar-track">
                          <div className={"weak-bar-fill " + color} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={"weak-pct " + color}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-head">
                <MapIcon size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="card-head-title">{t.roadmapTitle}</span>
              </div>
              {roadmap.length === 0 && <div className="empty-text">{t.roadmapEmpty}</div>}
              {roadmap.length > 0 && (
                <div className="roadmap-list">
                  {roadmap.map((step, i) => {
                    const color = pctColor(step.pct);
                    return (
                      <div className="roadmap-row" key={step.subjectKey}>
                        <div className={"roadmap-num " + color}>{i + 1}</div>
                        <div className="roadmap-body">
                          <div className="roadmap-top">
                            <span className="roadmap-subject">{subjectLabel(step.subjectKey)}</span>
                            <span className={"roadmap-pct " + color}>{step.pct}%</span>
                          </div>
                          <div className="roadmap-stage">{t.roadmapStage[step.stage]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="col-side">
            <div className="card">
              <div className="card-head">
                <Bell size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="card-head-title">{t.deadlinesTitle}</span>
              </div>
              {deadlines.length === 0 ? (
                <div className="empty-text">{t.deadlinesEmpty}</div>
              ) : (
                <div className="deadline-list">
                  {deadlines.map((d) => {
                    const diff = daysUntil(d.deadline);
                    const status = diff < 0 ? "overdue" : diff === 0 ? "today" : "upcoming";
                    const dateObj = new Date(d.deadline + "T00:00:00");
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleDateString(langKey === "en" ? "en-US" : langKey, { month: "short" });
                    return (
                      <div className="deadline-row" key={d.moduleId}>
                        <div className={"deadline-date " + status}>
                          <span className="deadline-day">{day}</span>
                          <span className="deadline-month">{month}</span>
                        </div>
                        <div className="deadline-info">
                          <div className="deadline-module-title">{d.title}</div>
                          {d.subject && <div className="deadline-subject">{subjectLabel(d.subject)}</div>}
                        </div>
                        <span className={"deadline-status " + status}>
                          {status === "overdue"
                            ? t.deadlineOverdue
                            : status === "today"
                            ? t.deadlineToday
                            : t.deadlineDaysLeft(diff)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-head">
                <Trophy size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="card-head-title">{t.achievementsTitle}</span>
              </div>
              <div className="achievements-grid">
                {achievements.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      className={"achievement-badge" + (a.unlocked ? " unlocked" : "")}
                      key={a.key}
                      title={a.unlocked ? a.label : t.achievementLocked}
                    >
                      <div className="achievement-icon">
                        {a.unlocked ? <Icon size={18} strokeWidth={2.4} /> : <Lock size={16} strokeWidth={2.2} />}
                      </div>
                      <span className="achievement-label">{a.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <Target size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="card-head-title">{t.goalTitle}</span>
              </div>

              {editingGoal ? (
                <>
                  <textarea
                    className="goal-input"
                    rows={3}
                    placeholder={t.goalPlaceholder}
                    value={goalDraft}
                    onChange={(e) => setGoalDraft(e.target.value)}
                  />
                  <div className="goal-actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditingGoal(false)}>
                      <X size={13} /> {t.goalCancel}
                    </button>
                    <button type="button" className="btn btn-solid btn-sm" onClick={saveGoal}>
                      <Check size={13} /> {t.goalSave}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {goal ? <div className="goal-text">{goal}</div> : <div className="empty-text">{t.goalEmpty}</div>}
                  <button type="button" className="btn btn-outline btn-block" onClick={startEditGoal}>
                    {goal ? (
                      <>
                        <Pencil size={13} /> {t.editGoal}
                      </>
                    ) : (
                      t.setGoal
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="card">
              <div className="card-head">
                <Award size={16} strokeWidth={2.4} className="accent-icon" />
                <span className="card-head-title">{t.competitionsTitle}</span>
              </div>
              {competitions.length === 0 ? (
                <div className="empty-text">{t.competitionsEmpty}</div>
              ) : (
                <div className="competitions-list">
                  {competitions.map((c) => (
                    <div className="competition-row" key={c.id}>
                      <div className="competition-title">{c.title}</div>
                      <div className="competition-subject">{subjectLabel(c.subject)}</div>
                      {c.event_date && <div className="competition-date">{c.event_date}</div>}
                      {c.description && <div className="competition-desc">{c.description}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="button" className="btn btn-solid btn-block btn-tasks" onClick={onGoToTasks}>
              {t.goToTasks}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.cab-app {
  --dark-1: #0F3941;
  --dark-2: #0A2A31;
  --orange: #F5A623;
  --orange-dark: #DE9312;
  --cream: #F6F8F8;
  --ink: #0F2A30;
  --muted: #5C7278;
  --line: #E3EAEB;
  --green: #2F9E52;
  --red: #E0553F;
  font-family: 'Manrope', sans-serif;
  color: var(--ink);
  min-height: 100vh;
  display: flex;
}
.cab-app * { box-sizing: border-box; }
.cab-app button { font-family: inherit; cursor: pointer; }
.cab-app button:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }

/* ---------- sidebar ---------- */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--dark-1);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  min-height: 100vh;
}
.sb-logo {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 15.5px;
  padding: 6px 8px 22px;
  color: #fff;
}
.sb-logo svg { color: var(--orange); }

.sb-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sb-item {
  display: flex; align-items: center; gap: 10px;
  background: none; border: none; color: rgba(255,255,255,0.78);
  padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 600;
  text-align: left;
}
.sb-item:hover { background: rgba(255,255,255,0.06); }
.sb-item.active { background: var(--orange); color: #26210a; }

.sb-bottom { border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; margin-top: 14px; }
.sb-lang-switch { display: flex; gap: 4px; padding: 0 8px 12px; }
.sb-lang-chip {
  flex: 1; background: rgba(255,255,255,0.06); border: none; color: rgba(255,255,255,0.7);
  border-radius: 8px; padding: 6px 0; font-size: 11.5px; font-weight: 800;
}
.sb-lang-chip.active { background: var(--orange); color: #26210a; }
.sb-user { display: flex; align-items: center; gap: 10px; padding: 4px 8px 10px; }
.sb-avatar {
  width: 30px; height: 30px; border-radius: 999px;
  background: var(--orange); color: #26210a;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 13px; flex-shrink: 0;
}
.sb-user-text { overflow: hidden; }
.sb-user-name {
  font-size: 12.5px; font-weight: 700; color: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sb-logout {
  display: flex; align-items: center; gap: 8px; width: 100%;
  background: none; border: none; color: rgba(255,255,255,0.65);
  padding: 8px; border-radius: 10px; font-size: 13px; font-weight: 600;
}
.sb-logout:hover { background: rgba(255,255,255,0.06); color: #fff; }

/* ---------- main ---------- */
.main { flex: 1; background: var(--cream); padding: 28px 32px 60px; min-width: 0; }

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin-bottom: 22px;
}
.topbar-title {
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 21px; margin: 0;
}
.topbar-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid var(--line);
  border-radius: 999px; padding: 6px 12px;
  font-size: 12.5px; font-weight: 700; color: var(--ink);
}
.pill svg { color: var(--orange-dark); }

.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px;
}
.stat-card {
  background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px;
}
.stat-label { color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 8px; }
.stat-value { font-family: 'Unbounded', sans-serif; font-size: 24px; font-weight: 700; }
.flame { font-size: 16px; }

.content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; align-items: start; }
.col-main, .col-side { display: flex; flex-direction: column; gap: 18px; }

.card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 22px; }
.card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.card-head-title { font-weight: 800; font-size: 15px; }
.card-hint { color: var(--muted); font-size: 12.5px; margin-bottom: 16px; }
.accent-icon { color: var(--orange-dark); flex-shrink: 0; }

.level-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.level-label { font-weight: 800; font-size: 15px; }
.level-sub { color: var(--muted); font-size: 12.5px; margin-top: 10px; }

.progress-bar { height: 8px; background: var(--line); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--orange); border-radius: 999px; transition: width .3s ease; }

.empty-text { color: var(--muted); font-size: 13.5px; line-height: 1.5; }

.weak-list { display: flex; flex-direction: column; gap: 12px; }
.weak-row { display: grid; grid-template-columns: 140px 1fr 44px; align-items: center; gap: 12px; }
.weak-name { font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.weak-bar-track { height: 7px; background: var(--line); border-radius: 999px; overflow: hidden; }
.weak-bar-fill { height: 100%; border-radius: 999px; }
.weak-bar-fill.green { background: var(--green); }
.weak-bar-fill.orange { background: var(--orange); }
.weak-bar-fill.red { background: var(--red); }
.weak-pct { font-size: 12.5px; font-weight: 800; text-align: right; }
.weak-pct.green { color: var(--green); }
.weak-pct.orange { color: var(--orange-dark); }
.weak-pct.red { color: var(--red); }

.roadmap-list { display: flex; flex-direction: column; gap: 14px; }
.roadmap-row { display: flex; gap: 12px; align-items: flex-start; }
.roadmap-num {
  width: 26px; height: 26px; border-radius: 999px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff; background: var(--muted);
}
.roadmap-num.green { background: var(--green); }
.roadmap-num.orange { background: var(--orange); }
.roadmap-num.red { background: var(--red); }
.roadmap-body { flex: 1; min-width: 0; }
.roadmap-top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.roadmap-subject { font-size: 13.5px; font-weight: 700; }
.roadmap-pct { font-size: 12px; font-weight: 800; }
.roadmap-pct.green { color: var(--green); }
.roadmap-pct.orange { color: var(--orange-dark); }
.roadmap-pct.red { color: var(--red); }
.roadmap-stage { font-size: 12.5px; color: var(--muted); margin-top: 2px; }

.btn { border-radius: 999px; font-weight: 700; padding: 11px 18px; font-size: 13.5px; border: 1px solid transparent; }
.btn-solid { background: var(--orange); color: #26210a; }
.btn-solid:hover { background: #ffb63c; }
.btn-outline { background: transparent; border-color: var(--dark-1); color: var(--dark-1); }
.btn-outline:hover { background: rgba(15,57,65,0.06); }
.btn-block { width: 100%; text-align: center; margin-top: 14px; }
.btn-tasks { margin-top: 0; padding: 14px 18px; font-size: 14.5px; background: var(--dark-1); color: #fff; }
.btn-tasks:hover { background: var(--dark-2); }
.btn-sm { padding: 8px 14px; font-size: 12.5px; margin-top: 0; width: auto; display: inline-flex; align-items: center; gap: 6px; }

.goal-input {
  width: 100%; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px;
  font-size: 13.5px; font-family: inherit; color: var(--ink); background: #FAFCFC; resize: vertical;
}
.goal-input:focus { border-color: var(--orange); background: #fff; }
.goal-text { font-size: 13.5px; line-height: 1.5; color: var(--ink); margin-bottom: 4px; }
.goal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }

.deadline-list { display: flex; flex-direction: column; gap: 10px; }
.deadline-row { display: grid; grid-template-columns: 44px 1fr auto; align-items: center; gap: 10px; border: 1px solid var(--line); border-radius: 12px; padding: 8px 10px; }
.deadline-date { display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--cream); border-radius: 10px; padding: 4px 0; line-height: 1.1; }
.deadline-date.overdue { background: rgba(224,85,63,0.12); }
.deadline-date.today { background: rgba(245,166,35,0.16); }
.deadline-day { font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); }
.deadline-month { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
.deadline-info { min-width: 0; }
.deadline-module-title { font-weight: 800; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.deadline-subject { color: var(--muted); font-size: 11.5px; margin-top: 2px; }
.deadline-status { font-size: 11px; font-weight: 800; white-space: nowrap; color: var(--dark-1); }
.deadline-status.overdue { color: var(--red); }
.deadline-status.today { color: var(--orange-dark); }

.achievements-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.achievement-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border: 1px solid var(--line); border-radius: 12px; padding: 10px 6px; background: var(--cream); opacity: .55; }
.achievement-badge.unlocked { opacity: 1; border-color: rgba(245,166,35,0.4); background: rgba(245,166,35,0.08); }
.achievement-icon { width: 30px; height: 30px; border-radius: 999px; background: #fff; color: var(--muted); display: flex; align-items: center; justify-content: center; }
.achievement-badge.unlocked .achievement-icon { background: var(--orange); color: #26210a; }
.achievement-label { font-size: 10px; font-weight: 700; color: var(--muted); line-height: 1.25; }
.achievement-badge.unlocked .achievement-label { color: var(--ink); }

.competitions-list { display: flex; flex-direction: column; gap: 10px; }
.competition-row { border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; }
.competition-title { font-weight: 800; font-size: 13.5px; }
.competition-subject { color: var(--orange-dark); font-size: 12px; font-weight: 700; margin-top: 2px; }
.competition-date { color: var(--muted); font-size: 11.5px; font-weight: 700; margin-top: 2px; }
.competition-desc { color: var(--muted); font-size: 12.5px; margin-top: 4px; line-height: 1.4; }

@media (max-width: 980px) {
  .content-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 720px) {
  .cab-app { flex-direction: column; }
  .sidebar { width: 100%; min-height: auto; flex-direction: row; align-items: center; padding: 12px 16px; }
  .sb-logo { padding: 0; margin-right: 16px; }
  .sb-nav { flex-direction: row; flex: 1; }
  .sb-bottom { display: none; }
  .main { padding: 20px 16px 48px; }
}
`;