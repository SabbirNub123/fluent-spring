/* Stage 5 – Review and assessment: 5 skimming + 5 scanning questions */
const assessmentQuestions = {
  skimming: [
    { type: "mc", section: "skimming", text: "What is the main idea of the text?",
      options: ["Typing is always better than handwriting for lecture notes.",
                "Handwriting and typing each have advantages, and the best choice depends on the student's goal.",
                "Teachers should stop students from using laptops.",
                "Students should stop taking notes during lectures."],
      answer: 1, explain: "The introduction and conclusion both say the best method depends on what the student wants to achieve." },
    { type: "mc", section: "skimming", text: "Which title is the most suitable for the text?",
      options: ["How to Search Digital Files Faster", "Why Laptops Are Banned in Lectures",
                "Typing or Handwriting: Choosing the Right Way to Take Notes", "A History of Writing Tools"],
      answer: 2, explain: "This title covers both methods and the idea of choosing. The others focus on a detail or on topics the text does not discuss." },
    { type: "mc", section: "skimming", text: "What is the writer's main purpose?",
      options: ["To compare two ways of taking notes", "To advertise a new laptop",
                "To teach students how to write an essay", "To criticise university teachers"],
      answer: 0, explain: "The text presents strengths and weaknesses of typing and handwriting side by side. It is a comparison." },
    { type: "mc", section: "skimming", text: "What is paragraph 3 mainly about?",
      options: ["The speed of typing", "The strengths and one weakness of handwritten notes",
                "How teachers check lecture notes", "How to share notes online"],
      answer: 1, explain: "The first sentence of paragraph 3 introduces handwriting. The paragraph then explains its benefit and one disadvantage." },
    { type: "mc", section: "skimming", text: "What does the writer conclude?",
      options: ["Typing is the best method for every student.", "Handwriting is the best method for every student.",
                "Students should choose the method that matches their learning goal.", "Students should use both methods in every lecture."],
      answer: 2, explain: "The last sentence says the best choice is the one that matches the learning goal. The text never says one method is best for everyone." }
  ],
  scanning: [
    { type: "mc", section: "scanning", text: "On which date will the presentations take place?",
      options: ["18 April 2027", "21 April 2027", "24 April 2027", "12 April 2027"],
      answer: 1, explain: "The first sentence gives Wednesday, 21 April 2027. The date 18 April is the deadline for uploading slides." },
    { type: "mc", section: "scanning", text: "In which room will the presentations be held?",
      options: ["Room 504", "Room 110", "Room 24", "Room 405"],
      answer: 3, explain: "The text says Room 405, Academic Building 1. Room 110 is the IT Office." },
    { type: "mc", section: "scanning", text: "How long does each group have to present?",
      options: ["5 minutes", "17 minutes", "12 minutes", "24 minutes"],
      answer: 2, explain: "Each group has 12 minutes to present. The 5 minutes are for questions, and 24 is the number of groups." },
    { type: "mc", section: "scanning", text: "Who will lead the panel?",
      options: ["Ms. Tahmina Sultana", "Professor Anwar Hossain", "Mr. Kamal Uddin", "Dr. Salma Begum"],
      answer: 1, explain: "Professor Anwar Hossain leads the panel. Ms. Tahmina Sultana is the coordinator and Mr. Kamal Uddin helps with technical problems." },
    { type: "mc", section: "scanning", text: "By what date must groups upload their slides?",
      options: ["21 April", "20 April", "18 April", "12 April"],
      answer: 2, explain: "The second paragraph says groups must upload their slides by 18 April." }
  ]
};
const allAssessmentQuestions = assessmentQuestions.skimming.concat(assessmentQuestions.scanning);

const skimAssessBox = document.getElementById("skimAssess");
const scanAssessBox = document.getElementById("scanAssess");
const assessMsg = document.getElementById("assessMessage");
const resultsSection = document.getElementById("resultsSection");

function renderAssessment() {
  renderQuestions(skimAssessBox, assessmentQuestions.skimming, "as-sk", 1);
  renderQuestions(scanAssessBox, assessmentQuestions.scanning, "as-sc", 6);
  assessMsg.hidden = true;
  resultsSection.hidden = true;
  document.getElementById("submitAssessment").disabled = false;
}

function levelMessage(pct) {
  if (pct >= 80) return "Excellent work. You are using both techniques effectively.";
  if (pct >= 60) return "Good effort. Review the explanations to strengthen your skills.";
  return "Keep practising. Read the explanations carefully, then try again.";
}

document.getElementById("submitAssessment").addEventListener("click", () => {
  /* Check for unanswered questions first, so nothing is graded or locked until all 10 are answered */
  const unanswered = [];
  assessmentQuestions.skimming.forEach((q, i) => { if (readAnswer("as-sk", i, q) === "") unanswered.push(`as-sk-${i}-box`); });
  assessmentQuestions.scanning.forEach((q, i) => { if (readAnswer("as-sc", i, q) === "") unanswered.push(`as-sc-${i}-box`); });
  document.querySelectorAll(".question.unanswered").forEach(el => el.classList.remove("unanswered"));
  if (unanswered.length) {
    unanswered.forEach(id => document.getElementById(id).classList.add("unanswered"));
    document.getElementById(unanswered[0]).scrollIntoView({ behavior: "smooth", block: "center" });
    showMessage(assessMsg, "info", `Please answer all 10 questions before submitting. ${unanswered.length} still need an answer (highlighted in orange).`);
    return;
  }
  const skim = gradeQuestions(skimAssessBox, assessmentQuestions.skimming, "as-sk", { lock: true });
  const scan = gradeQuestions(scanAssessBox, assessmentQuestions.scanning, "as-sc", { lock: true });
  const score = skim.score + scan.score;
  const pct = Math.round((score / 10) * 100);

  document.getElementById("scoreBig").textContent = `${score} / 10 (${pct}%)`;
  document.getElementById("levelText").textContent = levelMessage(pct);
  document.getElementById("scoreBar").style.width = `${pct}%`;
  document.getElementById("skimScore").textContent = `${skim.score} out of 5 correct`;
  document.getElementById("scanScore").textContent = `${scan.score} out of 5 correct`;
  resultsSection.hidden = false;
  assessMsg.hidden = true;
  document.getElementById("submitAssessment").disabled = true;
  resultsSection.scrollIntoView({ behavior: "smooth" });

  Store.set("assessment", {
    score, pct, skim: skim.score, scan: scan.score,
    details: skim.details.concat(scan.details),
    date: new Date().toISOString()
  });
  markComplete("assessment");
});

document.getElementById("retryAssessment").addEventListener("click", () => {
  renderAssessment();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderAssessment();
