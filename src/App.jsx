import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import DiagnosticsPage from "./Diagnostics";
import CabinetPage from "./Cabinet";
import AdminPanel from "./AdminPanel";
import ModulesPage from "./Modules";
import AiPage from "./AiPage";
import {
  Sun,
  Gauge,
  ListChecks,
  Bot,
  BarChart3,
  Trophy,
  Send,
  Map as MapIcon,
  Check,
  ArrowLeft,
  ShieldCheck,
  Coins,
} from "lucide-react";

const LANGS = [
  { code: "kk", label: "Қазақша" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
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

const GRADES = [7, 8, 9, 10, 11, 12];

const FEATURES = [
  {
    icon: Gauge,
    ru: { title: "Быстрая диагностика", desc: "Короткий тест — и через 10 минут вы знаете свой реальный уровень по каждому предмету." },
    kk: { title: "Жылдам диагностика", desc: "Қысқа тесттен өтіп, 10 минутта әр пән бойынша нақты деңгейіңізді біліңіз." },
    en: { title: "Fast diagnostics", desc: "Take a short test and find your real level in every subject in 10 minutes." },
  },
  {
    icon: ListChecks,
    ru: { title: "Персональные задания", desc: "Задания подстраиваются под уровень и закрывают именно ваши пробелы." },
    kk: { title: "Жеке тапсырмалар", desc: "Тапсырмалар деңгейіңізге бейімделіп, дәл сіздің олқылықтарыңызды жабады." },
    en: { title: "Personalized tasks", desc: "Tasks adapt to your level and target the exact gaps you have." },
  },
  {
    icon: Bot,
    ru: { title: "AI-ассистент", desc: "Задайте вопрос по теме в любое время и получите понятное объяснение." },
    kk: { title: "ЖИ-көмекші", desc: "Кез келген уақытта тақырып бойынша сұрақ қойып, түсінікті түсініктеме алыңыз." },
    en: { title: "AI assistant", desc: "Ask a question about any topic anytime and get a clear explanation." },
  },
  {
    icon: BarChart3,
    ru: { title: "Панель личного прогресса", desc: "Динамика по каждому предмету и слабые темы — как на ладони." },
    kk: { title: "Жеке прогресс тақтасы", desc: "Әр пән бойынша динамика мен әлсіз тақырыптар көз алдыңызда." },
    en: { title: "Personal progress dashboard", desc: "See your trend in every subject and the weak topics at a glance." },
  },
  {
    icon: Trophy,
    ru: { title: "Геймификация", desc: "Баллы, уровни и достижения не дают бросить подготовку на полпути." },
    kk: { title: "Геймификация", desc: "Ұпайлар, деңгейлер мен жетістіктер дайындықты жартылай тастатпайды." },
    en: { title: "Gamification", desc: "Points, levels and achievements keep you from quitting halfway through." },
  },
  {
    icon: Send,
    ru: { title: "Telegram-бот", desc: "Напоминания о дедлайнах олимпиад и заданий приходят прямо в Telegram." },
    kk: { title: "Telegram-бот", desc: "Олимпиада мен тапсырма мерзімдері туралы еске салулар Telegram-ға келеді." },
    en: { title: "Telegram bot", desc: "Deadline reminders for olympiads and tasks land straight in Telegram." },
  },
  {
    icon: MapIcon,
    ru: { title: "Личный роадмап", desc: "Пошаговый план подготовки до экзамена под ваши цели и сроки." },
    kk: { title: "Жеке роадмап", desc: "Мақсаттарыңыз бен мерзіміңізге сай емтиханға дейінгі қадамдық жоспар." },
    en: { title: "Personal roadmap", desc: "A step-by-step prep plan to exam day, built around your goals and timeline." },
  },
];

const T = {
  ru: {
    eyebrow: "ПЛАТФОРМА ПОДГОТОВКИ",
    headline: "Одинаковый шанс поступить — независимо от школы и региона",
    subtext:
      "Bilim Jol выравнивает качество подготовки: диагностика уровня, персональные задания, ИИ-помощник и напоминания о дедлайнах — для учеников 7–12 классов по всему Казахстану.",
    navRegister: "Зарегистрироваться",
    navLogin: "Войти",
    heroPrimary: "Начать бесплатно",
    heroSecondary: "У меня есть аккаунт",
    featEyebrow: "ВОЗМОЖНОСТИ",
    featTitle: "Всё для системной подготовки",
    featSubtitle: "От диагностики до поступления — один понятный маршрут.",
    ctaTitle: "Готовы узнать свой уровень?",
    ctaText: "Регистрация занимает меньше минуты.",
    footerNote: "Платформа подготовки для учеников 7–12 классов.",
    regTitle: "Создать аккаунт",
    regSubtitle: "Регистрируйтесь по email — сможете зайти снова с этим же паролем.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    gradeLabel: "Класс",
    subjectsLabel: "Предметы подготовки",
    subjectsHint: "Можно выбрать несколько предметов",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Минимум 6 символов",
    regSubmit: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    loginLink: "Войти",
    loginTitle: "Вход в аккаунт",
    loginSubtitle: "Введите email и пароль, чтобы продолжить подготовку.",
    loginLabel: "Email или логин",
    loginSubmit: "Войти",
    noAccount: "Нет аккаунта?",
    registerLink: "Зарегистрироваться",
    backHome: "На главную",
    goDiagnostics: "Перейти на диагностику",
    goCabinet: "Перейти в кабинет",
    errEmail: "Введите корректный email",
    errGrade: "Выберите класс",
    errSubjects: "Выберите хотя бы один предмет",
    errPassword: "Пароль должен содержать минимум 6 символов",
    errLogin: "Введите email или логин",
    errLoginPassword: "Введите пароль",
    errEmailTaken: "Этот email уже зарегистрирован — попробуйте войти.",
    errInvalidLogin: "Неверный email или пароль.",
    storageErr: "Не удалось сохранить данные. Попробуйте ещё раз.",
    savingText: "Сохраняем…",
    loggingText: "Входим…",
    profileGradeLabel: "Класс:",
    profileSubjectsLabel: "Предметы:",
    doneRegTitle: "Аккаунт создан и сохранён",
    doneRegText: "Добро пожаловать в Bilim Jol! Данные сохранены — панель диагностики появится здесь на следующем этапе разработки.",
    doneLoginTitle: "Вы вошли в аккаунт",
    doneLoginText: "Это ваши сохранённые данные. Панель с прогрессом и заданиями появится здесь на следующем этапе разработки.",
    doneAdminTitle: "Вход в панель администратора",
    doneAdminText: "Админ-панель ещё в разработке и будет добавлена отдельно.",
    coinToast: (n) => `Вам начислено ${n} ${n === 1 ? "монета" : n < 5 ? "монеты" : "монет"}`,
  },
  kk: {
    eyebrow: "ДАЙЫНДЫҚ ПЛАТФОРМАСЫ",
    headline: "Түсу мүмкіндігі бірдей — мектеп пен өңірге қарамастан",
    subtext:
      "Bilim Jol дайындық сапасын теңестіреді: деңгейді анықтау, жеке тапсырмалар, ЖИ-көмекші және мерзімдер туралы еске салулар — Қазақстан бойынша 7–12 сынып оқушыларына арналған.",
    navRegister: "Тіркелу",
    navLogin: "Кіру",
    heroPrimary: "Тегін бастау",
    heroSecondary: "Менде аккаунт бар",
    featEyebrow: "МҮМКІНДІКТЕР",
    featTitle: "Жүйелі дайындыққа қажеттінің бәрі",
    featSubtitle: "Диагностикадан түсуге дейін — бір түсінікті жол.",
    ctaTitle: "Деңгейіңізді білгіңіз келе ме?",
    ctaText: "Тіркелу бір минуттан аз уақыт алады.",
    footerNote: "7–12 сынып оқушыларына арналған дайындық платформасы.",
    regTitle: "Аккаунт жасау",
    regSubtitle: "Email арқылы тіркеліңіз — осы паролмен қайта кіре аласыз.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    gradeLabel: "Сынып",
    subjectsLabel: "Дайындық пәндері",
    subjectsHint: "Бірнеше пән таңдауға болады",
    passwordLabel: "Құпия сөз",
    passwordPlaceholder: "Кемінде 6 таңба",
    regSubmit: "Аккаунт жасау",
    haveAccount: "Аккаунтыңыз бар ма?",
    loginLink: "Кіру",
    loginTitle: "Аккаунтқа кіру",
    loginSubtitle: "Дайындықты жалғастыру үшін email және құпия сөзді енгізіңіз.",
    loginLabel: "Email немесе логин",
    loginSubmit: "Кіру",
    noAccount: "Аккаунтыңыз жоқ па?",
    registerLink: "Тіркелу",
    backHome: "Басты бетке",
    goDiagnostics: "Диагностикаға өту",
    goCabinet: "Кабинетке өту",
    errEmail: "Дұрыс email енгізіңіз",
    errGrade: "Сыныпты таңдаңыз",
    errSubjects: "Кемінде бір пән таңдаңыз",
    errPassword: "Құпия сөз кемінде 6 таңбадан тұруы керек",
    errLogin: "Email немесе логин енгізіңіз",
    errLoginPassword: "Құпия сөзді енгізіңіз",
    errEmailTaken: "Бұл email бұрын тіркелген — кіріп көріңіз.",
    errInvalidLogin: "Email немесе құпия сөз қате.",
    storageErr: "Деректерді сақтау мүмкін болмады. Қайталап көріңіз.",
    savingText: "Сақталуда…",
    loggingText: "Кірілуде…",
    profileGradeLabel: "Сынып:",
    profileSubjectsLabel: "Пәндер:",
    doneRegTitle: "Аккаунт жасалды және сақталды",
    doneRegText: "Bilim Jol-ға қош келдіңіз! Деректер сақталды — диагностика тақтасы келесі әзірлеу кезеңінде осы жерде пайда болады.",
    doneLoginTitle: "Аккаунтқа кірдіңіз",
    doneLoginText: "Бұл — сіздің сақталған деректеріңіз. Прогресс пен тапсырмалар тақтасы келесі кезеңде осы жерде пайда болады.",
    doneAdminTitle: "Әкімші тақтасына кіру",
    doneAdminText: "Әкімші тақтасы әлі әзірленуде, кейін бөлек қосылады.",
    coinToast: (n) => `Сізге ${n} монета есептелді`,
  },
  en: {
    eyebrow: "PREP PLATFORM",
    headline: "An equal chance to get in — no matter your school or region",
    subtext:
      "Bilim Jol levels the playing field: level diagnostics, personalized tasks, an AI assistant, and deadline reminders — for grade 7–12 students across Kazakhstan.",
    navRegister: "Sign up",
    navLogin: "Log in",
    heroPrimary: "Start for free",
    heroSecondary: "I already have an account",
    featEyebrow: "FEATURES",
    featTitle: "Everything for structured prep",
    featSubtitle: "From diagnostics to admission — one clear path.",
    ctaTitle: "Ready to find your level?",
    ctaText: "Signing up takes less than a minute.",
    footerNote: "A prep platform for grade 7–12 students.",
    regTitle: "Create an account",
    regSubtitle: "Sign up with your email — log back in with the same password.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    gradeLabel: "Grade",
    subjectsLabel: "Subjects to prepare for",
    subjectsHint: "You can select more than one",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 6 characters",
    regSubmit: "Create account",
    haveAccount: "Already have an account?",
    loginLink: "Log in",
    loginTitle: "Log in",
    loginSubtitle: "Enter your email and password to keep preparing.",
    loginLabel: "Email or login",
    loginSubmit: "Log in",
    noAccount: "Don't have an account?",
    registerLink: "Sign up",
    backHome: "Back to home",
    goDiagnostics: "Go to diagnostics",
    goCabinet: "Go to dashboard",
    errEmail: "Enter a valid email",
    errGrade: "Select a grade",
    errSubjects: "Select at least one subject",
    errPassword: "Password must be at least 6 characters",
    errLogin: "Enter an email or login",
    errLoginPassword: "Enter a password",
    errEmailTaken: "This email is already registered — try logging in.",
    errInvalidLogin: "Incorrect email or password.",
    storageErr: "Couldn't save your data. Please try again.",
    savingText: "Saving…",
    loggingText: "Signing in…",
    profileGradeLabel: "Grade:",
    profileSubjectsLabel: "Subjects:",
    doneRegTitle: "Account created and saved",
    doneRegText: "Welcome to Bilim Jol! Your data is saved — the diagnostics dashboard will appear here in the next build.",
    doneLoginTitle: "You're logged in",
    doneLoginText: "This is your saved data. The progress and tasks dashboard will appear here in the next build.",
    doneAdminTitle: "Admin panel access",
    doneAdminText: "The admin panel is still in development and will be added separately.",
    coinToast: (n) => `You earned ${n} coin${n === 1 ? "" : "s"}`,
  },
};

const GATE_TEXT = [
  { code: "kk", title: "Тілді таңдаңыз" },
  { code: "ru", title: "Выберите язык" },
  { code: "en", title: "Choose your language" },
];

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// Returns today's date as YYYY-MM-DD (local calendar day), used for both
// streak bookkeeping and the diagnostics/registration "day" comparisons.
function todayStr() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function yesterdayStr(fromToday) {
  const d = new Date(fromToday + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// Achievement tiers — kept in sync with the tiers Cabinet.jsx uses to
// render the achievements grid, so "unlocked" here means the exact same
// thing as "shown as unlocked" there.
const STREAK_TIERS = [1, 3, 5, 10, 20, 50, 100];
const MODULE_TIERS = [1, 3, 5, 10, 20, 50, 100];
const COINS_PER_ACHIEVEMENT = 3;

function computeUnlockedAchievementKeys({ maxStreak, modulesCompleted, perfectModuleCompleted }) {
  const keys = [];
  STREAK_TIERS.forEach((n) => {
    if ((maxStreak || 0) >= n) keys.push(`streak-${n}`);
  });
  MODULE_TIERS.forEach((n) => {
    if ((modulesCompleted || 0) >= n) keys.push(`modules-${n}`);
  });
  if (perfectModuleCompleted) keys.push("perfect");
  return keys;
}

// Compares the achievement keys already recorded as unlocked against what
// the current stats now unlock, returning just the newly-crossed ones —
// these are the only ones that should ever earn coins.
function diffNewlyUnlocked(previouslyUnlocked, stats) {
  const nowUnlocked = computeUnlockedAchievementKeys(stats);
  return nowUnlocked.filter((k) => !previouslyUnlocked.includes(k));
}

// Recomputes the login streak for a user based on the last day they were
// active. Same-day logins are idempotent (streak unchanged), a login on
// the very next calendar day increments the streak, and any bigger gap
// resets it back to 1. Persists the result and returns it. A streak that
// crosses an achievement tier just by logging in (e.g. day 3 in a row)
// also earns its coins here, in the same update.
async function updateStreakForUser(userId, previous) {
  const today = todayStr();
  const last = previous.last_active_date;

  let newStreak;
  if (last === today) {
    newStreak = previous.streak || 1;
  } else if (last === yesterdayStr(today)) {
    newStreak = (previous.streak || 1) + 1;
  } else {
    newStreak = 1;
  }

  // max_streak is the best streak the student has ever reached — it only
  // ever goes up, so streak-based achievements stay unlocked even after
  // the current streak later resets.
  const newMaxStreak = Math.max(previous.max_streak || previous.streak || 1, newStreak);

  const previouslyUnlocked = previous.unlocked_achievements || [];
  const newlyUnlocked = diffNewlyUnlocked(previouslyUnlocked, {
    maxStreak: newMaxStreak,
    modulesCompleted: previous.modules_completed || 0,
    perfectModuleCompleted: !!previous.perfect_module_completed,
  });
  const achievementCoinsGained = newlyUnlocked.length * COINS_PER_ACHIEVEMENT;
  const newUnlockedAchievements = newlyUnlocked.length
    ? [...previouslyUnlocked, ...newlyUnlocked]
    : previouslyUnlocked;
  const newCoins = (previous.coins || 0) + achievementCoinsGained;

  const { error } = await supabase
    .from("profiles")
    .update({
      streak: newStreak,
      last_active_date: today,
      max_streak: newMaxStreak,
      coins: newCoins,
      unlocked_achievements: newUnlockedAchievements,
    })
    .eq("id", userId);
  if (error) throw error;

  return {
    streak: newStreak,
    last_active_date: today,
    max_streak: newMaxStreak,
    coins: newCoins,
    unlocked_achievements: newUnlockedAchievements,
    achievementCoinsGained,
  };
}

// Creates the auth user, then writes their profile row (grade, subjects,
// language). Throws with a readable message on failure — e.g. Supabase's
// "User already registered" when the email is taken.
async function registerAccount({ email, password, grade, subjects, lang }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("no user returned from signUp");

  const today = todayStr();
  const { error: insertError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    grade,
    subjects,
    language: lang,
    streak: 1,
    max_streak: 1,
    last_active_date: today,
    goal: null,
    modules_completed: 0,
    perfect_module_completed: false,
    module_deadlines: {},
    completed_modules: [],
    unlocked_achievements: [],
  });
  if (insertError) throw insertError;

  return {
    email,
    grade,
    subjects,
    language: lang,
    diagnostics_completed: false,
    diagnostic_results: [],
    xp: 0,
    coins: 0,
    is_admin: false,
    recommended_modules: [],
    streak: 1,
    max_streak: 1,
    last_active_date: today,
    goal: null,
    modules_completed: 0,
    perfect_module_completed: false,
    module_deadlines: {},
    completed_modules: [],
    unlocked_achievements: [],
    roadmap: [],
  };
}

// Logs in via Supabase auth, then reads back the matching profile row and
// refreshes the day streak for this login.
async function loginAccount({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, email, grade, subjects, language, diagnostics_completed, diagnostic_results, is_admin, xp, coins, recommended_modules, streak, max_streak, last_active_date, goal, modules_completed, perfect_module_completed, module_deadlines, completed_modules, unlocked_achievements, roadmap"
    )
    .eq("id", data.user.id)
    .single();
  if (profileError) throw profileError;

  try {
    const streakResult = await updateStreakForUser(data.user.id, profile);
    return {
      ...profile,
      streak: streakResult.streak,
      last_active_date: streakResult.last_active_date,
      max_streak: streakResult.max_streak,
      coins: streakResult.coins,
      unlocked_achievements: streakResult.unlocked_achievements,
      // Not persisted on the profile itself — just carried along this one
      // time so the caller can show a coin toast right after login.
      achievementCoinsGained: streakResult.achievementCoinsGained,
    };
  } catch (streakErr) {
    // Non-fatal: login still succeeds even if the streak update fails.
    console.error("Failed to update streak:", streakErr);
    return profile;
  }
}

// Persists the student's own goal text so it also shows up for their
// teacher in the admin panel.
async function updateGoal(goalText) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { error } = await supabase.from("profiles").update({ goal: goalText }).eq("id", userData.user.id);
  if (error) throw error;
}

// Persists the interface language on the profile so it's restored on the
// next login, regardless of which language the gate/header happens to be
// showing at that moment.
async function updateLanguageForCurrentUser(newLang) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData || !userData.user) return; // not logged in yet — nothing to persist
  await supabase.from("profiles").update({ language: newLang }).eq("id", userData.user.id);
}

