import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const DIET_TYPES = ["vegan", "vegetarian", "omnivore", "4FED"] as const;

type DietType = typeof DIET_TYPES[number];

type FormData = {
  dietType?: DietType;
  answers: string[];
};

const TOTAL_PAGES = 20;

function getInitialFormData(): FormData {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("dietFormData");
    if (saved) return JSON.parse(saved);
  }
  return { dietType: undefined, answers: Array(TOTAL_PAGES - 1).fill("") };
}

const QUESTIONS: Record<DietType, string[]> = {
  vegan: [
    "What is your primary motivation for choosing a vegan diet?",
    "How long have you been following a vegan diet?",
    "Do you consume any plant-based meat alternatives?",
    "How often do you eat out at vegan restaurants?",
    "What is your biggest challenge with a vegan diet?",
    "Do you take any supplements (e.g., B12, iron)?",
    "How do you ensure adequate protein intake?",
    "Do you avoid all animal-derived products (e.g., honey)?",
    "How do you handle social situations involving non-vegan food?",
    "What is your favorite vegan meal?",
    "Do you read ingredient labels for hidden animal products?",
    "How do you plan your grocery shopping?",
    "Do you cook most of your meals at home?",
    "How do you manage cravings for non-vegan foods?",
    "What resources (books, websites) do you use for vegan info?",
    "Do you follow any specific vegan sub-diet (e.g., raw vegan)?",
    "How do you educate others about veganism?",
    "What is your go-to snack?",
    "How do you track your nutritional intake?",
    "What advice would you give to new vegans?",
  ],
  vegetarian: [
    "What is your primary motivation for choosing a vegetarian diet?",
    "How long have you been following a vegetarian diet?",
    "Do you consume dairy and/or eggs?",
    "How often do you eat out at vegetarian-friendly restaurants?",
    "What is your biggest challenge with a vegetarian diet?",
    "Do you take any supplements (e.g., B12, iron)?",
    "How do you ensure adequate protein intake?",
    "Do you avoid certain animal-derived products (e.g., gelatin)?",
    "How do you handle social situations involving non-vegetarian food?",
    "What is your favorite vegetarian meal?",
    "Do you read ingredient labels for hidden animal products?",
    "How do you plan your grocery shopping?",
    "Do you cook most of your meals at home?",
    "How do you manage cravings for non-vegetarian foods?",
    "What resources (books, websites) do you use for vegetarian info?",
    "Do you follow any specific vegetarian sub-diet (e.g., lacto-ovo)?",
    "How do you educate others about vegetarianism?",
    "What is your go-to snack?",
    "How do you track your nutritional intake?",
    "What advice would you give to new vegetarians?",
  ],
  omnivore: [
    "What is your primary motivation for your current diet?",
    "How often do you consume animal products?",
    "Do you try to include plant-based meals?",
    "How often do you eat out?",
    "What is your biggest challenge with your current diet?",
    "Do you take any supplements?",
    "How do you ensure a balanced diet?",
    "Do you avoid any specific foods?",
    "How do you handle social situations involving food?",
    "What is your favorite meal?",
    "Do you read ingredient labels?",
    "How do you plan your grocery shopping?",
    "Do you cook most of your meals at home?",
    "How do you manage cravings?",
    "What resources (books, websites) do you use for diet info?",
    "Do you follow any specific diet plan (e.g., paleo, keto)?",
    "How do you educate others about your diet?",
    "What is your go-to snack?",
    "How do you track your nutritional intake?",
    "What advice would you give to someone considering your diet?",
  ],
  "4FED": [
    "What is your primary motivation for choosing the 4FED diet?",
    "How long have you been following the 4FED diet?",
    "Do you follow all four food elimination phases strictly?",
    "How often do you reintroduce foods?",
    "What is your biggest challenge with the 4FED diet?",
    "Do you take any supplements while on 4FED?",
    "How do you ensure adequate nutrition during elimination?",
    "Do you avoid any foods beyond the 4FED restrictions?",
    "How do you handle social situations while on 4FED?",
    "What is your favorite 4FED-compliant meal?",
    "Do you read ingredient labels for restricted foods?",
    "How do you plan your grocery shopping on 4FED?",
    "Do you cook most of your meals at home during 4FED?",
    "How do you manage cravings for restricted foods?",
    "What resources (books, websites) do you use for 4FED info?",
    "Do you follow any specific sub-variant of 4FED?",
    "How do you educate others about 4FED?",
    "What is your go-to 4FED snack?",
    "How do you track your nutritional intake on 4FED?",
    "What advice would you give to new 4FED followers?",
  ],
};

export default function DietForm() {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("dietFormData", JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    if (page < TOTAL_PAGES - 1) setPage(page + 1);
  };
  const handleBack = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleDietTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, dietType: e.target.value as DietType });
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...formData.answers];
    newAnswers[page - 1] = e.target.value;
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("formCompleted", "true");
    localStorage.removeItem("dietFormData");
    router.push("/"); // Redirect to main app
  };

  const getQuestion = (idx: number) => {
    if (!formData.dietType) return `Question ${idx + 1}`;
    return QUESTIONS[formData.dietType][idx] || `Question ${idx + 1}`;
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Diet Onboarding Form</h1>
      <form onSubmit={handleSubmit}>
        {page === 0 ? (
          <div>
            <label>
              Select your diet type:
              <select value={formData.dietType || ""} onChange={handleDietTypeChange} required>
                <option value="" disabled>
                  -- Choose --
                </option>
                {DIET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div>
            <label>
              {getQuestion(page - 1)}
              <input
                type="text"
                value={formData.answers[page - 1] || ""}
                onChange={handleAnswerChange}
                required
              />
            </label>
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          {page > 0 && (
            <button type="button" onClick={handleBack} style={{ marginRight: 8 }}>
              Back
            </button>
          )}
          {page < TOTAL_PAGES - 1 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={page === 0 ? !formData.dietType : !formData.answers[page - 1]}
            >
              Next
            </button>
          )}
          {page === TOTAL_PAGES - 1 && (
            <button type="submit" disabled={!formData.answers[page - 1]}>
              Submit
            </button>
          )}
        </div>
        <div style={{ marginTop: 16 }}>
          Page {page + 1} of {TOTAL_PAGES}
        </div>
      </form>
    </div>
  );
} 