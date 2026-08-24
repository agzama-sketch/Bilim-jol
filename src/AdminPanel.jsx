import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  Sun,
  Shield,
  LogOut,
  Plus,
  X,
  Trash2,
  Image as ImageIcon,
  Type as TypeIcon,
  Video,
  Users,
  LayoutGrid,
  Pencil,
  Award,
  Target,
  CalendarDays,
} from "lucide-react";

// Local YYYY-MM-DD (not UTC), used to compare against deadline/event date
// inputs, which are plain date strings with no timezone of their own.
function todayStr() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

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

const GRADES = [7, 8, 9, 10, 11, 12];

const T = {
  ru: {
    title: "Панель управления",
    subtitle: "Прогресс учеников и управление модулями",
    addModule: "Добавить модуль",
    sidebarLabel: "Панель управления",
    logout: "Выйти",
    studentsTitle: (n) => `Ученики (${n})`,
    studentsEmpty: "Пока нет учеников — как только кто-то пройдёт диагностику, он появится здесь.",
    modulesTitle: (n) => `Добавленные модули (${n})`,
    modulesEmpty: "Пока нет модулей — добавьте первый.",
    loading: "Загрузка…",
    loadError: "Не удалось загрузить данные. Попробуйте обновить страницу.",
    gradeLabel: "класс",
    diagnosticsNotDone: "диагностику не проходил",
    recommendedLabel: "Посоветовано:",
    pickModule: "Выберите модуль…",
    recommendBtn: "Посоветовать",
    alreadyRecommended: "Уже посоветовано",
    editContent: "Редактировать содержимое",
    formTitle: "Добавить модуль",
    fieldTitle: "Название модуля",
    fieldTitlePh: "Название модуля",
    fieldSubject: "Предмет",
    fieldGrade: "Класс",
    fieldLevel: "Уровень (по XP)",
    fieldDescription: "Описание",
    fieldVideo: "Ссылка на видео",
    fieldVideoPh: "https://youtube.com/…",
    cancel: "Отмена",
    submit: "Добавить модуль",
    editorTitleFor: (title) => `Содержимое: ${title}`,
    contentSection: "Содержание урока",
    addText: "Добавить текст",
    addImage: "Добавить картинку",
    textBlockPh: "Текст блока…",
    imageUrlPh: "Ссылка на картинку (https://…)",
    imageCaptionPh: "Подпись (необязательно)",
    uploadFile: "Загрузить файл",
    uploading: "Загружаем…",
    orUrl: "или вставьте ссылку",
    questionsSection: "Вопросы",
    addQuestion: "Добавить вопрос",
    questionPh: "Текст вопроса",
    optionPh: (i) => `Вариант ${i + 1}`,
    correctHint: "Отметьте правильный вариант",
    save: "Сохранить",
    close: "Закрыть",
    saving: "Сохраняем…",
    remove: "Удалить",
    levelShort: "Уровень",
    goalLabel: "Цель:",
    competitionsTitle: (n) => `Олимпиады и конкурсы (${n})`,
    competitionsEmpty: "Пока нет конкурсов — добавьте первый.",
    addCompetition: "Добавить конкурс",
    fieldCompTitle: "Название конкурса",
    fieldCompTitlePh: "Название конкурса",
    fieldCompSubject: "Связанный предмет",
    fieldCompDescription: "Описание и Дата",
    fieldCompDate: "Дата проведения",
    submitCompetition: "Добавить конкурс",
    fieldDeadline: "Дедлайн (необязательно)",
    requiredFieldsError: "Заполните все поля, кроме картинки — без этого модуль не будет добавлен.",
    requiredDateError: "Укажите дату конкурса.",
  },
  kk: {
    title: "Басқару тақтасы",
    subtitle: "Оқушылардың прогресі және модульдерді басқару",
    addModule: "Модуль қосу",
    sidebarLabel: "Басқару тақтасы",
    logout: "Шығу",
    studentsTitle: (n) => `Оқушылар (${n})`,
    studentsEmpty: "Әзірге оқушылар жоқ — біреу диагностикадан өткен бойда осы жерде пайда болады.",
    modulesTitle: (n) => `Қосылған модульдер (${n})`,
    modulesEmpty: "Әзірге модульдер жоқ — біріншісін қосыңыз.",
    loading: "Жүктелуде…",
    loadError: "Деректерді жүктеу мүмкін болмады. Бетті жаңартып көріңіз.",
    gradeLabel: "сынып",
    diagnosticsNotDone: "диагностикадан өтпеген",
    recommendedLabel: "Ұсынылған:",
    pickModule: "Модульді таңдаңыз…",
    recommendBtn: "Ұсыну",
    alreadyRecommended: "Қазірдің өзінде ұсынылған",
    editContent: "Мазмұнын өңдеу",
    formTitle: "Модуль қосу",
    fieldTitle: "Модуль атауы",
    fieldTitlePh: "Модуль атауы",
    fieldSubject: "Пән",
    fieldGrade: "Сынып",
    fieldLevel: "Деңгей (XP бойынша)",
    fieldDescription: "Сипаттама",
    fieldVideo: "Видео сілтемесі",
    fieldVideoPh: "https://youtube.com/…",
    cancel: "Бас тарту",
    submit: "Модуль қосу",
    editorTitleFor: (title) => `Мазмұны: ${title}`,
    contentSection: "Сабақ мазмұны",
    addText: "Мәтін қосу",
    addImage: "Сурет қосу",
    textBlockPh: "Блок мәтіні…",
    imageUrlPh: "Сурет сілтемесі (https://…)",
    imageCaptionPh: "Жазба (міндетті емес)",
    uploadFile: "Файл жүктеу",
    uploading: "Жүктелуде…",
    orUrl: "немесе сілтеме қойыңыз",
    questionsSection: "Сұрақтар",
    addQuestion: "Сұрақ қосу",
    questionPh: "Сұрақ мәтіні",
    optionPh: (i) => `${i + 1}-нұсқа`,
    correctHint: "Дұрыс нұсқаны белгілеңіз",
    save: "Сақтау",
    close: "Жабу",
    saving: "Сақталуда…",
    remove: "Жою",
    levelShort: "Деңгей",
    goalLabel: "Мақсат:",
    competitionsTitle: (n) => `Олимпиадалар мен конкурстар (${n})`,
    competitionsEmpty: "Әзірге конкурстар жоқ — біріншісін қосыңыз.",
    addCompetition: "Конкурс қосу",
    fieldCompTitle: "Конкурс атауы",
    fieldCompTitlePh: "Конкурс атауы",
    fieldCompSubject: "Байланысты пән",
    fieldCompDescription: "Сипаттама (міндетті емес)",
    fieldCompDate: "Өтетін күні",
    submitCompetition: "Конкурс қосу",
    fieldDeadline: "Мерзімі (міндетті емес)",
    requiredFieldsError: "Суреттен басқа барлық жолды толтырыңыз — олай болмаса модуль қосылмайды.",
    requiredDateError: "Конкурстың күнін көрсетіңіз.",
  },
  en: {
    title: "Dashboard",
    subtitle: "Student progress and module management",
    addModule: "Add module",
    sidebarLabel: "Dashboard",
    logout: "Log out",
    studentsTitle: (n) => `Students (${n})`,
    studentsEmpty: "No students yet — once someone completes the diagnostics quiz, they'll appear here.",
    modulesTitle: (n) => `Modules added (${n})`,
    modulesEmpty: "No modules yet — add your first one.",
    loading: "Loading…",
    loadError: "Couldn't load data. Try refreshing the page.",
    gradeLabel: "grade",
    diagnosticsNotDone: "hasn't taken diagnostics",
    recommendedLabel: "Recommended:",
    pickModule: "Choose a module…",
    recommendBtn: "Recommend",
    alreadyRecommended: "Already recommended",
    editContent: "Edit content",
    formTitle: "Add module",
    fieldTitle: "Module title",
    fieldTitlePh: "Module title",
    fieldSubject: "Subject",
    fieldGrade: "Grade",
    fieldLevel: "Level (by XP)",
    fieldDescription: "Description",
    fieldVideo: "Video link",
    fieldVideoPh: "https://youtube.com/…",
    cancel: "Cancel",
    submit: "Add module",
    editorTitleFor: (title) => `Content: ${title}`,
    contentSection: "Lesson content",
    addText: "Add text",
    addImage: "Add image",
    textBlockPh: "Block text…",
    imageUrlPh: "Image URL (https://…)",
    imageCaptionPh: "Caption (optional)",
    uploadFile: "Upload file",
    uploading: "Uploading…",
    orUrl: "or paste a link",
    questionsSection: "Questions",
    addQuestion: "Add question",
    questionPh: "Question text",
    optionPh: (i) => `Option ${i + 1}`,
    correctHint: "Mark the correct option",
    save: "Save",
    close: "Close",
    saving: "Saving…",
    remove: "Remove",
    levelShort: "Level",
    goalLabel: "Goal:",
    competitionsTitle: (n) => `Olympiads & competitions (${n})`,
    competitionsEmpty: "No competitions yet — add the first one.",
    addCompetition: "Add competition",
    fieldCompTitle: "Competition title",
    fieldCompTitlePh: "Competition title",
    fieldCompSubject: "Related subject",
    fieldCompDescription: "Description (optional)",
    fieldCompDate: "Event date",
    submitCompetition: "Add competition",
    fieldDeadline: "Deadline (optional)",
    requiredFieldsError: "Fill in every field except the picture — the module won't be added otherwise.",
    requiredDateError: "Please set the competition's date.",
  },
};