// Fetches competitions whose subject overlaps with the student's own
// subjects, so they only see competitions relevant to them.
async function fetchCompetitionsForSubjects(subjects) {
  if (!subjects || subjects.length === 0) return [];
  const today = todayStr();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .in("subject", subjects)
    // Competitions whose date has already passed shouldn't be shown to
    // students. event_date is nullable for older rows, so keep those too
    // (nothing to compare) rather than hiding them by accident.
    .or(`event_date.is.null,event_date.gte.${today}`)
    .order("event_date", { ascending: true });
  if (error) throw error;
  return data || [];
}

// Fetches title/subject for a set of module ids — used to show module
// names next to their deadlines on the student dashboard, without pulling
// the full module list (content, questions, etc.) into Cabinet.
async function fetchModulesByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase.from("modules").select("id, title, subject").in("id", ids);
  if (error) throw error;
  return data || [];
}

// Adds `amount` XP to the current user's total. Level is never stored —
// it's always computed as floor(xp / 100) + 1 wherever it's displayed
// (see Cabinet.jsx), so there's one source of truth. If that crosses
// into a new level, awards COINS_PER_LEVEL_UP coins per level gained.
const COINS_PER_LEVEL_UP = 5;
const XP_PER_LEVEL = 100;

// Same XP/level/coin bookkeeping the app used to do in a plain awardXP
// helper, plus the things a finished module feeds into achievements: a
// running count of completed modules, a one-time flag for ever finishing
// a module with a 100% quiz score, and the id itself so that module can
// stop being offered again. isPerfect is true when the module had
// questions and every one was answered correctly (a module with no
// questions never sets it). If this module id was somehow already
// recorded as completed (e.g. a retried request), XP/coins/counts are
// left untouched rather than double-counted.
async function recordModuleCompletion(amount, isPerfect, moduleId) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data: current, error: curErr } = await supabase
    .from("profiles")
    .select("xp, coins, modules_completed, perfect_module_completed, completed_modules, max_streak, unlocked_achievements")
    .eq("id", userData.user.id)
    .single();
  if (curErr) throw curErr;

  const alreadyCompleted = (current.completed_modules || []).includes(moduleId);

  const oldXp = current.xp || 0;
  const newXp = alreadyCompleted ? oldXp : oldXp + amount;
  const oldLevel = Math.floor(oldXp / XP_PER_LEVEL) + 1;
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
  const levelsGained = newLevel - oldLevel;
  const levelUpCoins = levelsGained * COINS_PER_LEVEL_UP;
  const newModulesCompleted = alreadyCompleted
    ? current.modules_completed || 0
    : (current.modules_completed || 0) + 1;
  const newPerfect = current.perfect_module_completed || (!alreadyCompleted && !!isPerfect);
  const newCompletedModules = alreadyCompleted
    ? current.completed_modules || []
    : [...(current.completed_modules || []), moduleId];

  // Finishing a module can itself cross an achievement tier (module count,
  // or the first-ever 100% run) — fold those coins into this same update.
  const previouslyUnlocked = current.unlocked_achievements || [];
  const newlyUnlockedAchievements = diffNewlyUnlocked(previouslyUnlocked, {
    maxStreak: current.max_streak || 1,
    modulesCompleted: newModulesCompleted,
    perfectModuleCompleted: newPerfect,
  });
  const achievementCoins = newlyUnlockedAchievements.length * COINS_PER_ACHIEVEMENT;
  const newUnlockedAchievements = newlyUnlockedAchievements.length
    ? [...previouslyUnlocked, ...newlyUnlockedAchievements]
    : previouslyUnlocked;

  const newCoins = (current.coins || 0) + levelUpCoins + achievementCoins;

  const { error } = await supabase
    .from("profiles")
    .update({
      xp: newXp,
      coins: newCoins,
      modules_completed: newModulesCompleted,
      perfect_module_completed: newPerfect,
      completed_modules: newCompletedModules,
      unlocked_achievements: newUnlockedAchievements,
    })
    .eq("id", userData.user.id);
  if (error) throw error;

  return {
    xp: newXp,
    coins: newCoins,
    levelsGained,
    newLevel,
    modulesCompleted: newModulesCompleted,
    perfectModuleCompleted: newPerfect,
    completedModules: newCompletedModules,
    unlockedAchievements: newUnlockedAchievements,
    // Total coins earned by this one completion (level-ups + any newly
    // unlocked achievements) — what the coin toast should show.
    coinsGained: levelUpCoins + achievementCoins,
  };
}

