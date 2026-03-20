export const formatTimeDigital = (hours: number, minutes: number, isPM: boolean, is24Hour: boolean) => {
  let displayHours = hours;
  if (is24Hour) {
    if (isPM && hours !== 12) displayHours += 12;
    else if (!isPM && hours === 12) displayHours = 0;
  }
  
  const paddedHours = displayHours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  
  return `${paddedHours}:${paddedMinutes}`;
};

export const getTimeText = (hours: number, minutes: number, language: 'ru' | 'en') => {
  // Logic for generating text representation of time
  if (language === 'en') {
    return englishTimeText(hours, minutes);
  } else {
    return russianTimeText(hours, minutes);
  }
};

const numToWordsEn = [
  "twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "quarter", "sixteen", "seventeen", "eighteen", "nineteen",
  "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "half"
];

const getEnNumberStr = (n: number): string => {
  if (n < 30) return numToWordsEn[n] || n.toString();
  if (n < 40) return n === 30 ? "thirty" : `thirty ${numToWordsEn[n - 30]}`;
  if (n < 50) return n === 40 ? "forty" : `forty ${numToWordsEn[n - 40]}`;
  return n === 50 ? "fifty" : `fifty ${numToWordsEn[n - 50]}`;
};

const englishTimeText = (hours: number, minutes: number) => {
  if (minutes === 0) return `${numToWordsEn[hours]} o'clock`;
  
  // Use relative terms only for multiples of 5
  if (minutes % 5 === 0) {
    const getMinWord = (m: number) => {
      if (m < 30) return numToWordsEn[m] || m.toString();
      return numToWordsEn[60 - m] || (60 - m).toString();
    };
    if (minutes === 15) return `quarter past ${numToWordsEn[hours]}`;
    if (minutes === 30) return `half past ${numToWordsEn[hours]}`;
    if (minutes === 45) return `quarter to ${numToWordsEn[(hours % 12) + 1]}`;
    
    if (minutes < 30) {
      return `${getMinWord(minutes)} past ${numToWordsEn[hours]}`;
    } else {
      return `${getMinWord(minutes)} to ${numToWordsEn[(hours % 12) + 1]}`;
    }
  }

  // Exact time for non-5 multiples (e.g. "twelve thirty-seven")
  const hourStr = numToWordsEn[hours];
  const minStr = minutes < 10 ? `oh ${numToWordsEn[minutes]}` : getEnNumberStr(minutes);
  return `${hourStr} ${minStr}`;
};

const numToWordsRuNom = ["ноль", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
const numToWordsRuGenitive = ["двенадцатого", "первого", "второго", "третьего", "четвертого", "пятого", "шестого", "седьмого", "восьмого", "девятого", "десятого", "одиннадцатого", "двенадцатого"];
const ruTens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят"];

const getRuNumberStr = (n: number, isHour: boolean = false): string => {
  if (n < 20) {
    if (!isHour && n === 1) return "одна";
    if (!isHour && n === 2) return "две";
    if (isHour && n === 1) return "час";
    return numToWordsRuNom[n];
  }
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (u === 0) return ruTens[t];
  
  let unitStr = numToWordsRuNom[u];
  if (!isHour && u === 1) unitStr = "одна";
  if (!isHour && u === 2) unitStr = "две";
  
  return `${ruTens[t]} ${unitStr}`;
};

const russianTimeText = (hours: number, minutes: number) => {
  if (minutes === 0) {
    if (hours === 1) return "ровно час";
    return `ровно ${numToWordsRuNom[hours]}`;
  }
  
  // Use relative terms only for multiples of 5
  if (minutes % 5 === 0) {
    let nextHourIndex = (hours % 12) + 1;
    const nextHourGenitive = numToWordsRuGenitive[nextHourIndex];

    if (minutes === 15) return `четверть ${nextHourGenitive}`;
    if (minutes === 30) return `половина ${nextHourGenitive}`;
    if (minutes === 45) return `без четверти ${numToWordsRuNom[nextHourIndex]}`;

    if (minutes < 30) {
      if (minutes === 5) return `пять минут ${nextHourGenitive}`;
      if (minutes === 10) return `десять минут ${nextHourGenitive}`;
      if (minutes === 20) return `двадцать минут ${nextHourGenitive}`;
      if (minutes === 25) return `двадцать пять минут ${nextHourGenitive}`;
    } else {
      const diff = 60 - minutes;
      let bezWord = "";
      if (diff === 5) bezWord = "без пяти";
      else if (diff === 10) bezWord = "без десяти";
      else if (diff === 20) bezWord = "без двадцати";
      else if (diff === 25) bezWord = "без двадцати пяти";
      
      return `${bezWord} ${numToWordsRuNom[nextHourIndex]}`;
    }
  }

  // Exact time for non-5 multiples (e.g. "двенадцать тридцать семь")
  const minZeroPad = getRuNumberStr(minutes, false);
  return `${getRuNumberStr(hours, true)} ${minZeroPad}`;
};
