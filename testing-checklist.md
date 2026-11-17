# Testing Checklist (Phase 9)

Test in Chrome and one other browser, on desktop width (1200px) and phone width (375px).

## All pages
- [ ] Header shows 8 links; the current page is highlighted
- [ ] Menu collapses to a button below 900px and opens/closes
- [ ] Footer shows group, courses, CLO1, fictional-examples and no-AI-grading notes
- [ ] Tab key: Skip link appears first; focus outline visible
- [ ] No red errors in the Console (F12)

## Per page
| Page | Test | Expected |
|---|---|---|
| index | Start Learning | Opens objectives |
| index | Stage list and bar | Update after completing stages |
| index | Reset my progress | Asks for confirmation, then clears |
| objectives | Tick a box, reload | Tick remains |
| warmup | Check with blank answers | Asks to answer all |
| warmup | Answer 1, 2, 3 correctly | 3 green items; Next button appears |
| techniques | Highlight buttons | Parts highlight/unhighlight; Clear and Show all work |
| techniques | Quick check | Feedback and Next button |
| guided-practice | Hint buttons | Open and close |
| guided-practice | Check each of 5 steps | "Steps checked" reaches 5 of 5; completion box appears |
| main-activity | Type `14th March 2027`, `March 14` | Both accepted |
| main-activity | Type `7 March` | Marked wrong with explanation |
| main-activity | Timer start/pause/reset | Works; time shown in message |
| assessment | Submit with blanks | Blocked; unanswered items highlighted |
| assessment | Complete and submit | Score, percentage, section scores; inputs locked |
| assessment | Try again | Fresh questions, results hidden |
| feedback | Without assessment | Notice and link shown |
| feedback | After assessment | Result, explanations, filter, improvement cards |
| feedback | Revision, Retry Activity | Compares with first score; retry resets |
| feedback | Reflection under 20 characters | Rejected with message |
| feedback | Save and Download | Saved message; .txt file downloads |

## Accessibility and responsiveness
- [ ] Correct/incorrect shown with text and symbols (✔ ✘), not colour alone
- [ ] All inputs have labels; radio groups use fieldset and legend
- [ ] Passage stacks above questions on phone; tables scroll sideways inside their box
- [ ] Zoom to 200%: no content lost
- [ ] Reduced-motion setting disables animations