// Turns per-subject diagnostic scores into an ordered prep plan: weakest
// subject first, each broken into three generic stages. This is plain
// rule-based logic (no AI involved) — it runs immediately after the
// diagnostic and fills the roadmap card in Cabinet.jsx right away.
function buildRoadmap(subjectResults) {
  return [...subjectResults]
    .map((r) => ({ subjectKey: r.subjectKey, pct: r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0 }))
    .sort((a, b) => a.pct - b.pct)
    .map((r) => ({
      subjectKey: r.subjectKey,
      pct: r.pct,
      stage: r.pct < 50 ? "foundations" : r.pct < 85 ? "practice" : "review",
    }));
}

// Marks the currently logged-in user's diagnostics as complete, stores
// their per-subject results, and saves the roadmap generated from them —
// all in one update so the cabinet has everything it needs right after.
async function saveDiagnosticsResults(subjectResults, roadmap) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { error } = await supabase
    .from("profiles")
    .update({ diagnostics_completed: true, diagnostic_results: subjectResults, roadmap })
    .eq("id", userData.user.id);
  if (error) throw error;
}

function useCabinetCompetitions(view, subjects, loadCompetitions) {
  React.useEffect(() => {
    if (view === "cabinet" && subjects && subjects.length > 0) {
      loadCompetitions(subjects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
}

// Loads title/subject for the student's recommended modules whenever they
// land on the cabinet, so the deadlines card can show module names rather
// than bare ids.
function useCabinetRecommendedModules(view, recommendedIds, loadRecommendedModules) {
  React.useEffect(() => {
    if (view === "cabinet" && recommendedIds && recommendedIds.length > 0) {
      loadRecommendedModules(recommendedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, JSON.stringify(recommendedIds)]);
}

export default function App() {
  const [lang, setLang] = useState(null);
  const [view, setView] = useState("landing");
  const [doneType, setDoneType] = useState("reg");
  const [profile, setProfile] = useState(null);
  const [subjectResults, setSubjectResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [competitions, setCompetitions] = useState([]);
  const [recommendedModulesInfo, setRecommendedModulesInfo] = useState([]);
  // Set when the AI assistant suggests a module — ModulesPage picks this
  // up on mount to auto-open that module, then it's cleared.
  const [pendingModuleId, setPendingModuleId] = useState(null);

  // Small "+N coins" notifications — shown whenever coins land on the
  // account (level-up, achievement unlock, streak achievement at login),
  // and auto-dismissed a few seconds later.
  const [coinToasts, setCoinToasts] = useState([]);
  const pushCoinToast = (amount) => {
    if (!amount || amount <= 0) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setCoinToasts((prev) => [...prev, { id, amount }]);
    setTimeout(() => {
      setCoinToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const [regEmail, setRegEmail] = useState("");
  const [regGrade, setRegGrade] = useState(null);
  const [regSubjects, setRegSubjects] = useState([]);
  const [regPassword, setRegPassword] = useState("");
  const [regErrors, setRegErrors] = useState({});
  const [regServerError, setRegServerError] = useState("");

  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [loginServerError, setLoginServerError] = useState("");

  const t = T[lang || "ru"];
  const langKey = lang === "kk" ? "kk" : lang === "en" ? "en" : "ru";

  // Turns the { moduleId: "YYYY-MM-DD" } map a teacher builds while
  // recommending modules into a sorted list with module titles attached,
  // ready for the cabinet's deadlines card.
  const moduleDeadlines = profile?.module_deadlines || {};
  const deadlineList = Object.keys(moduleDeadlines)
    .filter((id) => !!moduleDeadlines[id])
    .map((id) => {
      const info = recommendedModulesInfo.find((m) => m.id === id);
      return {
        moduleId: id,
        title: info?.title || id,
        subject: info?.subject || "",
        deadline: moduleDeadlines[id],
      };
    })
    .sort((a, b) => (a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0));

  const goto = (v) => {
    setView(v);
    setRegErrors({});
    setLoginErrors({});
    setRegServerError("");
    setLoginServerError("");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore — we still clear local state below either way
    }
    setProfile(null);
    setSubjectResults([]);
    setCompetitions([]);
    setRecommendedModulesInfo([]);
    goto("landing");
  };

  // Switches the interface language everywhere. If someone is logged in,
  // it's also saved to their profile so it's remembered on the next login.
  const handleChangeLang = (newLang) => {
    setLang(newLang);
    if (profile) {
      updateLanguageForCurrentUser(newLang).catch((err) =>
        console.error("Failed to save language preference:", err)
      );
    }
  };

  const handleSetGoal = async (goalText) => {
    setProfile((p) => (p ? { ...p, goal: goalText } : p));
    try {
      await updateGoal(goalText);
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };

  const loadCompetitions = async (subjects) => {
    try {
      const list = await fetchCompetitionsForSubjects(subjects);
      setCompetitions(list);
    } catch (err) {
      console.error("Failed to load competitions:", err);
    }
  };

  const loadRecommendedModules = async (ids) => {
    try {
      const list = await fetchModulesByIds(ids);
      setRecommendedModulesInfo(list);
    } catch (err) {
      console.error("Failed to load recommended module details:", err);
    }
  };

  useCabinetCompetitions(view, profile?.subjects, loadCompetitions);
  useCabinetRecommendedModules(view, profile?.recommended_modules, loadRecommendedModules);

  const toggleSubject = (key) => {
    setRegSubjects((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!isValidEmail(regEmail)) errs.email = t.errEmail;
    if (!regGrade) errs.grade = t.errGrade;
    if (regSubjects.length === 0) errs.subjects = t.errSubjects;
    if (regPassword.length < 6) errs.password = t.errPassword;
    setRegErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setRegServerError("");
    try {
      const profile = await registerAccount({
        email: regEmail.trim(),
        password: regPassword,
        grade: regGrade,
        subjects: regSubjects,
        lang,
      });
      setProfile(profile);
      setDoneType("reg");
      setView("done");
    } catch (err) {
      const msg = (err && err.message) || "";
      if (/already registered|already exists/i.test(msg)) {
        setRegServerError(t.errEmailTaken);
      } else {
        setRegServerError(msg || t.storageErr);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginId.trim()) errs.id = t.errLogin;
    if (!loginPassword.trim()) errs.password = t.errLoginPassword;
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setLoginServerError("");
    try {
      const profile = await loginAccount({ email: loginId.trim(), password: loginPassword });
      setProfile(profile);
      if (profile.achievementCoinsGained > 0) pushCoinToast(profile.achievementCoinsGained);
      if (profile.language && profile.language !== lang) {
        // Restore the language they were using last time, not whatever
        // the gate/header happened to be set to before they logged in.
        setLang(profile.language);
      }
      if (profile.is_admin) {
        // Admins skip the diagnostics/cabinet flow entirely.
        setView("admin");
        return;
      }
      setSubjectResults(profile.diagnostic_results || []);
      setDoneType("login");
      setView("done");
    } catch (err) {
      const msg = (err && err.message) || "";
      if (/invalid login credentials/i.test(msg)) {
        setLoginServerError(t.errInvalidLogin);
      } else {
        setLoginServerError(msg || t.storageErr);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!lang) {
    return (
      <div className="bj-app">
        <style>{CSS}</style>
        <div className="gate">
          <div className="gate-logo">
            <Sun size={26} strokeWidth={2.4} />
            <span>Bilim Jol</span>
          </div>
          <div className="gate-titles">
            {GATE_TEXT.map((g) => (
              <div key={g.code} className="gate-title">
                {g.title}
              </div>
            ))}
          </div>
          <div className="gate-buttons">
            {LANGS.map((l) => (
              <button key={l.code} className="gate-btn" onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const showSiteChrome = view === "landing" || view === "register" || view === "login" || view === "done";

  return (
    <div className="bj-app">
      <style>{CSS}</style>

      {coinToasts.length > 0 && (
        <div className="coin-toast-stack">
          {coinToasts.map((toast) => (
            <div className="coin-toast" key={toast.id}>
              <Coins size={16} strokeWidth={2.4} />
              <span>{t.coinToast(toast.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {showSiteChrome && (
        <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => goto("landing")} role="button" tabIndex={0}>
            <Sun size={22} strokeWidth={2.4} className="logo-icon" />
            <span>Bilim Jol</span>
          </div>
          <div className="header-right">
            <div className="lang-switch">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  className={"lang-chip" + (lang === l.code ? " active" : "")}
                  onClick={() => handleChangeLang(l.code)}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
            {!profile && (
              <>
                <button type="button" className="btn btn-outline" onClick={() => goto("login")}>
                  {t.navLogin}
                </button>
                <button type="button" className="btn btn-solid" onClick={() => goto("register")}>
                  {t.navRegister}
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      )}

      {view === "landing" && (
        <Landing t={t} onPrimary={() => goto("register")} onSecondary={() => goto("login")} />
      )}

      {view === "register" && (
        <FormShell onBack={() => goto("landing")} backLabel={t.backHome}>
          <form className="card" onSubmit={submitRegister}>
            <h2 className="card-title">{t.regTitle}</h2>
            <p className="card-subtitle">{t.regSubtitle}</p>

            <label className="field-label">{t.emailLabel}</label>
            <input
              className={"input" + (regErrors.email ? " input-err" : "")}
              type="email"
              placeholder={t.emailPlaceholder}
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            {regErrors.email && <div className="error-text">{regErrors.email}</div>}

            <label className="field-label">{t.gradeLabel}</label>
            <div className="chip-row">
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g}
                  className={"chip" + (regGrade === g ? " active" : "")}
                  onClick={() => setRegGrade(g)}
                >
                  {g}
                </button>
              ))}
            </div>
            {regErrors.grade && <div className="error-text">{regErrors.grade}</div>}

            <label className="field-label">
              {t.subjectsLabel}
              <span className="field-hint"> · {t.subjectsHint}</span>
            </label>
            <div className="chip-row wrap">
              {SUBJECTS.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  className={"chip" + (regSubjects.includes(s.key) ? " active" : "")}
                  onClick={() => toggleSubject(s.key)}
                >
                  {regSubjects.includes(s.key) && <Check size={14} strokeWidth={3} />}
                  {s[langKey]}
                </button>
              ))}
            </div>
            {regErrors.subjects && <div className="error-text">{regErrors.subjects}</div>}

            <label className="field-label">{t.passwordLabel}</label>
            <input
              className={"input" + (regErrors.password ? " input-err" : "")}
              type="password"
              placeholder={t.passwordPlaceholder}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            {regErrors.password && <div className="error-text">{regErrors.password}</div>}

            {regServerError && <div className="error-text center banner">{regServerError}</div>}

            <button type="submit" className="btn btn-solid btn-block" disabled={submitting}>
              {submitting ? t.savingText : t.regSubmit}
            </button>
            <div className="switch-line">
              {t.haveAccount}{" "}
              <button type="button" className="link-btn" onClick={() => goto("login")}>
                {t.loginLink}
              </button>
            </div>
          </form>
        </FormShell>
      )}

      {view === "login" && (
        <FormShell onBack={() => goto("landing")} backLabel={t.backHome}>
          <form className="card" onSubmit={submitLogin}>
            <h2 className="card-title">{t.loginTitle}</h2>
            <p className="card-subtitle">{t.loginSubtitle}</p>

            <label className="field-label">{t.loginLabel}</label>
            <input
              className={"input" + (loginErrors.id ? " input-err" : "")}
              type="text"
              placeholder={t.emailPlaceholder}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            {loginErrors.id && <div className="error-text">{loginErrors.id}</div>}

            <label className="field-label">{t.passwordLabel}</label>
            <input
              className={"input" + (loginErrors.password ? " input-err" : "")}
              type="password"
              placeholder={t.passwordPlaceholder}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            {loginErrors.password && <div className="error-text">{loginErrors.password}</div>}

            {loginServerError && <div className="error-text center banner">{loginServerError}</div>}

            <button type="submit" className="btn btn-solid btn-block" disabled={submitting}>
              {submitting ? t.loggingText : t.loginSubmit}
            </button>
            <div className="switch-line">
              {t.noAccount}{" "}
              <button type="button" className="link-btn" onClick={() => goto("register")}>
                {t.registerLink}
              </button>
            </div>
          </form>
        </FormShell>
      )}

      {view === "done" && (
        <FormShell onBack={() => goto("landing")} backLabel={t.backHome}>
          <div className="card done-card">
            <div className={"done-icon" + (doneType === "admin" ? " admin" : "")}>
              {doneType === "admin" ? <ShieldCheck size={28} /> : <Check size={28} strokeWidth={3} />}
            </div>
            <h2 className="card-title center">
              {doneType === "reg" ? t.doneRegTitle : doneType === "admin" ? t.doneAdminTitle : t.doneLoginTitle}
            </h2>
            <p className="card-subtitle center">
              {doneType === "reg" ? t.doneRegText : doneType === "admin" ? t.doneAdminText : t.doneLoginText}
            </p>

            {profile && (
              <div className="profile-summary">
                <div>{profile.email}</div>
                <div>
                  <strong>{t.profileGradeLabel}</strong> {profile.grade}
                </div>
                <div>
                  <strong>{t.profileSubjectsLabel}</strong>{" "}
                  {profile.subjects.map((k) => SUBJECTS.find((s) => s.key === k)?.[langKey] || k).join(", ")}
                </div>
              </div>
            )}

            {doneType === "admin" ? (
              <button type="button" className="btnb btnb-solid btnb-block" onClick={() => goto("landing")}>
                {t.backHome}
              </button>
            ) : profile?.diagnostics_completed ? (
              <>
                <button type="button" className="btnb btnb-solid btnb-block" onClick={() => goto("cabinet")}>
                  {t.goCabinet}
                </button>
                <div className="switch-line">
                  <button type="button" className="link-btn" onClick={() => goto("landing")}>
                    {t.backHome}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="button" className="btnb btnb-solid btnb-block" onClick={() => goto("diagnostics")}>
                  {t.goDiagnostics}
                </button>
                <div className="switch-line">
                  <button type="button" className="link-btn" onClick={() => goto("landing")}>
                    {t.backHome}
                  </button>
                </div>
              </>
            )}
          </div>
        </FormShell>
      )}

      {view === "diagnostics" && (
        <DiagnosticsPage
          lang={lang}
          grade={profile?.grade}
          subjects={profile?.subjects || []}
          onBack={() => goto("landing")}
          onFinish={async (results) => {
            setSubjectResults(results);
            const roadmap = buildRoadmap(results);
            setProfile((p) =>
              p ? { ...p, diagnostics_completed: true, diagnostic_results: results, roadmap } : p
            );
            try {
              await saveDiagnosticsResults(results, roadmap);
            } catch (err) {
              // Non-fatal: the user still sees their cabinet this session,
              // but the "already completed" flag may not have persisted —
              // worth surfacing in real usage (e.g. a toast), not just a
              // console log.
              console.error("Failed to save diagnostics results:", err);
            }
            goto("cabinet");
          }}
        />
      )}

      {view === "cabinet" && (
        <CabinetPage
          lang={lang}
          onChangeLang={handleChangeLang}
          user={profile?.email}
          grade={profile?.grade}
          subjects={profile?.subjects || []}
          subjectResults={subjectResults}
          xp={profile?.xp || 0}
          coins={profile?.coins || 0}
          level={Math.floor((profile?.xp || 0) / 100) + 1}
          streak={profile?.streak || 1}
          maxStreak={profile?.max_streak || profile?.streak || 1}
          modulesCompleted={profile?.modules_completed || 0}
          perfectModuleCompleted={!!profile?.perfect_module_completed}
          deadlines={deadlineList}
          goal={profile?.goal || ""}
          onSetGoal={handleSetGoal}
          competitions={competitions}
          roadmap={profile?.roadmap || []}
          onNavigate={(key) => {
            if (key === "modules") goto("modules");
            if (key === "ai") goto("ai");
          }}
          onGoToTasks={() => goto("modules")}
          onLogout={handleLogout}
        />
      )}

      {view === "modules" && (
        <ModulesPage
          lang={lang}
          grade={profile?.grade}
          subjects={profile?.subjects || []}
          recommendedIds={profile?.recommended_modules || []}
          moduleDeadlines={profile?.module_deadlines || {}}
          completedIds={profile?.completed_modules || []}
          initialModuleId={pendingModuleId}
          onInitialModuleConsumed={() => setPendingModuleId(null)}
          onBack={() => goto("cabinet")}
          onFinish={async (xpGained, isPerfect, moduleId) => {
            try {
              const result = await recordModuleCompletion(xpGained, isPerfect, moduleId);
              setProfile((p) =>
                p
                  ? {
                      ...p,
                      xp: result.xp,
                      coins: result.coins,
                      modules_completed: result.modulesCompleted,
                      perfect_module_completed: result.perfectModuleCompleted,
                      completed_modules: result.completedModules,
                      unlocked_achievements: result.unlockedAchievements,
                    }
                  : p
              );
              if (result.coinsGained > 0) pushCoinToast(result.coinsGained);
              return result;
            } catch (err) {
              console.error("Failed to save module completion:", err);
              // Still reflect it locally so the session feels consistent,
              // even though it didn't persist — same non-fatal pattern used
              // for diagnostics results above.
              setProfile((p) =>
                p
                  ? {
                      ...p,
                      xp: (p.xp || 0) + xpGained,
                      modules_completed: (p.modules_completed || 0) + 1,
                      perfect_module_completed: p.perfect_module_completed || !!isPerfect,
                      completed_modules: (p.completed_modules || []).includes(moduleId)
                        ? p.completed_modules
                        : [...(p.completed_modules || []), moduleId],
                    }
                  : p
              );
              return null;
            }
          }}
        />
      )}

      {view === "ai" && (
        <AiPage
          lang={lang}
          grade={profile?.grade}
          subjects={profile?.subjects || []}
          onBack={() => goto("cabinet")}
          onOpenModule={(moduleId) => {
            setPendingModuleId(moduleId);
            goto("modules");
          }}
        />
      )}

      {view === "admin" && (
        <AdminPanel lang={lang} onChangeLang={handleChangeLang} adminEmail={profile?.email} onLogout={handleLogout} />
      )}

      {showSiteChrome && (
        <footer className="footer">
          <div className="footer-inner">
            <div className="logo small">
              <Sun size={18} strokeWidth={2.4} className="logo-icon" />
              <span>Bilim Jol</span>
            </div>
            <span className="footer-note">{t.footerNote}</span>
          </div>
        </footer>
      )}
    </div>
  );
}

function Landing({ t, onPrimary, onSecondary }) {
  return (
    <>
      <section className="hero">
        <div className="deco deco-1" />
        <div className="deco deco-2" />
        <div className="deco deco-3" />
        <div className="deco deco-4" />
        <div className="hero-inner">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 className="headline">{t.headline}</h1>
          <p className="subtext">{t.subtext}</p>
          <div className="hero-actions">
            <button type="button" className="btnb btnb-solid btnb-lg" onClick={onPrimary}>
              {t.heroPrimary}
            </button>
            <button type="button" className="btnb btnb-outline-light btnb-lg" onClick={onSecondary}>
              {t.heroSecondary}
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-inner">
          <div className="eyebrow dark">{t.featEyebrow}</div>
          <h2 className="feat-title">{t.featTitle}</h2>
          <p className="feat-subtitle">{t.featSubtitle}</p>
          <div className="features-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const c = f[t === T.kk ? "kk" : t === T.en ? "en" : "ru"];
              return (
                <div className="feature-card" key={i} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="feature-icon">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div className="feature-title">{c.title}</div>
                  <div className="feature-desc">{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-inner">
          <div>
            <div className="cta-title">{t.ctaTitle}</div>
            <div className="cta-text">{t.ctaText}</div>
          </div>
          <button type="button" className="btnb btnb-solid btnb-lg" onClick={onPrimary}>
            {t.heroPrimary}
          </button>
        </div>
      </section>
    </>
  );
}

function FormShell({ children, onBack, backLabel }) {
  return (
    <section className="form-section">
      <div className="form-wrap">
        <button type="button" className="back-link" onClick={onBack}>
          <ArrowLeft size={16} /> {backLabel}
        </button>
        {children}
      </div>
    </section>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

.bj-app {
  --dark-1: #0F3941;
  --dark-2: #0A2A31;
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

.bj-app * { box-sizing: border-box; }
.bj-app button { font-family: inherit; cursor: pointer; }
.bj-app button:disabled { opacity: 0.65; cursor: not-allowed; }
.bj-app input:focus-visible,
.bj-app button:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 2px;
}

/* ---------- coin toasts ---------- */
.coin-toast-stack {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.coin-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--dark-1);
  color: #fff;
  font-weight: 700;
  font-size: 13.5px;
  padding: 10px 16px;
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(15, 42, 48, 0.28);
  animation: coin-toast-in 0.25s ease, coin-toast-out 0.3s ease 4.7s forwards;
}
.coin-toast svg { color: var(--orange); flex-shrink: 0; }
@keyframes coin-toast-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes coin-toast-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
}

@media (max-width: 640px) {
  .coin-toast-stack { left: 12px; right: 12px; top: 12px; align-items: stretch; }
  .coin-toast { justify-content: center; }
}

/* ---------- language gate ---------- */
.gate {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #144750 0%, var(--dark-2) 65%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  padding: 24px;
  text-align: center;
}
.gate-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  font-size: 20px;
}
.gate-logo svg { color: var(--orange); }
.gate-titles { display: flex; flex-direction: column; gap: 4px; }
.gate-title {
  color: rgba(255,255,255,0.92);
  font-family: 'Unbounded', sans-serif;
  font-weight: 600;
  font-size: clamp(18px, 3vw, 26px);
}
.gate-buttons { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.gate-btn {
  background: var(--orange);
  color: #26210a;
  border: none;
  border-radius: 999px;
  padding: 14px 28px;
  font-weight: 800;
  font-size: 15px;
  transition: transform .15s ease, background .15s ease;
}
.gate-btn:hover { background: #ffb63c; transform: translateY(-1px); }

/* ---------- header ---------- */
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #EEF4F5;
  border-bottom: 1px solid var(--line);
}
.header-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--dark-1);
}
.logo.small { font-size: 15px; }
.logo-icon { color: var(--orange); }
.header-right { display: flex; align-items: center; gap: 10px; }

.lang-switch { display: flex; gap: 4px; margin-right: 6px; }
.lang-chip {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--muted);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.lang-chip.active { background: var(--dark-1); color: #fff; border-color: var(--dark-1); }

.btn {
  border-radius: 999px;
  font-weight: 700;
  padding: 10px 18px;
  font-size: 14px;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: transform .12s ease, background .15s ease, border-color .15s ease;
}
.btnb {
  border-radius: 999px;
  font-weight: 700;
  padding: 10px 18px;
  font-size: 14px;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: transform .12s ease, background .15s ease, border-color .15s ease;
  margin: 5px;
}
.btn-solid { background: var(--orange); color: #26210a; }
.btn-solid:hover { background: #ffb63c; transform: translateY(-1px); }
.btn-outline { background: transparent; border-color: var(--dark-1); color: var(--dark-1); }
.btn-outline:hover { background: rgba(15,57,65,0.06); }
.btn-outline-light { background: transparent; border-color: rgba(255,255,255,0.55); color: #fff; }
.btn-outline-light:hover { background: rgba(255,255,255,0.1); }
.btn-lg { padding: 14px 26px; font-size: 15px; }
.btn-block { width: 100%; text-align: center; margin-top: 8px; }
.btnb-solid { background: var(--orange); color: #26210a; }
.btnb-solid:hover { background: #ffb63c; transform: translateY(-1px); }
.btnb-outline { background: transparent; border-color: var(--dark-1); color: var(--dark-1); }
.btnb-outline:hover { background: rgba(15,57,65,0.06); }
.btnb-outline-light { background: transparent; border-color: rgba(255,255,255,0.55); color: #fff; }
.btnb-outline-light:hover { background: rgba(255,255,255,0.1); }
.btnb-lg { padding: 14px 26px; font-size: 15px; }
.btnb-block { width: 100%; text-align: center; }
/* ---------- hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, var(--dark-1) 0%, var(--dark-2) 100%);
  padding: 72px 24px 56px;
}
.hero-inner { max-width: 780px; margin: 0 auto; position: relative; z-index: 2; }
.eyebrow {
  color: var(--orange);
  font-weight: 800;
  font-size: 12.5px;
  letter-spacing: 0.14em;
  margin-bottom: 18px;
  animation: fadeUp .6s ease both;
}
.eyebrow.dark { color: var(--orange-dark); }
.headline {
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  color: #fff;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.12;
  margin: 0 0 20px;
  animation: fadeUp .6s ease .05s both;
}
.subtext {
  color: rgba(255,255,255,0.78);
  font-size: 16.5px;
  line-height: 1.6;
  max-width: 640px;
  margin: 0 0 32px;
  animation: fadeUp .6s ease .1s both;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 44px;
  animation: fadeUp .6s ease .15s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.deco { position: absolute; z-index: 1; opacity: 0.55; }
.deco-1 {
  width: 260px; height: 260px; border-radius: 999px;
  border: 26px solid rgba(255,255,255,0.05);
  top: -80px; right: -60px;
}
.deco-2 {
  width: 130px; height: 130px; border-radius: 999px;
  background: rgba(255,255,255,0.06);
  bottom: 40px; right: 220px;
}
.deco-3 {
  width: 90px; height: 34px; border-radius: 999px;
  background: rgba(255,255,255,0.08);
  top: 120px; right: 360px;
  transform: rotate(-30deg);
}
.deco-4 {
  width: 14px; height: 90px; border-radius: 999px;
  background: rgba(255,255,255,0.09);
  bottom: 90px; right: 140px;
}
@media (max-width: 900px) { .deco { display: none; } }

/* ---------- features ---------- */
.features { padding: 72px 24px; background: var(--cream); }
.features-inner { max-width: 1100px; margin: 0 auto; }
.feat-title {
  font-family: 'Unbounded', sans-serif;
  font-size: clamp(24px, 3.2vw, 34px);
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 10px;
}
.feat-subtitle { color: var(--muted); font-size: 15.5px; margin: 0 0 40px; }
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px;
  animation: fadeUp .5s ease both;
}
.feature-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(245,166,35,0.14);
  color: var(--orange-dark);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.feature-title { font-weight: 800; font-size: 16px; margin-bottom: 6px; color: var(--ink); }
.feature-desc { color: var(--muted); font-size: 14px; line-height: 1.55; }

@media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }

/* ---------- cta band ---------- */
.cta { padding: 0 24px 80px; }
.cta-inner {
  max-width: 1100px;
  margin: 0 auto;
  background: var(--dark-1);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.cta-title { font-family: 'Unbounded', sans-serif; color: #fff; font-weight: 700; font-size: 22px; }
.cta-text { color: rgba(255,255,255,0.7); font-size: 14.5px; margin-top: 6px; }

/* ---------- forms ---------- */
.form-section { padding: 56px 24px 80px; min-height: 60vh; }
.form-wrap { max-width: 560px; margin: 0 auto; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; color: var(--muted);
  font-weight: 700; font-size: 13.5px; margin-bottom: 18px; padding: 0;
}
.back-link:hover { color: var(--dark-1); }

.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 32px;
}
.card-title { font-family: 'Unbounded', sans-serif; font-size: 22px; margin: 0 0 6px; }
.card-title.center { text-align: center; }
.card-subtitle { color: var(--muted); font-size: 14px; margin: 0 0 26px; }
.card-subtitle.center { text-align: center; }

.field-label { display: block; font-weight: 700; font-size: 13.5px; margin: 18px 0 8px; }
.field-hint { color: var(--muted); font-weight: 500; }
.input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14.5px;
  font-family: inherit;
  background: #FAFCFC;
  color: var(--ink);
}
.input::placeholder { color: var(--muted); }
.input:focus { border-color: var(--orange); background: #fff; }
.input-err { border-color: #E0553F; }
.error-text { color: #E0553F; font-size: 12.5px; margin-top: 6px; }
.error-text.center { text-align: center; }
.error-text.banner { margin-top: 18px; margin-bottom: -6px; }

.chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chip.active { background: var(--dark-1); border-color: var(--dark-1); color: #fff; }

.switch-line { text-align: center; margin-top: 18px; font-size: 13.5px; color: var(--muted); }
.link-btn { background: none; border: none; color: var(--orange-dark); font-weight: 800; padding: 0; }

.done-card { text-align: center; }
.done-icon {
  width: 56px; height: 56px; border-radius: 999px;
  background: rgba(245,166,35,0.16); color: var(--orange-dark);
  display: flex; align-items: center; justify-content: center;
  margin: 4px auto 18px;
}
.done-icon.admin { background: rgba(15,57,65,0.12); color: var(--dark-1); }

.profile-summary {
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px 18px;
  text-align: left;
  font-size: 13.5px;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 0 22px;
}

/* ---------- footer ---------- */
.footer { border-top: 1px solid var(--line); background: #fff; padding: 22px 24px; }
.footer-inner {
  max-width: 1180px; margin: 0 auto;
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  justify-content: space-between;
}
.footer-note { color: var(--muted); font-size: 13px; }

@media (max-width: 640px) {
  .header-inner { flex-wrap: wrap; gap: 10px; }
  .card { padding: 22px; }
  .cta-inner { padding: 28px; }
}
`;