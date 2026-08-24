import React, { useState } from "react";
import { ArrowLeft, Check, Sun } from "lucide-react";

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

const QUESTION_BANK = {
  math: {
    junior: [
      { q: { ru: "Сколько будет 7 × 8?", kk: "7 × 8 нешеге тең?", en: "What is 7 × 8?" }, options: { ru: ["42", "54", "56", "64"], kk: ["42", "54", "56", "64"], en: ["42", "54", "56", "64"] }, correct: 2 },
      { q: { ru: "Реши уравнение: 2x + 3 = 11. Чему равен x?", kk: "Теңдеуді шеш: 2x + 3 = 11. x неге тең?", en: "Solve the equation: 2x + 3 = 11. What is x?" }, options: { ru: ["3", "4", "5", "7"], kk: ["3", "4", "5", "7"], en: ["3", "4", "5", "7"] }, correct: 1 },
      { q: { ru: "Чему равна площадь прямоугольника со сторонами 5 см и 4 см?", kk: "Қабырғалары 5 см және 4 см болатын тіктөртбұрыштың ауданы неге тең?", en: "What is the area of a rectangle with sides 5 cm and 4 cm?" }, options: { ru: ["9 см²", "18 см²", "20 см²", "22 см²"], kk: ["9 см²", "18 см²", "20 см²", "22 см²"], en: ["9 cm²", "18 cm²", "20 cm²", "22 cm²"] }, correct: 2 },
      { q: { ru: "Какое из чисел является простым?", kk: "Келесі сандардың қайсысы жай сан?", en: "Which of these numbers is prime?" }, options: { ru: ["21", "33", "37", "45"], kk: ["21", "33", "37", "45"], en: ["21", "33", "37", "45"] }, correct: 2 },
    ],
    senior: [
      { q: { ru: "Чему равна производная функции f(x) = x²?", kk: "f(x) = x² функциясының туындысы неге тең?", en: "What is the derivative of f(x) = x²?" }, options: { ru: ["x", "2x", "x²", "2"], kk: ["x", "2x", "x²", "2"], en: ["x", "2x", "x²", "2"] }, correct: 1 },
      { q: { ru: "При каком x верно неравенство x² − 4 > 0?", kk: "x² − 4 > 0 теңсіздігі қай x үшін дұрыс?", en: "For which x is the inequality x² − 4 > 0 true?" }, options: { ru: ["x = 0", "x = 1", "x = 2", "x = 3"], kk: ["x = 0", "x = 1", "x = 2", "x = 3"], en: ["x = 0", "x = 1", "x = 2", "x = 3"] }, correct: 3 },
      { q: { ru: "Чему равен log₂8?", kk: "log₂8 неге тең?", en: "What is log₂8?" }, options: { ru: ["2", "3", "4", "8"], kk: ["2", "3", "4", "8"], en: ["2", "3", "4", "8"] }, correct: 1 },
      { q: { ru: "Сумма первых 10 членов прогрессии 1, 3, 5, 7… равна?", kk: "1, 3, 5, 7… прогрессиясының алғашқы 10 мүшесінің қосындысы неге тең?", en: "What is the sum of the first 10 terms of the progression 1, 3, 5, 7…?" }, options: { ru: ["55", "90", "100", "110"], kk: ["55", "90", "100", "110"], en: ["55", "90", "100", "110"] }, correct: 2 },
    ],
  },
  physics: {
    junior: [
      { q: { ru: "В каких единицах измеряется сила?", kk: "Күш қандай бірлікпен өлшенеді?", en: "What unit is force measured in?" }, options: { ru: ["Джоуль", "Ньютон", "Ватт", "Паскаль"], kk: ["Джоуль", "Ньютон", "Ватт", "Паскаль"], en: ["Joule", "Newton", "Watt", "Pascal"] }, correct: 1 },
      { q: { ru: "Как меняется скорость при равномерном движении?", kk: "Бірқалыпты қозғалыста жылдамдық қалай өзгереді?", en: "How does speed change during uniform motion?" }, options: { ru: ["растёт", "падает", "не меняется", "равна нулю"], kk: ["артады", "кемиді", "өзгермейді", "нөлге тең"], en: ["increases", "decreases", "stays constant", "equals zero"] }, correct: 2 },
      { q: { ru: "Формула плотности вещества?", kk: "Зат тығыздығының формуласы қандай?", en: "What is the formula for the density of a substance?" }, options: { ru: ["m/V", "V/m", "m·V", "m+V"], kk: ["m/V", "V/m", "m·V", "m+V"], en: ["m/V", "V/m", "m·V", "m+V"] }, correct: 0 },
      { q: { ru: "Что измеряют термометром?", kk: "Термометрмен нені өлшейді?", en: "What does a thermometer measure?" }, options: { ru: ["давление", "температуру", "силу", "время"], kk: ["қысымды", "температураны", "күшті", "уақытты"], en: ["pressure", "temperature", "force", "time"] }, correct: 1 },
    ],
    senior: [
      { q: { ru: "Второй закон Ньютона выражается формулой:", kk: "Ньютонның екінші заңы қай формуламен өрнектеледі?", en: "Newton's second law is expressed by the formula:" }, options: { ru: ["F = ma", "F = mv", "E = mc²", "P = mgh"], kk: ["F = ma", "F = mv", "E = mc²", "P = mgh"], en: ["F = ma", "F = mv", "E = mc²", "P = mgh"] }, correct: 0 },
      { q: { ru: "В каких единицах измеряется работа?", kk: "Жұмыс қандай бірлікпен өлшенеді?", en: "What unit is work measured in?" }, options: { ru: ["Ватт", "Джоуль", "Ньютон", "Ом"], kk: ["Ватт", "Джоуль", "Ньютон", "Ом"], en: ["Watt", "Joule", "Newton", "Ohm"] }, correct: 1 },
      { q: { ru: "Ускорение свободного падения на Земле приблизительно равно:", kk: "Жердегі еркін түсу үдеуі шамамен неге тең?", en: "The acceleration of free fall on Earth is approximately:" }, options: { ru: ["3.8 м/с²", "9.8 м/с²", "15 м/с²", "1 м/с²"], kk: ["3.8 м/с²", "9.8 м/с²", "15 м/с²", "1 м/с²"], en: ["3.8 m/s²", "9.8 m/s²", "15 m/s²", "1 m/s²"] }, correct: 1 },
      { q: { ru: "Закон сохранения энергии гласит, что энергия:", kk: "Энергияның сақталу заңы бойынша, энергия:", en: "The law of conservation of energy states that energy:" }, options: { ru: ["исчезает бесследно", "переходит из одного вида в другой, не исчезая", "создаётся из ничего", "всегда равна массе"], kk: ["ізсіз жоғалады", "бір түрден екінші түрге өтеді, жоғалмайды", "ешнәрседен пайда болады", "әрқашан массаға тең"], en: ["disappears without a trace", "changes from one form to another without disappearing", "is created from nothing", "always equals mass"] }, correct: 1 },
    ],
  },
  chemistry: {
    junior: [
      { q: { ru: "Химический символ кислорода:", kk: "Оттегінің химиялық белгісі:", en: "The chemical symbol for oxygen is:" }, options: { ru: ["O", "Ox", "K", "Q"], kk: ["O", "Ox", "K", "Q"], en: ["O", "Ox", "K", "Q"] }, correct: 0 },
      { q: { ru: "Сколько протонов в атоме водорода?", kk: "Сутегі атомында қанша протон бар?", en: "How many protons are in a hydrogen atom?" }, options: { ru: ["0", "1", "2", "3"], kk: ["0", "1", "2", "3"], en: ["0", "1", "2", "3"] }, correct: 1 },
      { q: { ru: "Как называется смесь воды и соли?", kk: "Су мен тұздың қоспасы қалай аталады?", en: "What is a mixture of water and salt called?" }, options: { ru: ["раствор", "сплав", "кристалл", "эмульсия"], kk: ["ерітінді", "қорытпа", "кристалл", "эмульсия"], en: ["a solution", "an alloy", "a crystal", "an emulsion"] }, correct: 0 },
      { q: { ru: "Химическая формула воды:", kk: "Судың химиялық формуласы:", en: "The chemical formula of water is:" }, options: { ru: ["H2O", "CO2", "O2", "NaCl"], kk: ["H2O", "CO2", "O2", "NaCl"], en: ["H2O", "CO2", "O2", "NaCl"] }, correct: 0 },
    ],
    senior: [
      { q: { ru: "Какой тип связи в молекуле NaCl?", kk: "NaCl молекуласында қандай байланыс түрі бар?", en: "What type of bond is in the NaCl molecule?" }, options: { ru: ["ковалентная", "ионная", "металлическая", "водородная"], kk: ["коваленттік", "иондық", "металдық", "сутектік"], en: ["covalent", "ionic", "metallic", "hydrogen"] }, correct: 1 },
      { q: { ru: "Чему равен pH нейтрального раствора?", kk: "Бейтарап ерітіндінің pH мәні неге тең?", en: "What is the pH of a neutral solution?" }, options: { ru: ["0", "7", "14", "1"], kk: ["0", "7", "14", "1"], en: ["0", "7", "14", "1"] }, correct: 1 },
      { q: { ru: "Какой газ выделяется при реакции металла с кислотой?", kk: "Металл қышқылмен әрекеттескенде қандай газ бөлінеді?", en: "What gas is released when a metal reacts with an acid?" }, options: { ru: ["кислород", "водород", "азот", "углекислый газ"], kk: ["оттегі", "сутегі", "азот", "көмірқышқыл газы"], en: ["oxygen", "hydrogen", "nitrogen", "carbon dioxide"] }, correct: 1 },
      { q: { ru: "Какова валентность кислорода в большинстве соединений?", kk: "Көптеген қосылыстарда оттегінің валенттілігі қандай?", en: "What is the valence of oxygen in most compounds?" }, options: { ru: ["1", "2", "3", "4"], kk: ["1", "2", "3", "4"], en: ["1", "2", "3", "4"] }, correct: 1 },
    ],
  },
  biology: {
    junior: [
      { q: { ru: "Основная функция хлорофилла:", kk: "Хлорофилдің негізгі қызметі:", en: "The main function of chlorophyll is:" }, options: { ru: ["дыхание", "фотосинтез", "пищеварение", "размножение"], kk: ["тыныс алу", "фотосинтез", "ас қорыту", "көбею"], en: ["respiration", "photosynthesis", "digestion", "reproduction"] }, correct: 1 },
      { q: { ru: "Сколько камер в сердце человека?", kk: "Адам жүрегінде неше камера бар?", en: "How many chambers does the human heart have?" }, options: { ru: ["2", "3", "4", "5"], kk: ["2", "3", "4", "5"], en: ["2", "3", "4", "5"] }, correct: 2 },
      { q: { ru: "Какая клетка крови отвечает за иммунитет?", kk: "Иммунитетке жауап беретін қан клеткасы қайсы?", en: "Which blood cell is responsible for immunity?" }, options: { ru: ["эритроцит", "лейкоцит", "тромбоцит", "остеоцит"], kk: ["эритроцит", "лейкоцит", "тромбоцит", "остеоцит"], en: ["red blood cell", "white blood cell", "platelet", "osteocyte"] }, correct: 1 },
      { q: { ru: "Как называется процесс деления клетки?", kk: "Клетканың бөліну процесі қалай аталады?", en: "What is the process of cell division called?" }, options: { ru: ["митоз", "осмос", "диффузия", "фотосинтез"], kk: ["митоз", "осмос", "диффузия", "фотосинтез"], en: ["mitosis", "osmosis", "diffusion", "photosynthesis"] }, correct: 0 },
    ],
    senior: [
      { q: { ru: "Основной носитель наследственной информации в клетке:", kk: "Клеткадағы тұқым қуалау ақпаратының негізгі тасымалдаушысы:", en: "The main carrier of hereditary information in a cell is:" }, options: { ru: ["ДНК", "АТФ", "РНК-полимераза", "рибосома"], kk: ["ДНҚ", "АТФ", "РНҚ-полимераза", "рибосома"], en: ["DNA", "ATP", "RNA polymerase", "ribosome"] }, correct: 0 },
      { q: { ru: "Что такое ген?", kk: "Ген деген не?", en: "What is a gene?" }, options: { ru: ["участок ДНК, кодирующий белок", "вид клетки", "органоид клетки", "фермент"], kk: ["ақуызды кодтайтын ДНҚ бөлігі", "клетка түрі", "клетка органоиды", "фермент"], en: ["a segment of DNA that codes for a protein", "a type of cell", "a cell organelle", "an enzyme"] }, correct: 0 },
      { q: { ru: "Как называется процесс превращения глюкозы в энергию без кислорода?", kk: "Глюкозаның оттегісіз энергияға айналу процесі қалай аталады?", en: "What is the process of converting glucose into energy without oxygen called?" }, options: { ru: ["фотосинтез", "гликолиз", "транскрипция", "мутация"], kk: ["фотосинтез", "гликолиз", "транскрипция", "мутация"], en: ["photosynthesis", "glycolysis", "transcription", "mutation"] }, correct: 1 },
      { q: { ru: "Какая структура клетки отвечает за синтез белка?", kk: "Ақуыз синтезіне жауап беретін клетка құрылымы қайсы?", en: "Which cell structure is responsible for protein synthesis?" }, options: { ru: ["митохондрия", "рибосома", "ядро", "лизосома"], kk: ["митохондрия", "рибосома", "ядро", "лизосома"], en: ["mitochondria", "ribosome", "nucleus", "lysosome"] }, correct: 1 },
    ],
  },
  kz_history: {
    junior: [
      { q: { ru: "В каком году Казахстан обрёл независимость?", kk: "Қазақстан қай жылы тәуелсіздік алды?", en: "In what year did Kazakhstan gain independence?" }, options: { ru: ["1989", "1991", "1993", "1995"], kk: ["1989", "1991", "1993", "1995"], en: ["1989", "1991", "1993", "1995"] }, correct: 1 },
      { q: { ru: "Как назывался город Алматы до революции?", kk: "Алматы қаласы революцияға дейін қалай аталды?", en: "What was Almaty called before the revolution?" }, options: { ru: ["Верный", "Ак-Мечеть", "Туркестан", "Семипалатинск"], kk: ["Верный", "Ақ мешіт", "Түркістан", "Семей"], en: ["Verny", "Ak-Mechet", "Turkestan", "Semipalatinsk"] }, correct: 0 },
      { q: { ru: "Какой город является столицей Казахстана сегодня?", kk: "Бүгінде Қазақстанның астанасы қай қала?", en: "Which city is the capital of Kazakhstan today?" }, options: { ru: ["Алматы", "Астана", "Шымкент", "Караганда"], kk: ["Алматы", "Астана", "Шымкент", "Қарағанды"], en: ["Almaty", "Astana", "Shymkent", "Karaganda"] }, correct: 1 },
      { q: { ru: "Кто был первым Президентом Республики Казахстан?", kk: "Қазақстан Республикасының тұңғыш Президенті кім болды?", en: "Who was the first President of the Republic of Kazakhstan?" }, options: { ru: ["Н. Назарбаев", "К. Токаев", "Д. Кунаев", "М. Ауэзов"], kk: ["Н. Назарбаев", "Қ. Тоқаев", "Д. Қонаев", "М. Әуезов"], en: ["N. Nazarbayev", "K. Tokayev", "D. Kunayev", "M. Auezov"] }, correct: 0 },
    ],
    senior: [
      { q: { ru: "В каком году Казахстан вступил в ООН?", kk: "Қазақстан БҰҰ-ға қай жылы кірді?", en: "In what year did Kazakhstan join the UN?" }, options: { ru: ["1991", "1992", "1995", "2000"], kk: ["1991", "1992", "1995", "2000"], en: ["1991", "1992", "1995", "2000"] }, correct: 1 },
      { q: { ru: "В каком веке произошло восстание Кенесары Касымова?", kk: "Кенесары Қасымұлы көтерілісі қай ғасырда болды?", en: "In which century did the uprising of Kenesary Kasymov take place?" }, options: { ru: ["17 век", "18 век", "19 век", "20 век"], kk: ["17 ғасыр", "18 ғасыр", "19 ғасыр", "20 ғасыр"], en: ["17th century", "18th century", "19th century", "20th century"] }, correct: 2 },
      { q: { ru: "Голод в Казахстане в начале 1930-х годов был связан с:", kk: "1930 жылдардың басындағы Қазақстандағы ашаршылық немен байланысты болды?", en: "The famine in Kazakhstan in the early 1930s was linked to:" }, options: { ru: ["коллективизацией", "войной", "засухой", "эпидемией"], kk: ["ұжымдастырумен", "соғыспен", "құрғақшылықпен", "індетпен"], en: ["collectivization", "war", "drought", "an epidemic"] }, correct: 0 },
      { q: { ru: "В каком году Н. Назарбаев ушёл с поста президента?", kk: "Н. Назарбаев президент қызметінен қай жылы кетті?", en: "In what year did N. Nazarbayev step down as president?" }, options: { ru: ["2015", "2019", "2020", "2022"], kk: ["2015", "2019", "2020", "2022"], en: ["2015", "2019", "2020", "2022"] }, correct: 1 },
    ],
  },
  world_history: {
    junior: [
      { q: { ru: "Кто открыл Америку в 1492 году?", kk: "1492 жылы Американы кім ашты?", en: "Who discovered America in 1492?" }, options: { ru: ["Колумб", "Магеллан", "Кук", "да Гама"], kk: ["Колумб", "Магеллан", "Кук", "да Гама"], en: ["Columbus", "Magellan", "Cook", "da Gama"] }, correct: 0 },
      { q: { ru: "В каком году началась Первая мировая война?", kk: "Бірінші дүниежүзілік соғыс қай жылы басталды?", en: "In what year did World War I begin?" }, options: { ru: ["1912", "1914", "1918", "1920"], kk: ["1912", "1914", "1918", "1920"], en: ["1912", "1914", "1918", "1920"] }, correct: 1 },
      { q: { ru: "Какая цивилизация построила пирамиды в Гизе?", kk: "Гизадағы пирамидаларды қай өркениет салды?", en: "Which civilization built the pyramids at Giza?" }, options: { ru: ["Древний Египет", "Древний Рим", "Древняя Греция", "Месопотамия"], kk: ["Ежелгі Мысыр", "Ежелгі Рим", "Ежелгі Греция", "Месопотамия"], en: ["Ancient Egypt", "Ancient Rome", "Ancient Greece", "Mesopotamia"] }, correct: 0 },
      { q: { ru: "В каком году началась Великая французская революция?", kk: "Ұлы Француз революциясы қай жылы басталды?", en: "In what year did the French Revolution begin?" }, options: { ru: ["1789", "1799", "1804", "1815"], kk: ["1789", "1799", "1804", "1815"], en: ["1789", "1799", "1804", "1815"] }, correct: 0 },
    ],
    senior: [
      { q: { ru: "В каком году закончилась Вторая мировая война?", kk: "Екінші дүниежүзілік соғыс қай жылы аяқталды?", en: "In what year did World War II end?" }, options: { ru: ["1943", "1944", "1945", "1946"], kk: ["1943", "1944", "1945", "1946"], en: ["1943", "1944", "1945", "1946"] }, correct: 2 },
      { q: { ru: "Между какими странами велась Холодная война?", kk: "Суық соғыс қай елдер арасында жүрді?", en: "Between which countries was the Cold War fought?" }, options: { ru: ["СССР и США", "Англией и Францией", "Китаем и Японией", "Германией и Италией"], kk: ["КСРО мен АҚШ", "Англия мен Франция", "Қытай мен Жапония", "Германия мен Италия"], en: ["USSR and USA", "England and France", "China and Japan", "Germany and Italy"] }, correct: 0 },
      { q: { ru: "В каком году пала Берлинская стена?", kk: "Берлин қабырғасы қай жылы құлады?", en: "In what year did the Berlin Wall fall?" }, options: { ru: ["1985", "1989", "1991", "1993"], kk: ["1985", "1989", "1991", "1993"], en: ["1985", "1989", "1991", "1993"] }, correct: 1 },
      { q: { ru: "Кто возглавлял СССР во время Карибского кризиса?", kk: "Кариб дағдарысы кезінде КСРО-ны кім басқарды?", en: "Who led the USSR during the Cuban Missile Crisis?" }, options: { ru: ["Сталин", "Хрущёв", "Брежнев", "Горбачёв"], kk: ["Сталин", "Хрущев", "Брежнев", "Горбачев"], en: ["Stalin", "Khrushchev", "Brezhnev", "Gorbachev"] }, correct: 1 },
    ],
  },
  geography: {
    junior: [
      { q: { ru: "Какая река считается самой длинной в мире?", kk: "Әлемдегі ең ұзын өзен қайсы деп саналады?", en: "Which river is considered the longest in the world?" }, options: { ru: ["Нил", "Амазонка", "Волга", "Иртыш"], kk: ["Ніл", "Амазонка", "Еділ", "Ертіс"], en: ["The Nile", "The Amazon", "The Volga", "The Irtysh"] }, correct: 0 },
      { q: { ru: "Какой океан самый большой по площади?", kk: "Ауданы бойынша ең үлкен мұхит қайсы?", en: "Which ocean is the largest by area?" }, options: { ru: ["Атлантический", "Тихий", "Индийский", "Северный Ледовитый"], kk: ["Атлант мұхиты", "Тынық мұхит", "Үнді мұхиты", "Солтүстік Мұзды мұхит"], en: ["Atlantic", "Pacific", "Indian", "Arctic"] }, correct: 1 },
      { q: { ru: "На какой реке расположена Астана?", kk: "Астана қай өзеннің жағасында орналасқан?", en: "On which river is Astana located?" }, options: { ru: ["Иртыш", "Есиль (Ишим)", "Урал", "Сырдарья"], kk: ["Ертіс", "Есіл", "Орал", "Сырдария"], en: ["Irtysh", "Esil (Ishim)", "Ural", "Syr Darya"] }, correct: 1 },
      { q: { ru: "Какая гора самая высокая в мире?", kk: "Әлемдегі ең биік тау қайсы?", en: "Which is the highest mountain in the world?" }, options: { ru: ["Эверест", "Килиманджаро", "Эльбрус", "Хан-Тенгри"], kk: ["Эверест", "Килиманджаро", "Эльбрус", "Хан Тәңірі"], en: ["Everest", "Kilimanjaro", "Elbrus", "Khan Tengri"] }, correct: 0 },
    ],
    senior: [
      { q: { ru: "Какое государство крупнейшее по площади?", kk: "Ауданы бойынша ең үлкен мемлекет қайсы?", en: "Which country is the largest by area?" }, options: { ru: ["Россия", "Канада", "Китай", "США"], kk: ["Ресей", "Канада", "Қытай", "АҚШ"], en: ["Russia", "Canada", "China", "USA"] }, correct: 0 },
      { q: { ru: "Каспийское море с географической точки зрения — это:", kk: "Каспий теңізі географиялық тұрғыдан — бұл:", en: "Geographically, the Caspian Sea is:" }, options: { ru: ["озеро", "море", "океан", "залив"], kk: ["көл", "теңіз", "мұхит", "шығанақ"], en: ["a lake", "a sea", "an ocean", "a bay"] }, correct: 0 },
      { q: { ru: "С какой из перечисленных стран Казахстан НЕ граничит?", kk: "Аталған елдердің қайсысымен Қазақстан шекараласпайды?", en: "Which of the following countries does Kazakhstan NOT border?" }, options: { ru: ["Россия", "Китай", "Узбекистан", "Индия"], kk: ["Ресей", "Қытай", "Өзбекстан", "Үндістан"], en: ["Russia", "China", "Uzbekistan", "India"] }, correct: 3 },
      { q: { ru: "Какой тип климата преобладает на большей части Казахстана?", kk: "Қазақстанның көп бөлігінде қандай климат түрі басым?", en: "Which climate type predominates over most of Kazakhstan?" }, options: { ru: ["тропический", "резко континентальный", "экваториальный", "морской"], kk: ["тропикалық", "күрт континенттік", "экваторлық", "теңіздік"], en: ["tropical", "sharply continental", "equatorial", "maritime"] }, correct: 1 },
    ],
  },
  kazakh: {
    junior: [
      { q: { ru: "Как переводится слово «Рахмет»?", kk: "«Рахмет» сөзі қалай аударылады?", en: "How does the word «Рахмет» (Rakhmet) translate?" }, options: { ru: ["Здравствуйте", "Спасибо", "Пожалуйста", "До свидания"], kk: ["Сәлеметсіз бе", "Рахмет", "Өтінемін", "Сау болыңыз"], en: ["Hello", "Thank you", "Please", "Goodbye"] }, correct: 1 },
      { q: { ru: "Сколько букв в казахском алфавите (кириллица)?", kk: "Қазақ әліпбиінде (кирилл) неше әріп бар?", en: "How many letters are in the Kazakh alphabet (Cyrillic)?" }, options: { ru: ["33", "42", "26", "28"], kk: ["33", "42", "26", "28"], en: ["33", "42", "26", "28"] }, correct: 1 },
      { q: { ru: "Как будет «книга» на казахском языке?", kk: "«Кітап» сөзінің дұрыс жазылуын көрсетіңіз.", en: "How do you say \"book\" in Kazakh?" }, options: { ru: ["кітап", "дәптер", "қалам", "парта"], kk: ["кітап", "дәптер", "қалам", "парта"], en: ["kітап", "dәptеr", "qalam", "parta"] }, correct: 0 },
      { q: { ru: "Что означает фраза «Сәлеметсіз бе»?", kk: "«Сәлеметсіз бе» тіркесі нені білдіреді?", en: "What does the phrase «Сәлеметсіз бе» mean?" }, options: { ru: ["До свидания", "Здравствуйте", "Спасибо", "Извините"], kk: ["Сау болыңыз", "Сәлеметсіз бе", "Рахмет", "Кешіріңіз"], en: ["Goodbye", "Hello", "Thank you", "Sorry"] }, correct: 1 },
    ],
    senior: [
      { q: { ru: "Какой падеж отвечает на вопрос «кімнің?» (чей?)", kk: "«Кімнің?» сұрағына қай септік жауап береді?", en: "Which grammatical case answers the question «кімнің?» (whose?)" }, options: { ru: ["Атау септік", "Ілік септік", "Барыс септік", "Табыс септік"], kk: ["Атау септік", "Ілік септік", "Барыс септік", "Табыс септік"], en: ["Nominative case", "Genitive case", "Dative case", "Accusative case"] }, correct: 1 },
      { q: { ru: "Кто автор романа-эпопеи «Абай жолы»?", kk: "«Абай жолы» роман-эпопеясының авторы кім?", en: "Who is the author of the epic novel «Абай жолы» (The Path of Abai)?" }, options: { ru: ["Абай Кунанбаев", "Мухтар Ауэзов", "Жамбыл Жабаев", "Ілияс Жансүгіров"], kk: ["Абай Құнанбаев", "Мұхтар Әуезов", "Жамбыл Жабаев", "Ілияс Жансүгіров"], en: ["Abai Kunanbayev", "Mukhtar Auezov", "Zhambyl Zhabayev", "Ilyas Zhansugurov"] }, correct: 1 },
      { q: { ru: "Сколько гласных букв в казахском алфавите?", kk: "Қазақ әліпбиінде неше дауысты дыбыс бар?", en: "How many vowel letters are there in the Kazakh alphabet?" }, options: { ru: ["9", "10", "12", "15"], kk: ["9", "10", "12", "15"], en: ["9", "10", "12", "15"] }, correct: 0 },
      { q: { ru: "Как переводится выражение «Ұлы дала»?", kk: "«Ұлы дала» тіркесі қалай аударылады?", en: "How does the phrase «Ұлы дала» translate?" }, options: { ru: ["Великая степь", "Синее небо", "Золотой человек", "Родная земля"], kk: ["Ұлы дала", "Көк аспан", "Алтын адам", "Туған жер"], en: ["The Great Steppe", "The Blue Sky", "The Golden Man", "Native land"] }, correct: 0 },
    ],
  },
  russian: {
    junior: [
      { q: { ru: "Сколько падежей в русском языке?", kk: "Орыс тілінде неше септік бар?", en: "How many grammatical cases are there in Russian?" }, options: { ru: ["4", "5", "6", "7"], kk: ["4", "5", "6", "7"], en: ["4", "5", "6", "7"] }, correct: 2 },
      { q: { ru: "Какое из слов относится к 1-му склонению?", kk: "Берілген сөздердің қайсысы 1-ші түрлену тобына жатады?", en: "Which of the words belongs to the 1st declension?" }, options: { ru: ["стол", "книга", "окно", "время"], kk: ["стол", "книга", "окно", "время"], en: ["стол (table)", "книга (book)", "окно (window)", "время (time)"] }, correct: 1 },
      { q: { ru: "Как пишется частица «не» с глаголами в большинстве случаев?", kk: "«Не» демеулігі етістіктермен көп жағдайда қалай жазылады?", en: "How is the particle «не» (not) usually written with verbs?" }, options: { ru: ["всегда слитно", "всегда раздельно", "по-разному", "только с приставками"], kk: ["әрқашан бірге", "әрқашан бөлек", "түрліше", "тек префикспен"], en: ["always together", "always separately", "it varies", "only with prefixes"] }, correct: 1 },
      { q: { ru: "Какой знак ставится в конце вопросительного предложения?", kk: "Сұраулы сөйлемнің соңында қандай белгі қойылады?", en: "What punctuation mark is placed at the end of an interrogative sentence?" }, options: { ru: ["точка", "запятая", "вопросительный знак", "двоеточие"], kk: ["нүкте", "үтір", "сұрау белгісі", "қос нүкте"], en: ["a period", "a comma", "a question mark", "a colon"] }, correct: 2 },
    ],
    senior: [
      { q: { ru: "От какой части речи образуется причастие?", kk: "Көсемше қай сөз табынан жасалады?", en: "From which part of speech is a participle formed?" }, options: { ru: ["существительного", "глагола", "прилагательного", "наречия"], kk: ["зат есімнен", "етістіктен", "сын есімнен", "үстеуден"], en: ["a noun", "a verb", "an adjective", "an adverb"] }, correct: 1 },
      { q: { ru: "Из чего состоит сложноподчинённое предложение?", kk: "Салалас құрмалас сөйлем неден тұрады?", en: "What does a complex sentence consist of?" }, options: { ru: ["из двух равноправных частей", "из главной и придаточной части", "только из придаточных", "из одной части"], kk: ["екі тең бөліктен", "басыңқы және бағыныңқы бөліктен", "тек бағыныңқы бөліктерден", "бір бөліктен"], en: ["two equal parts", "a main and a subordinate clause", "only subordinate clauses", "a single part"] }, correct: 1 },
      { q: { ru: "Какой стиль речи используется в научных статьях?", kk: "Ғылыми мақалаларда қандай сөйлеу стилі қолданылады?", en: "Which style of speech is used in scientific articles?" }, options: { ru: ["разговорный", "художественный", "научный", "публицистический"], kk: ["сөйлесу стилі", "көркем стиль", "ғылыми стиль", "публицистикалық стиль"], en: ["conversational", "literary", "scientific", "journalistic"] }, correct: 2 },
      { q: { ru: "На какой вопрос отвечает деепричастие?", kk: "Көсемше қай сұраққа жауап береді?", en: "What question does a gerund (деепричастие) answer?" }, options: { ru: ["какой?", "что делая?", "чей?", "сколько?"], kk: ["қандай?", "не істеп?", "кімдікі?", "қанша?"], en: ["which one?", "doing what?", "whose?", "how many?"] }, correct: 1 },
    ],
  },
  english: {
    junior: [
      { q: { ru: "Выберите правильную форму: \"She ___ to school every day.\"", kk: "Дұрыс нұсқасын таңдаңыз: \"She ___ to school every day.\"", en: "Choose the correct form: \"She ___ to school every day.\"" }, options: { ru: ["go", "goes", "going", "gone"], kk: ["go", "goes", "going", "gone"], en: ["go", "goes", "going", "gone"] }, correct: 1 },
      { q: { ru: "Как будет множественное число от \"child\"?", kk: "\"Child\" сөзінің көпше түрі қалай болады?", en: "What is the plural of \"child\"?" }, options: { ru: ["childs", "children", "childes", "child"], kk: ["childs", "children", "childes", "child"], en: ["childs", "children", "childes", "child"] }, correct: 1 },
      { q: { ru: "Переведите «яблоко» на английский:", kk: "«Алма» сөзін ағылшын тіліне аударыңыз:", en: "Translate \"apple\" is the English word for:" }, options: { ru: ["apple", "orange", "banana", "grape"], kk: ["apple", "orange", "banana", "grape"], en: ["apple", "orange", "banana", "grape"] }, correct: 0 },
      { q: { ru: "Выберите правильную форму прошедшего времени глагола \"go\":", kk: "\"Go\" етістігінің дұрыс өткен шақ түрін таңдаңыз:", en: "Choose the correct past tense of \"go\":" }, options: { ru: ["goed", "went", "gone", "going"], kk: ["goed", "went", "gone", "going"], en: ["goed", "went", "gone", "going"] }, correct: 1 },
    ],
    senior: [
      { q: { ru: "Выберите правильное условное предложение: \"If I ___ rich, I would travel.\"", kk: "Дұрыс шартты сөйлемді таңдаңыз: \"If I ___ rich, I would travel.\"", en: "Choose the correct conditional: \"If I ___ rich, I would travel.\"" }, options: { ru: ["am", "was", "were", "will be"], kk: ["am", "was", "were", "will be"], en: ["am", "was", "were", "will be"] }, correct: 2 },
      { q: { ru: "Выберите синоним слова \"difficult\":", kk: "\"Difficult\" сөзінің синонимін таңдаңыз:", en: "Choose a synonym of \"difficult\":" }, options: { ru: ["easy", "hard", "simple", "quick"], kk: ["easy", "hard", "simple", "quick"], en: ["easy", "hard", "simple", "quick"] }, correct: 1 },
      { q: { ru: "Какое предложение в страдательном залоге?", kk: "Қай сөйлем страдательный (пассив) шақта тұр?", en: "Which sentence is in the passive voice?" }, options: { ru: ["He wrote a letter.", "A letter was written by him.", "He is writing a letter.", "He will write a letter."], kk: ["He wrote a letter.", "A letter was written by him.", "He is writing a letter.", "He will write a letter."], en: ["He wrote a letter.", "A letter was written by him.", "He is writing a letter.", "He will write a letter."] }, correct: 1 },
      { q: { ru: "Выберите правильный артикль: \"___ Eiffel Tower is in Paris.\"", kk: "Дұрыс артикльді таңдаңыз: \"___ Eiffel Tower is in Paris.\"", en: "Choose the correct article: \"___ Eiffel Tower is in Paris.\"" }, options: { ru: ["A", "An", "The", "(no article)"], kk: ["A", "An", "The", "(no article)"], en: ["A", "An", "The", "(no article)"] }, correct: 2 },
    ],
  },
  informatics: {
    junior: [
      { q: { ru: "Что такое алгоритм?", kk: "Алгоритм деген не?", en: "What is an algorithm?" }, options: { ru: ["набор случайных действий", "последовательность шагов для решения задачи", "язык программирования", "устройство компьютера"], kk: ["кездейсоқ әрекеттер жиынтығы", "есепті шешу үшін қадамдар тізбегі", "бағдарламалау тілі", "компьютер құрылғысы"], en: ["a set of random actions", "a sequence of steps to solve a problem", "a programming language", "a computer device"] }, correct: 1 },
      { q: { ru: "В какой системе счисления работают компьютеры?", kk: "Компьютерлер қай санау жүйесінде жұмыс істейді?", en: "What number system do computers work in?" }, options: { ru: ["десятичной", "двоичной", "восьмеричной", "шестнадцатеричной"], kk: ["ондық", "екілік", "сегіздік", "он алтылық"], en: ["decimal", "binary", "octal", "hexadecimal"] }, correct: 1 },
      { q: { ru: "Что означает аббревиатура CPU?", kk: "CPU аббревиатурасы нені білдіреді?", en: "What does the abbreviation CPU stand for?" }, options: { ru: ["Central Processing Unit", "Central Program Utility", "Computer Personal Unit", "Control Processing Unit"], kk: ["Central Processing Unit", "Central Program Utility", "Computer Personal Unit", "Control Processing Unit"], en: ["Central Processing Unit", "Central Program Utility", "Computer Personal Unit", "Control Processing Unit"] }, correct: 0 },
      { q: { ru: "Какое расширение обычно имеют файлы изображений?", kk: "Сурет файлдарының әдеттегі кеңейтімі қандай?", en: "What extension do image files usually have?" }, options: { ru: [".docx", ".jpg", ".exe", ".mp3"], kk: [".docx", ".jpg", ".exe", ".mp3"], en: [".docx", ".jpg", ".exe", ".mp3"] }, correct: 1 },
    ],
    senior: [
      { q: { ru: "Что такое переменная в программировании?", kk: "Бағдарламалаудағы айнымалы деген не?", en: "What is a variable in programming?" }, options: { ru: ["ячейка памяти для хранения данных", "тип цикла", "функция", "оператор"], kk: ["деректерді сақтауға арналған жад ұяшығы", "цикл түрі", "функция", "оператор"], en: ["a memory cell for storing data", "a type of loop", "a function", "an operator"] }, correct: 0 },
      { q: { ru: "Какой оператор используется для сравнения на равенство в большинстве языков?", kk: "Көптеген тілдерде теңдікті салыстыру үшін қандай оператор қолданылады?", en: "Which operator is used to compare for equality in most languages?" }, options: { ru: ["=", "==", "!=", "<>"], kk: ["=", "==", "!=", "<>"], en: ["=", "==", "!=", "<>"] }, correct: 1 },
      { q: { ru: "Что делает цикл \"for\"?", kk: "\"For\" циклі не істейді?", en: "What does a \"for\" loop do?" }, options: { ru: ["повторяет действия заданное число раз", "останавливает программу", "создаёт переменную", "удаляет файл"], kk: ["әрекеттерді берілген санда қайталайды", "бағдарламаны тоқтатады", "айнымалы жасайды", "файлды жояды"], en: ["repeats actions a set number of times", "stops the program", "creates a variable", "deletes a file"] }, correct: 0 },
      { q: { ru: "Что такое база данных?", kk: "Дерекқор деген не?", en: "What is a database?" }, options: { ru: ["организованный набор данных", "язык программирования", "тип процессора", "антивирус"], kk: ["ұйымдастырылған деректер жиынтығы", "бағдарламалау тілі", "процессор түрі", "антивирус"], en: ["an organized collection of data", "a programming language", "a type of processor", "an antivirus"] }, correct: 0 },
    ],
  },
  reading: {
    junior: [
      { q: { ru: "Что такое основная мысль текста?", kk: "Мәтіннің негізгі ойы деген не?", en: "What is the main idea of a text?" }, options: { ru: ["первое предложение", "главная идея всего текста", "последнее слово", "заголовок"], kk: ["бірінші сөйлем", "бүкіл мәтіннің басты идеясы", "соңғы сөз", "тақырып"], en: ["the first sentence", "the central idea of the whole text", "the last word", "the title"] }, correct: 1 },
      { q: { ru: "Как называется краткая письменная запись содержания текста?", kk: "Мәтін мазмұнының қысқаша жазбасы қалай аталады?", en: "What is a brief written record of a text's content called?" }, options: { ru: ["цитата", "план", "конспект", "эпиграф"], kk: ["дәйексөз", "жоспар", "конспект", "эпиграф"], en: ["a quote", "an outline", "a summary", "an epigraph"] }, correct: 2 },
      { q: { ru: "Что помогает понять значение незнакомого слова в тексте?", kk: "Мәтіндегі бейтаныс сөздің мағынасын түсінуге не көмектеседі?", en: "What helps you understand the meaning of an unfamiliar word in a text?" }, options: { ru: ["контекст", "шрифт", "длина текста", "автор"], kk: ["контекст", "қаріп", "мәтіннің ұзындығы", "автор"], en: ["context", "font", "text length", "the author"] }, correct: 0 },
      { q: { ru: "Что такое абзац?", kk: "Абзац деген не?", en: "What is a paragraph?" }, options: { ru: ["часть текста, объединённая одной мыслью", "всё произведение", "заголовок", "список"], kk: ["бір ойға біріктірілген мәтін бөлігі", "бүкіл шығарма", "тақырып", "тізім"], en: ["a part of a text unified by one idea", "the entire work", "a title", "a list"] }, correct: 0 },
    ],
    senior: [
      { q: { ru: "Как называется скрытый смысл текста, не выраженный прямо?", kk: "Тікелей айтылмаған мәтіннің жасырын мағынасы қалай аталады?", en: "What is the hidden meaning of a text, not stated directly, called?" }, options: { ru: ["подтекст", "эпиграф", "аннотация", "сноска"], kk: ["астарлы мағына", "эпиграф", "аннотация", "сілтеме"], en: ["subtext", "epigraph", "annotation", "footnote"] }, correct: 0 },
      { q: { ru: "Что такое аргумент в тексте-рассуждении?", kk: "Пікірталас мәтініндегі аргумент деген не?", en: "What is an argument in a persuasive text?" }, options: { ru: ["вывод", "довод в поддержку мысли", "заголовок", "факт без объяснения"], kk: ["қорытынды", "ойды қолдайтын дәлел", "тақырып", "түсіндірмесіз факт"], en: ["a conclusion", "a reason supporting an idea", "a title", "a fact without explanation"] }, correct: 1 },
      { q: { ru: "Что такое аннотация к книге?", kk: "Кітапқа аннотация деген не?", en: "What is a book annotation?" }, options: { ru: ["подробный пересказ", "краткое описание содержания", "список глав", "отзыв читателя"], kk: ["толық қайталама баяндау", "мазмұнның қысқаша сипаттамасы", "тараулар тізімі", "оқырман пікірі"], en: ["a detailed retelling", "a brief description of the content", "a list of chapters", "a reader's review"] }, correct: 1 },
      { q: { ru: "Какой тип текста используется, чтобы убедить читателя в чём-то?", kk: "Оқырманды бір нәрсеге сендіру үшін қандай мәтін түрі қолданылады?", en: "What type of text is used to persuade the reader of something?" }, options: { ru: ["повествование", "описание", "рассуждение", "инструкция"], kk: ["баяндау", "сипаттау", "пайымдау", "нұсқаулық"], en: ["narrative", "description", "argumentation", "instruction"] }, correct: 2 },
    ],
  },
};

