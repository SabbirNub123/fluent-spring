/* Stage 1 – Warm-up: three multiple-choice questions with immediate feedback */
const warmupQuestions = [
  {
    type: "mc",
    text: "What do you think this paragraph is mainly about?",
    options: [
      "How to save water at home",
      "A science fair where university students present projects",
      "A list of famous scientists",
      "The history of Padma Riverside University"
    ],
    answer: 1,
    explain: "The whole paragraph describes the Campus Science Fair: who takes part, what they present, when it is held and what happens afterwards."
  },
  {
    type: "mc",
    text: "How would you find a specific date, such as the day of the fair, quickly?",
    options: [
      "Read every sentence slowly from the beginning",
      "Translate the whole paragraph first",
      "Move your eyes over the text and look for numbers and month names",
      "Read only the title"
    ],
    answer: 2,
    explain: "Dates usually contain numbers and month names, so your eyes can search for them without reading every word. This is scanning."
  },
  {
    type: "mc",
    text: "Do you need to read every word to understand the general idea?",
    options: [
      "Yes, missing one word means you will not understand anything",
      "Yes, but only the numbers matter",
      "No, you should only look at the pictures",
      "No, reading selected parts such as the title and first sentence can give you the general idea"
    ],
    answer: 3,
    explain: "Skimming means reading selected parts quickly to understand the main message. You can read the details later if you need them."
  }
];

const warmupBox = document.getElementById("warmupQuestions");
const warmupMsg = document.getElementById("warmupMessage");
renderQuestions(warmupBox, warmupQuestions, "wu");

document.getElementById("checkWarmup").addEventListener("click", () => {
  const result = gradeQuestions(warmupBox, warmupQuestions, "wu", { lock: true });
  if (result.incomplete) {
    showMessage(warmupMsg, "info", "Please answer all three questions before checking.");
    return;
  }
  showMessage(warmupMsg, result.score === result.total ? "correct" : "info",
    `You answered ${result.score} out of ${result.total} correctly. Read each explanation, then move on to learn the techniques.`);
  document.getElementById("checkWarmup").disabled = true;
  document.getElementById("retryWarmup").hidden = false;
  document.getElementById("warmupNext").hidden = false;
  markComplete("warmup");
});

document.getElementById("retryWarmup").addEventListener("click", () => {
  renderQuestions(warmupBox, warmupQuestions, "wu");
  warmupMsg.hidden = true;
  document.getElementById("checkWarmup").disabled = false;
  document.getElementById("retryWarmup").hidden = true;
});
