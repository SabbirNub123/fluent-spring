/* Stage 3 – Guided practice: five steps, each with hints and explanations */
const practiceSteps = [
  [{ type: "mc", text: "What does the title suggest the passage is about?",
     options: ["A change in exam rules", "A new place where students can study", "A university sports event", "A computer course"],
     answer: 1, hint: "Look at the key words in the title: new, Study Hub, students.",
     explain: "A 'Study Hub' is a place for studying, and the word 'new' tells us it is recent." }],
  [{ type: "mc", text: "What do the first and last sentences have in common?",
     options: ["Both give the name of a librarian", "Both are about the Study Hub and what it offers students", "Both give opening times", "Both explain how to book a room"],
     answer: 1, hint: "Press 'Highlight first and last sentences' and compare the topic of each.",
     explain: "The first sentence introduces the Study Hub. The last sentence sums up what it gives students. Together they show the main topic." }],
  [{ type: "mc", text: "Which sentence best states the main idea of the passage?",
     options: ["Eastern Delta University opened Block C in 2026.", "Mr. Rashed Karim answers questions at the front desk.", "The Study Hub is a new space where students can study alone or in groups.", "The main library is often full in exam weeks."],
     answer: 2, hint: "A main idea covers the whole passage. The other sentences are single details.",
     explain: "The correct sentence covers the whole passage. The other options are true details, but each covers only a small part." }],
  [{ type: "text", text: "Scanning: Who manages the Study Hub?", display: "Mr. Rashed Karim",
     keywords: [["rashed", "karim"]],
     hint: "A name starts with a capital letter and may follow a title such as Mr., Ms. or Dr. Check the second paragraph.",
     explain: "The second paragraph says Mr. Rashed Karim, the senior librarian, manages the hub." }],
  [{ type: "text", text: "Scanning: How many seats does the Study Hub have?", display: "80",
     keywords: [["80", "eighty"]],
     hint: "Look for a number near the word 'seats'. Ignore 12 and two.",
     explain: "The second paragraph says the hub has 80 seats. The numbers 12 (computers) and two (rooms) answer other questions." },
   { type: "mc", text: "Which days is the Study Hub open?",
     options: ["Saturday to Wednesday", "Sunday to Thursday", "Monday to Friday", "Every day"],
     answer: 1, hint: "Scan for the names of days.",
     explain: "The passage says it is open from 8:00 a.m. to 9:00 p.m., Sunday to Thursday." },
   { type: "mc", text: "What must students show to book a group-study room?",
     options: ["A library book", "Their exam timetable", "A letter from a teacher", "Their university ID card"],
     answer: 3, hint: "Scan for the word 'book' or 'room' in the last body paragraph.",
     explain: "The third paragraph says students must show their university ID card at the front desk." }]
];

const checkedSteps = new Set();
const stepBoxes = practiceSteps.map((qs, i) => document.getElementById(`step${i + 1}`));

function renderAllSteps() {
  practiceSteps.forEach((qs, i) => renderQuestions(stepBoxes[i], qs, `ps${i}`));
  document.querySelectorAll(".step").forEach(card => card.classList.remove("checked"));
  checkedSteps.clear();
  document.getElementById("practiceDone").hidden = true;
  updatePracticeProgress();
}

function updatePracticeProgress() {
  document.getElementById("practiceProgress").textContent = `Steps checked: ${checkedSteps.size} of ${practiceSteps.length}`;
}

document.querySelectorAll("[data-check]").forEach(btn => {
  btn.addEventListener("click", () => {
    const i = Number(btn.dataset.check);
    const result = gradeQuestions(stepBoxes[i], practiceSteps[i], `ps${i}`);
    if (result.incomplete) {
      document.getElementById("practiceProgress").textContent = `Please answer every question in step ${i + 1} first.`;
      return;
    }
    checkedSteps.add(i);
    document.getElementById(`step${i + 1}-card`).classList.add("checked");
    updatePracticeProgress();
    if (checkedSteps.size === practiceSteps.length) {
      document.getElementById("practiceDone").hidden = false;
      markComplete("practice");
    }
  });
});

/* Highlight buttons on the passage */
function bindToggle(buttonId, selectors) {
  const btn = document.getElementById(buttonId);
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    selectors.forEach(sel => document.querySelectorAll(`#practicePassage ${sel}`).forEach(el => el.classList.toggle("hl", on)));
  });
}
bindToggle("toggleTitle", ['[data-part="title"]']);
bindToggle("toggleEnds", ['[data-part="first"]', '[data-part="last"]']);

document.getElementById("restartPractice").addEventListener("click", () => {
  renderAllSteps();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderAllSteps();
