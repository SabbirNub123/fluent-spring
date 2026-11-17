# Documentation of AI-Generated Content and Critical Decisions

> The group must complete the **Group decision** column in its own words. Do not submit this file with blanks.

**Tool used:** Claude (Anthropic) · **Date(s):** ____ · **Group members who reviewed:** ____

## 1. What AI produced
| Item | AI contribution | Group check | Group decision (fill in) |
|---|---|---|---|
| Project structure and code (HTML, CSS, JavaScript) | Generated all files from the group's brief | Opened every page, ran the tests in `testing-checklist.md` | |
| Reading passages (Campus Science Fair, Study Hub, University Reading Week, Handwriting vs Typing, Final-Year Presentations, Green Campus Day) | Drafted text with fictional universities and people | Check facts, difficulty, fairness, cultural suitability | |
| Questions, answers, explanations | Drafted, with distractors | Check each answer against the passage; confirm only one correct option | |
| Lesson plan and presentation documents | Drafted from the brief | Adjust timings and wording for the real class | |

## 2. Checks required before submission
- [ ] Each question has exactly one correct answer supported by the passage.
- [ ] Distractors are fair (they look plausible but are clearly wrong when the text is read carefully).
- [ ] Vocabulary and sentence length suit university learners at the intended level.
- [ ] Passages use fictional universities, people and events, and say so. (Weekdays for 2027 dates were checked: 14 March 2027 is a Sunday, 11 February 2027 a Thursday, 21 April 2027 a Wednesday, 3 June 2027 a Thursday.)
- [ ] Bangladeshi context is realistic (Sunday–Thursday working week, department names, campus events) and avoids stereotypes.
- [ ] No answer is evaluated by AI inside the website; all checking is pre-written JavaScript.
- [ ] Text is accessible: colour contrast, keyboard use, skip link, labels on inputs.
- [ ] The group tested on a phone-size screen.

## 3. Critical decisions (examples to adapt)
| Decision | Reason |
|---|---|
| Header and footer are inserted by `main.js` | Avoids repeating them in eight files; one place to edit |
| One shared question engine in `main.js` | Less duplicated code; consistent feedback |
| Short-answer matching accepts keyword variants (e.g. "14th March", "March 14") | Fairness for different answer formats |
| Timer is optional and has no score effect | The brief says speed must not matter more than understanding |
| Results are stored only in LocalStorage | No backend allowed; learners keep control of their data |
| `techniques.js` and `main-activity.js` added | Keeps each page's code separate and readable |

## 4. Limitations the group should state honestly
- Passages and questions are fixed; some learners may memorise answers on retry.
- Short-answer checking uses keywords, so unusual correct phrasing may be marked wrong.
- LocalStorage data is lost if the browser data is cleared or a different device is used.
- The tool has not been tested with real learners unless the group records that in the evidence log.

## 5. Human responsibility
The group and the teacher remain responsible for accuracy, fairness and learning decisions. AI output was a draft that humans reviewed and edited.
