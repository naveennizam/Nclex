
import { Question } from './types'; // adjust path as needed

export const questions: Question[] = [


  {
    id: 1,
    type: "multiple",
    question: "A patient on metoprolol reports dizziness upon standing. The priority nursing action is:",
    options: ["Encourage increased fluid intake", "Check orthostatic blood pressure", "Hold the next dose", "Notify the provider"],
    answer: ["Check orthostatic blood pressure"],
    rationale: "Measuring orthostatic BP helps determine if the dizziness is due to postural hypotension—critical before changing meds."
  },
  {
    id: 2,
    type: "multiple",
    question: "Which of the following are signs of congestive heart failure? (Select all that apply.)",
    options: ["Swollen ankles and feet", "Persistent cough or wheezing", "Sudden weight loss", "Shortness of breath", "Increased urine output at night"],
    answer: ["Swollen ankles and feet", "Persistent cough or wheezing", "Shortness of breath", "Increased urine output at night"],
    rationale: "Fluid retention, respiratory symptoms, dyspnea, and nocturia are hallmark signs; sudden weight loss is not typical."
  },
  {
    id: 3,
    type: "drag",
    question: "Arrange steps in the correct order for donning PPE:",
    options: ["Put on gown", "Put on mask or respirator", "Put on goggles or face shield", "Put on gloves"],
    answer: ["Put on gown", "Put on mask or respirator", "Put on goggles or face shield", "Put on gloves"],
    rationale: "Standard sequence for PPE use ensures effective protection."
  },
  {
    id: 4,
    type: "single",
    question: "A patient with Type 1 diabetes experiencing shakiness, sweating, and palpitations likely has _______.",
    options: ["hypoglycemia", "hyperglycemia", "dehydration"],
    answer: ["hypoglycemia"],
    rationale: "These are classic signs of low blood sugar."
  },
  {
    id: 5,
    type: "highlight",
    text: "Patient is awake and cooperative.Reports shortness of breath when walking to the bathroom. Lung sounds reveal crackles at the bases bilaterally. Oxygen saturation is 91% on room air. No edema noted. Appetite is fair, tolerating fluids.",
    question: "Highlight the one word that indicates the need for priority nursing action.",
    answer: ["crackles"],
    rationale: "Crackles suggest fluid in the lungs, which may indicate pulmonary edema, congestive heart failure, or another form of impaired gas exchange."
  },

  {
    id: 6,
    type: "drag",
    question: "Arrange steps in the correct order for donning PPE:",
    options: ["Put on gown", "Put on mask or respirator", "Put on goggles or face shield", "Put on gloves"],
    answer: ["Put on gown", "Put on mask or respirator", "Put on goggles or face shield", "Put on gloves"],
    rationale: "Standard sequence for PPE use ensures effective protection."
  },

  {
    id: 7,
    type: "highlight",
    text: "Patient is sitting upright in bed, using accessory muscles to breathe. Respiratory rate is 28 breaths per minute. Oxygen saturation is 93% on 2L nasal cannula. Skin is warm and dry. Patient reports feeling anxious and tired.",
    question: "Highlight the one word that indicates increased work of breathing.",
    answer: ["accessory"],
    rationale: "Use of accessory muscles indicates increased work of breathing and possible respiratory distress. It is a key assessment finding that may require intervention."

  },
  {
    id: 8,
    type: "single",
    question: "BP trend: 160/100 → 155/95 → 140/85 → 130/80. The trend suggests:",
    options: ["Improving hypertension", "Worsening hypertension", "Unchanged condition"],
    answer: ["Improving hypertension"],
    rationale: "Recognizing trends over time helps guide therapeutic decisions."
  }
];