const T = {
  ru: {
    title: "Диагностика уровня",
    subtitle: "Ответьте на несколько вопросов по каждому предмету — это займёт пару минут.",
    progress: (i, n) => `Вопрос ${i} из ${n}`,
    next: "Далее",
    finish: "Завершить",
    backHome: "На главную",
    noSubjects: "Сначала выберите хотя бы один предмет при регистрации.",
    resultTitle: "Диагностика завершена",
    resultText: (score, total) => `Правильных ответов: ${score} из ${total}`,
    goCabinet: "Перейти в кабинет",
  },
  kk: {
    title: "Деңгей диагностикасы",
    subtitle: "Әр пән бойынша бірнеше сұраққа жауап беріңіз — бұл бірнеше минут алады.",
    progress: (i, n) => `${n} сұрақтың ${i}-і`,
    next: "Келесі",
    finish: "Аяқтау",
    backHome: "Басты бетке",
    noSubjects: "Алдымен тіркелу кезінде кемінде бір пән таңдаңыз.",
    resultTitle: "Диагностика аяқталды",
    resultText: (score, total) => `Дұрыс жауаптар: ${total}-дан ${score}`,
    goCabinet: "Кабинетке өту",
  },
  en: {
    title: "Level diagnostics",
    subtitle: "Answer a few questions for each subject — it takes a couple of minutes.",
    progress: (i, n) => `Question ${i} of ${n}`,
    next: "Next",
    finish: "Finish",
    backHome: "Back to home",
    noSubjects: "Select at least one subject when you register first.",
    resultTitle: "Diagnostics complete",
    resultText: (score, total) => `Correct answers: ${score} of ${total}`,
    goCabinet: "Go to dashboard",
  },
};

