/* Stage 2 – Delivery and modelling: interactive highlights and a quick check */

/* ---------- Skimming demo ---------- */
function setSkim(part, on) {
  document.querySelectorAll(`#skimDemo [data-part="${part}"]`).forEach(el => el.classList.toggle("hl", on));
  const btn = document.querySelector(`[data-skim="${part}"]`);
  if (btn) btn.setAttribute("aria-pressed", String(on));
}
const skimParts = ["title", "intro", "heading", "first", "conclusion"];
document.querySelectorAll("[data-skim]").forEach(btn => {
  btn.addEventListener("click", () => setSkim(btn.dataset.skim, btn.getAttribute("aria-pressed") !== "true"));
});
document.getElementById("skimAll").addEventListener("click", () => skimParts.forEach(p => setSkim(p, true)));
document.getElementById("skimClear").addEventListener("click", () => skimParts.forEach(p => setSkim(p, false)));

/* ---------- Scanning demo ---------- */
function setScan(type, on) {
  document.querySelectorAll(`#scanDemo [data-type="${type}"]`).forEach(el => el.classList.toggle("hl", on));
  const btn = document.querySelector(`[data-scan="${type}"]`);
  if (btn) btn.setAttribute("aria-pressed", String(on));
}
document.querySelectorAll("[data-scan]").forEach(btn => {
  btn.addEventListener("click", () => setScan(btn.dataset.scan, btn.getAttribute("aria-pressed") !== "true"));
});
document.getElementById("scanClear").addEventListener("click", () => {
  ["name", "date", "number", "place", "keyword"].forEach(t => setScan(t, false));
});

/* ---------- Quick check ---------- */
const techniqueOptions = ["Skimming", "Scanning"];
const techniqueQuestions = [
  { type: "mc", options: techniqueOptions, answer: 0,
    text: "You want to know whether a journal article is about climate change before you read it carefully.",
    explain: "You only need the general topic, so you read the title, abstract and headings. This is skimming." },
  { type: "mc", options: techniqueOptions, answer: 1,
    text: "You need the deadline for your assignment on a course notice.",
    explain: "You are looking for one date, so you search for numbers and month names. This is scanning." },
  { type: "mc", options: techniqueOptions, answer: 1,
    text: "You want the phone number of the department office on a web page.",
    explain: "A phone number is a specific detail made of digits. You scan for it." },
  { type: "mc", options: techniqueOptions, answer: 0,
    text: "You have two minutes to decide what an editorial in a newspaper is mainly about.",
    explain: "You want the writer's main message, so you read the headline, first sentences and conclusion. This is skimming." }
];
const techBox = document.getElementById("techniqueQuestions");
const techMsg = document.getElementById("techniqueMessage");
renderQuestions(techBox, techniqueQuestions, "tq");

document.getElementById("checkTechniques").addEventListener("click", () => {
  const result = gradeQuestions(techBox, techniqueQuestions, "tq", { lock: true });
  if (result.incomplete) {
    showMessage(techMsg, "info", "Please answer all four questions before checking.");
    return;
  }
  showMessage(techMsg, result.score === result.total ? "correct" : "info",
    `You chose the right technique for ${result.score} of ${result.total} situations. Read the explanations, then move on.`);
  document.getElementById("checkTechniques").disabled = true;
  document.getElementById("retryTechniques").hidden = false;
  document.getElementById("techniqueNext").hidden = false;
  markComplete("techniques");
});

document.getElementById("retryTechniques").addEventListener("click", () => {
  renderQuestions(techBox, techniqueQuestions, "tq");
  techMsg.hidden = true;
  document.getElementById("checkTechniques").disabled = false;
  document.getElementById("retryTechniques").hidden = true;
});
