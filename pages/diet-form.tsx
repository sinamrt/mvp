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

  // Placeholder questions, can be replaced with real ones
  const getQuestion = (idx: number) => {
    if (formData.dietType === "vegan") return `Vegan Question ${idx + 1}`;
    if (formData.dietType === "vegetarian") return `Vegetarian Question ${idx + 1}`;
    if (formData.dietType === "omnivore") return `Omnivore Question ${idx + 1}`;
    if (formData.dietType === "4FED") return `4FED Question ${idx + 1}`;
    return `Question ${idx + 1}`;
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