function tierForGrade(grade) {
  return grade && grade <= 9 ? "junior" : "senior";
}

function buildQuestions(subjects, grade) {
  const tier = tierForGrade(grade);
  const list = [];
  (subjects || []).forEach((key) => {
    const bank = QUESTION_BANK[key];
    if (!bank) return;
    const set = bank[tier] || bank.junior;
    set.forEach((item, i) => list.push({ subjectKey: key, id: `${key}-${i}`, ...item }));
  });
  return list;
}

export default function DiagnosticsPage({ lang = "ru", grade, subjects = [], onBack, onFinish }) {
  const t = T[lang] || T.ru;
  const langKey = lang === "kk" ? "kk" : lang === "en" ? "en" : "ru";
  const [questions] = useState(() => buildQuestions(subjects, grade));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const total = questions.length;

  const next = () => {
    const updated = [...answers, selected];
    setAnswers(updated);
    setSelected(null);
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  // Per-subject breakdown ({ subjectKey, correct, total }[]), built from the
  // same answers array used for the overall score. Only meaningful once
  // `finished` is true (answers isn't full before that), but it's cheap to
  // compute either way.
  const subjectResults = (() => {
    const map = {};
    questions.forEach((q, i) => {
      if (!map[q.subjectKey]) map[q.subjectKey] = { subjectKey: q.subjectKey, correct: 0, total: 0 };
      map[q.subjectKey].total += 1;
      if (answers[i] === q.correct) map[q.subjectKey].correct += 1;
    });
    return Object.values(map);
  })();

  const goCabinet = () => {
    if (onFinish) onFinish(subjectResults);
    else onBack();
  };

  return (
    <div className="diag-app">
      <style>{CSS}</style>
      <header className="diag-header">
        <div className="diag-logo">
          <Sun size={20} strokeWidth={2.4} />
          <span>Bilim Jol</span>
        </div>
      </header>

      <section className="diag-section">
        <div className="diag-wrap">
          <button type="button" className="back-link" onClick={onBack}>
            <ArrowLeft size={16} /> {t.backHome}
          </button>

          {total === 0 && (
            <div className="card">
              <h2 className="card-title">{t.title}</h2>
              <p className="card-subtitle">{t.noSubjects}</p>
              <button type="button" className="btn btn-solid btn-block" onClick={onBack}>
                {t.backHome}
              </button>
            </div>
          )}

          {total > 0 && !finished && (
            <div className="card">
              <div className="progress-row">
                <span className="progress-label">{t.progress(index + 1, total)}</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(index / total) * 100}%` }} />
                </div>
              </div>

              <div className="subject-chip">
                {SUBJECTS.find((s) => s.key === questions[index].subjectKey)?.[langKey] || questions[index].subjectKey}
              </div>

              <h2 className="question-text">{questions[index].q[langKey]}</h2>

              <div className="options-col">
                {questions[index].options[langKey].map((opt, i) => (
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

              <button type="button" className="btn btn-solid btn-block" disabled={selected === null} onClick={next}>
                {index + 1 === total ? t.finish : t.next}
              </button>
            </div>
          )}

          {total > 0 && finished && (
            <div className="card done-card">
              <div className="done-icon">
                <Check size={28} strokeWidth={3} />
              </div>
              <h2 className="card-title center">{t.resultTitle}</h2>
              <p className="card-subtitle center">
                {t.resultText(answers.reduce((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0), total)}
              </p>
              <button type="button" className="btn btn-solid btn-block" onClick={goCabinet}>
                {t.goCabinet}
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

.diag-app {
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
.diag-app * { box-sizing: border-box; }
.diag-app button { font-family: inherit; cursor: pointer; }
.diag-app button:disabled { opacity: 0.5; cursor: not-allowed; }
.diag-app button:focus-visible { outline: 2px solid var(--orange); outline-offset: 2px; }

.diag-header {
  background: #EEF4F5;
  border-bottom: 1px solid var(--line);
  padding: 14px 24px;
}
.diag-logo {
  max-width: 1180px; margin: 0 auto;
  display: flex; align-items: center; gap: 8px;
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 18px;
  color: var(--dark-1);
}
.diag-logo svg { color: var(--orange); }

.diag-section { padding: 40px 24px 80px; }
.diag-wrap { max-width: 560px; margin: 0 auto; }

.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; color: var(--muted);
  font-weight: 700; font-size: 13.5px; margin-bottom: 18px; padding: 0;
}
.back-link:hover { color: var(--dark-1); }

.card {
  background: #fff; border: 1px solid var(--line);
  border-radius: 20px; padding: 32px;
}
.card-title { font-family: 'Unbounded', sans-serif; font-size: 20px; margin: 0 0 6px; }
.card-title.center { text-align: center; }
.card-subtitle { color: var(--muted); font-size: 14px; margin: 0 0 20px; }
.card-subtitle.center { text-align: center; }

.progress-row { margin-bottom: 20px; }
.progress-label { font-size: 12.5px; font-weight: 700; color: var(--muted); }
.progress-bar { height: 6px; background: var(--line); border-radius: 999px; margin-top: 8px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--orange); border-radius: 999px; transition: width .3s ease; }

.subject-chip {
  display: inline-block;
  background: rgba(245,166,35,0.14);
  color: var(--orange-dark);
  font-weight: 800; font-size: 12px; letter-spacing: .02em;
  padding: 6px 12px; border-radius: 999px; margin-bottom: 14px;
}

.question-text {
  font-family: 'Unbounded', sans-serif;
  font-size: 18px; font-weight: 600; line-height: 1.4;
  margin: 0 0 20px; color: var(--ink);
}

.options-col { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.option {
  text-align: left;
  border: 1px solid var(--line);
  background: #FAFCFC;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
  transition: border-color .15s ease, background .15s ease;
}
.option:hover { border-color: #cfd9da; }
.option.active { border-color: var(--orange); background: rgba(245,166,35,0.1); }

.btn { border-radius: 999px; font-weight: 700; padding: 12px 18px; font-size: 14.5px; border: 1px solid transparent; }
.btn-solid { background: var(--orange); color: #26210a; }
.btn-solid:hover:not(:disabled) { background: #ffb63c; }
.btn-block { width: 100%; text-align: center; }

.done-card { text-align: center; }
.done-icon {
  width: 56px; height: 56px; border-radius: 999px;
  background: rgba(245,166,35,0.16); color: var(--orange-dark);
  display: flex; align-items: center; justify-content: center;
  margin: 4px auto 18px;
}

@media (max-width: 640px) {
  .card { padding: 22px; }
}
`;