function pctColor(pct) {
  if (pct >= 80) return "green";
  if (pct >= 50) return "orange";
  return "red";
}

function overallPct(results) {
  if (!results || results.length === 0) return null;
  const correct = results.reduce((a, r) => a + (r.correct || 0), 0);
  const total = results.reduce((a, r) => a + (r.total || 0), 0);
  return total > 0 ? Math.round((correct / total) * 100) : null;
}

export default function AdminPanel({ lang = "ru", onChangeLang = () => {}, adminEmail = "", onLogout = () => {} }) {
  const t = T[lang] || T.ru;
  const langKey = lang === "kk" ? "kk" : lang === "en" ? "en" : "ru";
  const subjectLabel = (key) => SUBJECTS.find((s) => s.key === key)?.[langKey] || key;

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState("");

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [modulesError, setModulesError] = useState("");

  const [competitions, setCompetitions] = useState([]);
  const [loadingCompetitions, setLoadingCompetitions] = useState(true);
  const [competitionsError, setCompetitionsError] = useState("");
  const [showAddCompetition, setShowAddCompetition] = useState(false);

  const [recommendPick, setRecommendPick] = useState({}); // studentId -> moduleId
  const [recommendDeadline, setRecommendDeadline] = useState({}); // studentId -> "YYYY-MM-DD" | ""

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);

  useEffect(() => {
    loadStudents();
    loadModules();
    loadCompetitions();
  }, []);

  async function loadStudents() {
    setLoadingStudents(true);
    setStudentsError("");
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, grade, subjects, diagnostics_completed, diagnostic_results, recommended_modules, module_deadlines, goal")
      .eq("diagnostics_completed", true)
      .order("created_at", { ascending: false });
    if (error) setStudentsError(t.loadError);
    else setStudents(data || []);
    setLoadingStudents(false);
  }

  async function loadModules() {
    setLoadingModules(true);
    setModulesError("");
    const { data, error } = await supabase.from("modules").select("*").order("created_at", { ascending: false });
    if (error) setModulesError(t.loadError);
    else setModules(data || []);
    setLoadingModules(false);
  }

  async function loadCompetitions() {
    setLoadingCompetitions(true);
    setCompetitionsError("");
    const { data, error } = await supabase.from("competitions").select("*").order("event_date", { ascending: true });
    if (error) setCompetitionsError(t.loadError);
    else {
      // Competitions whose date has already passed are hidden here too —
      // once the event is over there's nothing left for the teacher to do
      // with it in this view. Rows without a date (added before this
      // feature existed) are kept rather than silently dropped.
      const today = todayStr();
      setCompetitions((data || []).filter((c) => !c.event_date || c.event_date >= today));
    }
    setLoadingCompetitions(false);
  }

  function handleCompetitionCreated(newCompetition) {
    setCompetitions((prev) => [newCompetition, ...prev]);
    setShowAddCompetition(false);
  }

  async function recommend(student) {
    const moduleId = recommendPick[student.id];
    if (!moduleId) return;
    const updated = Array.from(new Set([...(student.recommended_modules || []), moduleId]));

    // A deadline is optional — the teacher can leave the date field blank
    // and just recommend the module with no due date.
    const deadline = recommendDeadline[student.id] || null;
    const updatedDeadlines = { ...(student.module_deadlines || {}) };
    if (deadline) updatedDeadlines[moduleId] = deadline;

    const { error } = await supabase
      .from("profiles")
      .update({ recommended_modules: updated, module_deadlines: updatedDeadlines })
      .eq("id", student.id);
    if (!error) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, recommended_modules: updated, module_deadlines: updatedDeadlines } : s
        )
      );
      setRecommendPick((prev) => ({ ...prev, [student.id]: "" }));
      setRecommendDeadline((prev) => ({ ...prev, [student.id]: "" }));
    }
  }

  async function handleModuleCreated(newModule) {
    setModules((prev) => [newModule, ...prev]);
    setShowAddForm(false);
    setEditingModuleId(newModule.id);
  }

  function handleModuleSaved(updatedModule) {
    setModules((prev) => prev.map((m) => (m.id === updatedModule.id ? updatedModule : m)));
  }

  const editingModule = modules.find((m) => m.id === editingModuleId) || null;

  return (
    <div className="adm-app">
      <style>{CSS}</style>

      <aside className="sidebar">
        <div className="sb-logo">
          <Sun size={20} strokeWidth={2.4} />
          <span>Bilim Jol</span>
        </div>

        <nav className="sb-nav">
          <button type="button" className="sb-item active">
            <Shield size={17} strokeWidth={2.2} />
            <span>{t.sidebarLabel}</span>
          </button>
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
            <div className="sb-avatar">{(adminEmail || "A").charAt(0).toUpperCase()}</div>
            <div className="sb-user-name" title={adminEmail}>
              {adminEmail || "—"}
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
          <div>
            <h1 className="topbar-title">{t.title}</h1>
            <p className="topbar-subtitle">{t.subtitle}</p>
          </div>
          <button type="button" className="btn btn-solid" onClick={() => setShowAddForm(true)}>
            <Plus size={16} strokeWidth={2.6} /> {t.addModule}
          </button>
        </div>

        <section className="section">
          <div className="section-head">
            <Users size={16} strokeWidth={2.2} className="accent-icon" />
            <span className="section-title">{t.studentsTitle(students.length)}</span>
          </div>

          <div className="panel">
            {loadingStudents && <div className="empty-text">{t.loading}</div>}
            {!loadingStudents && studentsError && <div className="empty-text error">{studentsError}</div>}
            {!loadingStudents && !studentsError && students.length === 0 && (
              <div className="empty-text">{t.studentsEmpty}</div>
            )}
            {!loadingStudents && !studentsError && students.length > 0 && (
              <div className="student-list">
                {students.map((s) => {
                  const pct = overallPct(s.diagnostic_results);
                  const recIds = s.recommended_modules || [];
                  const recTitles = recIds.map((id) => modules.find((m) => m.id === id)?.title).filter(Boolean);
                  const availableModules = modules.filter((m) => !recIds.includes(m.id));
                  return (
                    <div className="student-row" key={s.id}>
                      <div className="student-info">
                        <div className="student-email">{s.email}</div>
                        <div className="student-meta">
                          {s.grade} {t.gradeLabel} · {(s.subjects || []).map(subjectLabel).join(", ")}
                        </div>
                        {recTitles.length > 0 && (
                          <div className="student-recs">
                            {t.recommendedLabel} {recTitles.join(", ")}
                          </div>
                        )}
                        {s.goal && (
                          <div className="student-goal">
                            <Target size={12} strokeWidth={2.4} /> {t.goalLabel} {s.goal}
                          </div>
                        )}
                      </div>

                      <div className="student-score">
                        {pct === null ? (
                          <span className="empty-text small">{t.diagnosticsNotDone}</span>
                        ) : (
                          <span className={"score-badge " + pctColor(pct)}>{pct}%</span>
                        )}
                      </div>

                      <div className="student-actions">
                        <select
                          className="select"
                          value={recommendPick[s.id] || ""}
                          onChange={(e) => setRecommendPick((prev) => ({ ...prev, [s.id]: e.target.value }))}
                          disabled={availableModules.length === 0}
                        >
                          <option value="">{t.pickModule}</option>
                          {availableModules.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title} · {subjectLabel(m.subject)} · {m.grade}
                            </option>
                          ))}
                        </select>
                        <label className="deadline-picker" title={t.fieldDeadline}>
                          <CalendarDays size={14} />
                          <input
                            type="date"
                            className="deadline-input"
                            value={recommendDeadline[s.id] || ""}
                            disabled={!recommendPick[s.id]}
                            onChange={(e) =>
                              setRecommendDeadline((prev) => ({ ...prev, [s.id]: e.target.value }))
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled={!recommendPick[s.id]}
                          onClick={() => recommend(s)}
                        >
                          {t.recommendBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <LayoutGrid size={16} strokeWidth={2.2} className="accent-icon" />
            <span className="section-title">{t.modulesTitle(modules.length)}</span>
          </div>

          <div className="panel">
            {loadingModules && <div className="empty-text">{t.loading}</div>}
            {!loadingModules && modulesError && <div className="empty-text error">{modulesError}</div>}
            {!loadingModules && !modulesError && modules.length === 0 && (
              <div className="empty-text">{t.modulesEmpty}</div>
            )}
            {!loadingModules && !modulesError && modules.length > 0 && (
              <div className="module-grid">
                {modules.map((m) => (
                  <div className="module-card" key={m.id}>
                    <div className="module-card-head">
                      <span className="module-title">{m.title}</span>
                      <span className="level-tag">
                        {t.levelShort} {m.level}
                      </span>
                    </div>
                    <div className="module-meta">
                      {subjectLabel(m.subject)} · {m.grade} {t.gradeLabel}
                    </div>
                    {m.description && <div className="module-desc">{m.description}</div>}
                    {m.video_url && (
                      <a className="module-video" href={m.video_url} target="_blank" rel="noreferrer">
                        <Video size={14} /> {m.video_url}
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-block"
                      onClick={() => setEditingModuleId(m.id)}
                    >
                      <Pencil size={13} /> {t.editContent}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <Award size={16} strokeWidth={2.2} className="accent-icon" />
            <span className="section-title">{t.competitionsTitle(competitions.length)}</span>
          </div>

          <div className="panel">
            {loadingCompetitions && <div className="empty-text">{t.loading}</div>}
            {!loadingCompetitions && competitionsError && <div className="empty-text error">{competitionsError}</div>}
            {!loadingCompetitions && !competitionsError && competitions.length === 0 && (
              <div className="empty-text">{t.competitionsEmpty}</div>
            )}
            {!loadingCompetitions && !competitionsError && competitions.length > 0 && (
              <div className="module-grid">
                {competitions.map((c) => (
                  <div className="module-card" key={c.id}>
                    <div className="module-card-head">
                      <span className="module-title">{c.title}</span>
                    </div>
                    <div className="module-meta">{subjectLabel(c.subject)}</div>
                    {c.event_date && (
                      <div className="module-meta">
                        <CalendarDays size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                        {c.event_date}
                      </div>
                    )}
                    {c.description && <div className="module-desc">{c.description}</div>}
                  </div>
                ))}
              </div>
            )}
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddCompetition(true)} style={{ marginTop: 14 }}>
              <Plus size={14} /> {t.addCompetition}
            </button>
          </div>
        </section>
      </main>

      {showAddForm && <AddModuleModal t={t} langKey={langKey} onClose={() => setShowAddForm(false)} onCreated={handleModuleCreated} />}

      {editingModule && (
        <ModuleEditorModal t={t} module={editingModule} onClose={() => setEditingModuleId(null)} onSaved={handleModuleSaved} />
      )}

      {showAddCompetition && (
        <AddCompetitionModal t={t} langKey={langKey} onClose={() => setShowAddCompetition(false)} onCreated={handleCompetitionCreated} />
      )}
    </div>
  );
}

function AddCompetitionModal({ t, langKey, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0].key);
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t.fieldCompTitle);
      return;
    }
    if (!eventDate) {
      setError(t.requiredDateError);
      return;
    }
    setSaving(true);
    setError("");

    const { data: userData } = await supabase.auth.getUser();
    const { data, error: err } = await supabase
      .from("competitions")
      .insert({
        title: title.trim(),
        subject,
        description: description.trim() || null,
        event_date: eventDate,
        created_by: userData?.user?.id || null,
      })
      .select()
      .single();

    setSaving(false);
    if (err) {
      setError(err.message || t.loadError);
      return;
    }
    onCreated(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 className="modal-title">{t.addCompetition}</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label className="field-label">{t.fieldCompTitle}</label>
          <input
            className="input"
            placeholder={t.fieldCompTitlePh}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="field-label">{t.fieldCompSubject}</label>
          <select className="select full" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s[langKey]}
              </option>
            ))}
          </select>

          <label className="field-label">{t.fieldCompDate} *</label>
          <input
            className="input"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />

          <label className="field-label">{t.fieldCompDescription}</label>
          <textarea
            className="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <div className="error-text">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              {t.close}
            </button>
            <button type="submit" className="btn btn-solid" disabled={saving}>
              {saving ? t.saving : t.submitCompetition}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddModuleModal({ t, langKey, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0].key);
  const [grade, setGrade] = useState(GRADES[0]);
  const [level, setLevel] = useState(1);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    // Every field here is required except the picture (which isn't even
    // part of this form — images are added afterwards in the content
    // editor). subject/grade always have a value from their <select>
    // defaults, so the fields actually worth checking are title, level,
    // description, and the video link.
    if (
      !title.trim() ||
      !subject ||
      !grade ||
      !level ||
      Number(level) < 1 ||
      !description.trim() ||
      !videoUrl.trim()
    ) {
      setError(t.requiredFieldsError);
      return;
    }
    setSaving(true);
    setError("");
    const { data, error: err } = await supabase
      .from("modules")
      .insert({
        title: title.trim(),
        subject,
        grade,
        level: Number(level) || 1,
        description: description.trim(),
        video_url: videoUrl.trim(),
      })
      .select()
      .single();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onCreated(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 className="modal-title">{t.formTitle}</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label className="field-label">{t.fieldTitle} *</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.fieldTitlePh}
            required
          />

          <label className="field-label">{t.fieldSubject} *</label>
          <select className="select full" value={subject} onChange={(e) => setSubject(e.target.value)} required>
            {SUBJECTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s[langKey]}
              </option>
            ))}
          </select>

          <label className="field-label">{t.fieldGrade} *</label>
          <select className="select full" value={grade} onChange={(e) => setGrade(Number(e.target.value))} required>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <label className="field-label">{t.fieldLevel} *</label>
          <input
            className="input"
            type="number"
            min="1"
            max="10"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />

          <label className="field-label">{t.fieldDescription} *</label>
          <textarea
            className="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="field-label">{t.fieldVideo} *</label>
          <input
            className="input"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={t.fieldVideoPh}
            required
          />

          {error && <div className="error-text">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-solid" disabled={saving}>
              {saving ? t.saving : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModuleEditorModal({ t, module, onClose, onSaved }) {
  const [blocks, setBlocks] = useState(module.content && module.content.length ? module.content : []);
  const [questions, setQuestions] = useState(module.questions && module.questions.length ? module.questions : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const uploadImage = async (i, file) => {
    setUploadingIndex(i);
    setError("");
    const ext = file.name.split(".").pop();
    const path = `${module.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("modules").upload(path, file);
    if (uploadErr) {
      setError(uploadErr.message);
      setUploadingIndex(null);
      return;
    }
    const { data } = supabase.storage.from("modules").getPublicUrl(path);
    updateBlock(i, { value: data.publicUrl });
    setUploadingIndex(null);
  };

  const addTextBlock = () => setBlocks((prev) => [...prev, { type: "text", value: "" }]);
  const addImageBlock = () => setBlocks((prev) => [...prev, { type: "image", value: "", caption: "" }]);
  const updateBlock = (i, patch) => setBlocks((prev) => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const removeBlock = (i) => setBlocks((prev) => prev.filter((_, idx) => idx !== i));

  const addQuestion = () =>
    setQuestions((prev) => [...prev, { q: "", options: ["", "", "", ""], correct: 0 }]);
  const updateQuestion = (i, patch) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const updateOption = (qi, oi, value) =>
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
      )
    );
  const removeQuestion = (i) => setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    setError("");
    const { data, error: err } = await supabase
      .from("modules")
      .update({ content: blocks, questions })
      .eq("id", module.id)
      .select()
      .single();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved(data);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 className="modal-title">{t.editorTitleFor(module.title)}</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="editor-body">
          <div className="editor-section">
            <div className="editor-section-title">{t.contentSection}</div>

            {blocks.map((block, i) => (
              <div className="block-card" key={i}>
                <div className="block-card-head">
                  <span className="block-type">{block.type === "text" ? <TypeIcon size={14} /> : <ImageIcon size={14} />}</span>
                  <button type="button" className="icon-btn small" onClick={() => removeBlock(i)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                {block.type === "text" ? (
                  <textarea
                    className="textarea"
                    rows={3}
                    value={block.value}
                    placeholder={t.textBlockPh}
                    onChange={(e) => updateBlock(i, { value: e.target.value })}
                  />
                ) : (
                  <>
                    <div className="upload-row">
                      <label className="btn btn-outline btn-sm upload-label">
                        {uploadingIndex === i ? t.uploading : t.uploadFile}
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input-hidden"
                          disabled={uploadingIndex === i}
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) uploadImage(i, file);
                          }}
                        />
                      </label>
                      {block.value && <img className="block-preview" src={block.value} alt="" />}
                    </div>
                    <div className="hint-text">{t.orUrl}</div>
                    <input
                      className="input"
                      value={block.value}
                      placeholder={t.imageUrlPh}
                      onChange={(e) => updateBlock(i, { value: e.target.value })}
                    />
                    <input
                      className="input"
                      value={block.caption || ""}
                      placeholder={t.imageCaptionPh}
                      onChange={(e) => updateBlock(i, { caption: e.target.value })}
                    />
                  </>
                )}
              </div>
            ))}

            <div className="editor-add-row">
              <button type="button" className="btn btn-outline btn-sm" onClick={addTextBlock}>
                <Plus size={14} /> {t.addText}
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={addImageBlock}>
                <Plus size={14} /> {t.addImage}
              </button>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-title">{t.questionsSection}</div>

            {questions.map((question, qi) => (
              <div className="block-card" key={qi}>
                <div className="block-card-head">
                  <span className="block-type">Q{qi + 1}</span>
                  <button type="button" className="icon-btn small" onClick={() => removeQuestion(qi)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  className="input"
                  value={question.q}
                  placeholder={t.questionPh}
                  onChange={(e) => updateQuestion(qi, { q: e.target.value })}
                />
                <div className="options-grid">
                  {question.options.map((opt, oi) => (
                    <label className="option-row" key={oi}>
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={question.correct === oi}
                        onChange={() => updateQuestion(qi, { correct: oi })}
                      />
                      <input
                        className="input"
                        value={opt}
                        placeholder={t.optionPh(oi)}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
                <div className="hint-text">{t.correctHint}</div>
              </div>
            ))}

            <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion}>
              <Plus size={14} /> {t.addQuestion}
            </button>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            {t.close}
          </button>
          <button type="button" className="btn btn-solid" disabled={saving} onClick={save}>
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.adm-app {
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
.adm-app * { box-sizing: border-box; }
.adm-app button { font-family: inherit; cursor: pointer; }
.adm-app button:disabled { opacity: .6; cursor: not-allowed; }
.adm-app button:focus-visible, .adm-app input:focus-visible, .adm-app select:focus-visible, .adm-app textarea:focus-visible {
  outline: 2px solid var(--orange); outline-offset: 2px;
}

/* sidebar (shared look with Cabinet.jsx) */
.sidebar { width: 220px; flex-shrink: 0; background: var(--dark-1); color: #fff; display: flex; flex-direction: column; padding: 20px 14px; min-height: 100vh; }
.sb-logo { display: flex; align-items: center; gap: 8px; font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 15.5px; padding: 6px 8px 22px; }
.sb-logo svg { color: var(--orange); }
.sb-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sb-item { display: flex; align-items: center; gap: 10px; background: none; border: none; color: rgba(255,255,255,0.78); padding: 10px 12px; border-radius: 10px; font-size: 14px; font-weight: 600; text-align: left; }
.sb-item.active { background: var(--orange); color: #26210a; }
.sb-bottom { border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; margin-top: 14px; }
.sb-lang-switch { display: flex; gap: 4px; padding: 0 8px 12px; }
.sb-lang-chip {
  flex: 1; background: rgba(255,255,255,0.06); border: none; color: rgba(255,255,255,0.7);
  border-radius: 8px; padding: 6px 0; font-size: 11.5px; font-weight: 800;
}
.sb-lang-chip.active { background: var(--orange); color: #26210a; }
.sb-user { display: flex; align-items: center; gap: 10px; padding: 4px 8px 10px; }
.sb-avatar { width: 30px; height: 30px; border-radius: 999px; background: var(--orange); color: #26210a; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
.sb-user-name { font-size: 12.5px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-logout { display: flex; align-items: center; gap: 8px; width: 100%; background: none; border: none; color: rgba(255,255,255,0.65); padding: 8px; border-radius: 10px; font-size: 13px; font-weight: 600; }
.sb-logout:hover { background: rgba(255,255,255,0.06); color: #fff; }

/* main */
.main { flex: 1; background: var(--cream); padding: 28px 32px 60px; min-width: 0; }
.topbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 26px; }
.topbar-title { font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 24px; margin: 0 0 4px; }
.topbar-subtitle { color: var(--muted); font-size: 14px; margin: 0; }

.section { margin-bottom: 24px; }
.section-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.section-title { font-weight: 800; font-size: 15px; }
.accent-icon { color: var(--orange-dark); }

.panel { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 22px; }
.empty-text { color: var(--muted); font-size: 13.5px; text-align: center; padding: 24px 0; }
.empty-text.small { padding: 0; text-align: left; font-size: 12.5px; }
.empty-text.error { color: var(--red); }

.student-list { display: flex; flex-direction: column; gap: 14px; }
.student-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--line); }
.student-row:last-child { border-bottom: none; padding-bottom: 0; }
.student-email { font-weight: 700; font-size: 14px; }
.student-meta { color: var(--muted); font-size: 12.5px; margin-top: 2px; }
.student-recs { color: var(--orange-dark); font-size: 12px; font-weight: 700; margin-top: 4px; }
.student-goal { display: flex; align-items: center; gap: 5px; color: var(--dark-1); font-size: 12px; font-weight: 700; margin-top: 4px; }
.score-badge { font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 999px; }
.score-badge.green { background: rgba(47,158,82,0.12); color: var(--green); }
.score-badge.orange { background: rgba(245,166,35,0.14); color: var(--orange-dark); }
.score-badge.red { background: rgba(224,85,63,0.12); color: var(--red); }
.student-actions { display: flex; gap: 8px; align-items: center; }

.select { border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; font-size: 12.5px; font-family: inherit; color: var(--ink); background: #FAFCFC; max-width: 220px; }
.select.full { width: 100%; margin-bottom: 14px; }
.deadline-picker { display: flex; align-items: center; gap: 6px; border: 1px solid var(--line); border-radius: 10px; padding: 7px 10px; background: #FAFCFC; color: var(--muted); }
.deadline-input { border: none; background: transparent; font-size: 12.5px; font-family: inherit; color: var(--ink); padding: 0; }
.deadline-input:disabled { color: var(--muted); }

.module-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.module-card { border: 1px solid var(--line); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.module-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.module-title { font-weight: 800; font-size: 14.5px; }
.level-tag { background: rgba(15,57,65,0.08); color: var(--dark-1); font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
.module-meta { color: var(--muted); font-size: 12px; }
.module-desc { color: var(--ink); font-size: 12.5px; line-height: 1.4; }
.module-video { display: flex; align-items: center; gap: 5px; color: var(--orange-dark); font-size: 12px; font-weight: 700; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.module-video:hover { text-decoration: underline; }

.btn { border-radius: 999px; font-weight: 700; padding: 10px 16px; font-size: 13.5px; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 6px; justify-content: center; }
.btn-solid { background: var(--orange); color: #26210a; }
.btn-solid:hover:not(:disabled) { background: #ffb63c; }
.btn-outline { background: transparent; border-color: var(--dark-1); color: var(--dark-1); }
.btn-outline:hover:not(:disabled) { background: rgba(15,57,65,0.06); }
.btn-sm { padding: 7px 12px; font-size: 12.5px; }
.btn-block { width: 100%; margin-top: 4px; }

/* modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(10,25,29,0.5); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 50; }
.modal { background: #fff; border-radius: 20px; padding: 26px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
.modal.wide { max-width: 720px; }
.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.modal-title { font-family: 'Unbounded', sans-serif; font-size: 18px; margin: 0; }
.icon-btn { background: none; border: none; color: var(--muted); padding: 4px; border-radius: 8px; display: flex; }
.icon-btn:hover { background: var(--cream); color: var(--ink); }
.icon-btn.small { padding: 2px; }

.field-label { display: block; font-weight: 700; font-size: 12.5px; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: .03em; color: var(--muted); }
.input, .textarea { width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; font-size: 14px; font-family: inherit; color: var(--ink); background: #FAFCFC; margin-bottom: 8px; }
.input:focus, .textarea:focus, .select:focus { border-color: var(--orange); background: #fff; }
.textarea { resize: vertical; }
.error-text { color: var(--red); font-size: 12.5px; margin-top: 8px; }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }

.editor-body { display: flex; flex-direction: column; gap: 22px; }
.editor-section-title { font-weight: 800; font-size: 14px; margin-bottom: 10px; }
.editor-add-row { display: flex; gap: 8px; margin-top: 6px; }
.upload-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.upload-label { position: relative; overflow: hidden; }
.file-input-hidden { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.block-preview { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid var(--line); }
.block-card { border: 1px solid var(--line); border-radius: 12px; padding: 12px; margin-bottom: 10px; }
.block-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; color: var(--muted); }
.block-type { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; }

.options-grid { display: flex; flex-direction: column; gap: 6px; }
.option-row { display: flex; align-items: center; gap: 8px; }
.option-row .input { margin-bottom: 0; }
.hint-text { color: var(--muted); font-size: 11.5px; margin-top: 4px; }

@media (max-width: 900px) {
  .student-row { grid-template-columns: 1fr; align-items: start; gap: 8px; }
  .student-actions { flex-wrap: wrap; }
}
@media (max-width: 720px) {
  .adm-app { flex-direction: column; }
  .sidebar { width: 100%; min-height: auto; flex-direction: row; align-items: center; padding: 12px 16px; }
  .sb-logo { padding: 0; margin-right: 16px; }
}
` ;