/**
 * First-name → gender dictionaries.
 *
 * Curated, not exhaustive: weighted toward names common in Egypt (the primary
 * market) in both Arabic script and Latin transliteration, plus widespread
 * international names. This will never be perfectly accurate — names are
 * cultural and ambiguous — so the inference layer always returns a confidence
 * and the UI presents the result as a GUESS, never a fact.
 *
 * Keys are lowercased Latin transliterations and the Arabic forms. Matching is
 * done on a normalized token (see infer.ts), so add new names in lowercase.
 */

export const MALE_NAMES: ReadonlySet<string> = new Set([
  // Arabic (Latin)
  "mohamed", "muhammad", "mohammed", "ahmed", "ahmad", "mahmoud", "mostafa",
  "mustafa", "ali", "omar", "amr", "khaled", "khalid", "hassan", "hussein",
  "hossam", "hosam", "ibrahim", "ismail", "youssef", "yousef", "yusuf",
  "yassin", "yasin", "karim", "kareem", "tarek", "tariq", "sherif", "shrif",
  "wael", "walid", "tamer", "hany", "hani", "sameh", "samy", "sami", "sayed",
  "saeed", "said", "salah", "ramy", "rami", "ramzy", "nader", "nabil", "magdy",
  "medhat", "mina", "marco", "mark", "kirollos", "george", "girgis", "bishoy",
  "abanoub", "fady", "fadi", "peter", "boutros", "mido", "fares", "faris",
  "adham", "ziad", "zeyad", "seif", "saif", "selim", "salim", "anas", "bilal",
  "belal", "haitham", "hatem", "hesham", "islam", "emad", "imad", "ehab",
  "ashraf", "atef", "ayman", "essam", "fathy", "gamal", "hamada", "kamal",
  "maged", "moataz", "mo3taz", "nasser", "rabie", "raed", "saad", "shady",
  "sherbiny", "wahid", "yahia", "yehia", "zaki", "abdullah", "abdallah",
  "abdelrahman", "abdulrahman", "abderahman", "abdelaziz", "abdel", "abdo",
  "mazen", "marwan", "moaz", "muath", "nour eldin", "noureldin", "taha",
  // International
  "john", "michael", "david", "james", "robert", "william", "daniel", "paul",
  "andrew", "thomas", "joseph", "charles", "kevin", "brian", "steven", "ryan",
  "alex", "alexander", "chris", "christopher", "matthew", "anthony", "luca",
  "marco", "carlos", "juan", "pedro", "ivan", "sergei", "ahmet", "mehmet",
]);

export const FEMALE_NAMES: ReadonlySet<string> = new Set([
  // Arabic (Latin)
  "fatma", "fatima", "aya", "aia", "esraa", "israa", "asmaa", "asma", "amira",
  "amani", "amal", "abeer", "abir", "alaa", "arwa", "asmaa", "basma", "bassant",
  "bassma", "dalia", "dahlia", "dina", "doaa", "doha", "eman", "iman", "enas",
  "fatema", "farida", "ferial", "ghada", "habiba", "hagar", "hajar", "hala",
  "haneen", "hanin", "hanan", "heba", "hiba", "hadeer", "hadir", "hend", "hind",
  "ola", "hoda", "huda", "rana", "rania", "raneem", "reem", "rehab", "rim",
  "rana", "rawan", "rowan", "rasha", "salma", "sara", "sarah", "shaimaa",
  "shahd", "shaza", "shereen", "sherine", "soha", "sondos", "sundus", "yasmin",
  "yasmine", "jasmine", "yara", "zeinab", "zainab", "zeynep", "nada", "nadia",
  "nahla", "naira", "nancy", "nermin", "nesma", "nesreen", "nesrine", "noha",
  "nour", "noor", "nourhan", "noura", "noura", "marwa", "maha", "malak",
  "mariam", "maryam", "marina", "mary", "maria", "mirna", "mona", "mai", "may",
  "menna", "mennatallah", "mirette", "verena", "veronia", "demiana", "mariana",
  "kerolos", "kirolos", "kristin", "christine", "irini", "yostina", "yosteena",
  "youstina", "monica", "marian", "marianne", "rofaida", "ruqaya", "sondos",
  "tasneem", "tasnim", "toqa", "wafaa", "walaa", "wessam", "wesam", "zahra",
  "zahraa", "asia", "asya", "donia", "dunia", "razan", "lobna", "lubna",
  "leila", "laila", "layla", "lamia", "lina", "lara", "farah", "fayrouz",
  // International
  "emma", "olivia", "sophia", "isabella", "mia", "amelia", "ella", "grace",
  "anna", "elena", "maria", "laura", "sofia", "julia", "nina", "clara",
  "jessica", "jennifer", "linda", "patricia", "susan", "karen", "nancy",
  "lisa", "betty", "helen", "sandra", "donna", "carol", "michelle", "amanda",
]);

/** Arabic-script first names (diacritics are stripped before matching). */
export const MALE_NAMES_AR: ReadonlySet<string> = new Set([
  "محمد", "احمد", "أحمد", "محمود", "مصطفى", "علي", "عمر", "عمرو", "خالد",
  "حسن", "حسين", "ابراهيم", "إبراهيم", "اسماعيل", "يوسف", "ياسين", "كريم",
  "طارق", "شريف", "وائل", "وليد", "تامر", "هاني", "سامح", "سامي", "سيد",
  "سعيد", "صلاح", "رامي", "نادر", "نبيل", "مجدي", "مينا", "مرقس", "بيشوي",
  "فادي", "فارس", "زياد", "سيف", "انس", "بلال", "هيثم", "حاتم", "هشام",
  "اسلام", "عماد", "ايهاب", "اشرف", "عاطف", "ايمن", "عصام", "جمال", "كمال",
  "ماجد", "معتز", "ناصر", "سعد", "شادي", "يحيى", "زكي", "عبدالله", "عبدالرحمن",
  "عبدالعزيز", "مازن", "مروان", "طه", "بطرس", "جورج",
]);

export const FEMALE_NAMES_AR: ReadonlySet<string> = new Set([
  "فاطمة", "فاطمه", "ايه", "آية", "اسراء", "اسماء", "اميرة", "اماني", "امل",
  "عبير", "الاء", "اروى", "بسمة", "بسنت", "داليا", "دينا", "دعاء", "ايمان",
  "ايناس", "فريدة", "غادة", "حبيبة", "هاجر", "هالة", "حنين", "حنان", "هبة",
  "هدير", "هند", "علا", "هدى", "رنا", "رانيا", "رنيم", "ريم", "رحاب", "روان",
  "رشا", "سلمى", "سارة", "ساره", "شيماء", "شهد", "شيرين", "سها", "سندس",
  "ياسمين", "يارا", "زينب", "ندى", "نادية", "نهلة", "نيرة", "نرمين", "نسمة",
  "نسرين", "نهى", "نور", "نورهان", "نورا", "مروة", "مها", "ملك", "مريم",
  "مارينا", "ميرنا", "منى", "مي", "منة", "منار", "كريستين", "ايريني", "يوستينا",
  "مونيكا", "تسنيم", "تقى", "وفاء", "ولاء", "وسام", "زهراء", "دنيا", "رزان",
  "لبنى", "ليلى", "لمياء", "لينا", "لارا", "فرح", "فيروز", "كاترين",
]);
