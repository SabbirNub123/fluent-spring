/* Stage 4 – Main task: Activity A (skimming) and Activity B (scanning) */
const skimQuestions = [
  { type: "mc", section: "skimming", text: "What is the main idea of the passage?",
    options: [
      "A week of exams for first-year students",
      "A week of events to help students build reading habits and academic reading skills",
      "A new building for the Department of English",
      "A competition to find the fastest reader"
    ],
    answer: 1,
    explain: "The first paragraph states the aim, and the rest of the passage describes events that support it." },
  { type: "mc", section: "skimming", text: "Which title is the most appropriate?",
    options: [
      "How to Pass the English Exam",
      "A New Library for Meghna Valley University",
      "University Reading Week: Building Better Reading Habits",
      "The Career of Dr. Nusrat Jahan"
    ],
    answer: 2,
    explain: "A good title covers the whole passage. The other titles are too narrow or are about topics the passage does not discuss." },
  { type: "mc", section: "skimming", text: "What is the general purpose of the passage?",
    options: [
      "To inform readers about an upcoming university event and its aim",
      "To persuade students to buy more books",
      "To tell a story about a librarian",
      "To explain how to write a research paper"
    ],
    answer: 0,
    explain: "The writer gives facts about who, when, where and why. This is informational, not persuasive or narrative." }
];

const scanQuestions = [
  { type: "text", section: "scanning", text: "When does University Reading Week begin?", display: "14 March 2027",
    keywords: [["14"], ["march", "mar", "03", "3"]],
    hint: "Scan for a month name and numbers. There are two dates near the start. Read around each one.",
    explain: "The week runs from 14 to 18 March 2027. The date 7 March is the registration deadline, not the start date." },
  { type: "text", section: "scanning", text: "Where will the opening ceremony take place?", display: "Central Library Auditorium",
    keywords: [["auditorium"]],
    hint: "Look for the word 'ceremony' and read the place that follows.",
    explain: "The second paragraph says the ceremony is in the Central Library Auditorium on the second floor of Academic Building 2." },
  { type: "text", section: "scanning", text: "How many students have already registered?", display: "More than 450",
    keywords: [["450"]],
    hint: "Find a number near the word 'registered'. Ignore 'six departments' and 'three workshops'.",
    explain: "The passage says more than 450 students from six departments have already registered." },
  { type: "text", section: "scanning", text: "Who organises the programme?", display: "Dr. Nusrat Jahan",
    keywords: [["nusrat", "jahan"]],
    hint: "Two people are named. One organises and the other is a librarian.",
    explain: "Dr. Nusrat Jahan organises the programme. Mr. Imran Hossain is the librarian who shows students the e-library." }
];

const skimBox = document.getElementById("skimQuestions");
const scanBox = document.getElementById("scanQuestions");
const skimMsg = document.getElementById("skimMessage");
const scanMsg = document.getElementById("scanMessage");
let skimResult = null, scanResult = null;

renderQuestions(skimBox, skimQuestions, "sk");
renderQuestions(scanBox, scanQuestions, "sc");

/* ---------- Timer (optional) ---------- */
let seconds = 0, timerId = null;
const timerDisplay = document.getElementById("timerDisplay");
function tick() { seconds += 1; timerDisplay.textContent = formatTime(seconds); }
document.getElementById("timerStart").addEventListener("click", () => { if (!timerId) timerId = setInterval(tick, 1000); });
document.getElementById("timerStop").addEventListener("click", () => { clearInterval(timerId); timerId = null; });
document.getElementById("timerReset").addEventListener("click", () => {
  clearInterval(timerId); timerId = null; seconds = 0; timerDisplay.textContent = "00:00";
});

/* ---------- Checking ---------- */
function finishIfBothDone() {
  if (!skimResult || !scanResult) return;
  const total = skimResult.score + scanResult.score;
  const max = skimResult.total + scanResult.total;
  document.getElementById("mainSummary").textContent =
    `Summary: skimming ${skimResult.score}/${skimResult.total}, scanning ${scanResult.score}/${scanResult.total} (${total}/${max} overall). ` +
    "Read every explanation before you continue.";
  document.getElementById("mainDone").hidden = false;
  Store.set("main", { skim: skimResult.score, scan: scanResult.score, seconds });
  markComplete("main");
}

document.getElementById("checkSkim").addEventListener("click", () => {
  const result = gradeQuestions(skimBox, skimQuestions, "sk");
  if (result.incomplete) { showMessage(skimMsg, "info", "Please answer all three questions."); return; }
  skimResult = result;
  showMessage(skimMsg, result.score === result.total ? "correct" : "info",
    `Activity A: ${result.score} out of ${result.total} correct. You can change an answer and check again.`);
  finishIfBothDone();
});

document.getElementById("checkScan").addEventListener("click", () => {
  const result = gradeQuestions(scanBox, scanQuestions, "sc");
  if (result.incomplete) { showMessage(scanMsg, "info", "Please type an answer for every question."); return; }
  scanResult = result;
  const timeNote = seconds > 0 ? ` You took ${formatTime(seconds)}. Remember: accuracy matters more than speed.` : "";
  showMessage(scanMsg, result.score === result.total ? "correct" : "info",
    `Activity B: ${result.score} out of ${result.total} correct.${timeNote}`);
  finishIfBothDone();
});

document.getElementById("retryMain").addEventListener("click", () => {
  renderQuestions(skimBox, skimQuestions, "sk");
  renderQuestions(scanBox, scanQuestions, "sc");
  skimMsg.hidden = true; scanMsg.hidden = true;
  document.getElementById("mainDone").hidden = true;
  skimResult = null; scanResult = null;
  document.getElementById("timerReset").click();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
