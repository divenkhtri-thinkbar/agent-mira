import textData from "@/config/text.json";
import ChatOptionButton from "./chatOptionButton";

interface WinningOfferQuestionProps {
  avatarUrl?: string;
  onOptionSelect: (option: { id: string; text: string; icon?: string }) => void;
  condition?: string;
  variant?: string;
  optionRefs?: React.RefObject<HTMLDivElement | null>[];
}

export function WinningOfferQuestion({
  avatarUrl,
  onOptionSelect,
  condition,
  optionRefs,
}: WinningOfferQuestionProps) {
  const questions = textData.winningOfferQuestions;

  const marketAnalysisQuestion = {
    id: "market-analysis-question",
    type: "agent" as const,
    content: questions.marketAnalysis.question,
    showAvatar: true,
    avatarUrl,
  };

  const winningOfferQuestion = {
    id: "winning-offer-question",
    type: "agent" as const,
    content: questions.winningOfferOption.question,
    showAvatar: true,
    avatarUrl,
  };

  const makeAdjustmentQuestion = {
    id: "make-adjustment-question",
    type: "agent" as const,
    content: questions.makeAdjustment.question,
    showAvatar: true,
    avatarUrl,
  };

  const insideScoopQuestion = {
    id: "inside-scoop-question",
    type: "agent" as const,
    content: questions.insideScoop.question,
    showAvatar: true,
    avatarUrl,
  };

  const propertyInPersonQuestion = {
    id: "property-in-person-question",
    type: "agent" as const,
    content: questions.propertyInPerson.question,
    showAvatar: true,
    avatarUrl,
  };

  const firstImpressionQuestion = {
    id: "first-impression-question",
    type: "agent" as const,
    content: questions.firstImpression.question,
    showAvatar: true,
    avatarUrl,
  };

  const featuresLookingQuestion = {
    id: "features-looking-question",
    type: "agent" as const,
    content: questions.featuresLooking.question,
    showAvatar: true,
    avatarUrl,
  };

  const knowAboutQualityScoreQuestion = {
    id: "know-about-quality-score-question",
    type: "agent" as const,
    content: questions.knowAboutQualityScore.question,
    showAvatar: true,
    avatarUrl,
  };

  const repairsNeededQuestion = {
    id: "repairs-needed-question",
    type: "agent" as const,
    content: questions.repairsNeeded.question,
    showAvatar: true,
    avatarUrl,
  };

  const reportDownloadQuestion = {
    id: "report-download-question",
    type: "agent" as const,
    content: questions.reportDownload.question,
    showAvatar: true,
    avatarUrl,
  };

  const winningOfferOptions = {
    id: "winning-offer-options",
    type: "options" as const,
    content: "",
    options: questions.winningOfferOption.options.map((text, index) => ({
      id: String(index + 1),
      text,
      icon: ["sparkles", "building", "shield", "search"][index],
    })),
  };

  const makeAdjustmentOptions = {
    id: "make-adjustment-options",
    type: "options" as const,
    content: "",
    options: questions.makeAdjustment.options.map((text, index) => ({
      id: String(index + 7),
      text,
      icon: ["check", "x"][index],
    })),
  };

  const insideScoopOptions = {
    id: "inside-scoop-options",
    type: "options" as const,
    content: "",
    options: questions.insideScoop.options.map((text, index) => ({
      id: String(index + 9),
      text,
      icon: index === 0 ? "check" : "x",
    })),
  };

  const propertyInPersonOptions = {
    id: "property-in-person-options",
    type: "options" as const,
    content: "",
    options: questions.propertyInPerson.options.map((text, index) => ({
      id: String(index + 14),
      text,
      icon: index === 0 ? "check" : "x",
    })),
  };

  const firstImpressionOptions = {
    id: "first-impression-options",
    type: "options" as const,
    content: "",
    options: questions.firstImpression.options.map((text, index) => ({
      id: String(index + 16),
      text,
      icon: index === 0 ? "check" : index === 1 ? "meh" : "x",
    })),
  };

  const featuresLookingOptions = {
    id: "features-looking-options",
    type: "options" as const,
    content: "",
    options: questions.featuresLooking.options.map((text, index) => ({
      id: String(index + 21),
      text,
      icon: index === 0 ? "check" : "x",
    })),
  };

  const marketAnalysisOptions = {
    id: "market-analysis-options",
    type: "options" as const,
    content: "",
    options: questions.marketAnalysis.options.map((text, index) => ({
      id: String(index + 1),
      text,
      icon: ["trending-up", "scale", "pie-chart"][index],
    })),
  };

  const knowAboutQualityScoreOptions = {
    id: "know-about-quality-score-options",
    type: "options" as const,
    content: "",
    options: questions.knowAboutQualityScore.options.map((text, index) => ({
      id: String(index + 1),
      text,
    })),
  };

  const repairsNeededOptions = {
    id: "repairs-needed-options",
    type: "options" as const,
    content: "",
    options: questions.repairsNeeded.options.map((text, index) => ({
      id: String(index + 1),
      text,
    })),
  };

  const reportDownloadOptions = {
    id: "report-download-options",
    type: "options" as const,
    content: "",
    options: questions.reportDownload.options.map((text, index) => ({
      id: String(index + 1),
      text,
    })),
  };

  const questionMessage =
    condition === "winning-offer-option"
      ? winningOfferQuestion
      : condition === "make-adjustment"
      ? makeAdjustmentQuestion
      : condition === "market-analysis"
      ? marketAnalysisQuestion
      : condition === "inside-scoop"
      ? insideScoopQuestion
      : condition === "property-in-person"
      ? propertyInPersonQuestion
      : condition === "first-impression"
      ? firstImpressionQuestion
      : condition === "features-looking"
      ? featuresLookingQuestion
      : condition === "know-about-quality-score"
      ? knowAboutQualityScoreQuestion
      : condition === "repairs-needed"
      ? repairsNeededQuestion
      : condition === "download-report"
      ? reportDownloadQuestion
      : winningOfferQuestion;

  const optionsMessage =
    condition === "market-analysis"
      ? marketAnalysisOptions
      : condition === "winning-offer-option"
      ? winningOfferOptions
      : condition === "make-adjustment"
      ? makeAdjustmentOptions
      : condition === "inside-scoop"
      ? insideScoopOptions
      : condition === "property-in-person"
      ? propertyInPersonOptions
      : condition === "first-impression"
      ? firstImpressionOptions
      : condition === "features-looking"
      ? featuresLookingOptions
      : condition === "know-about-quality-score"
      ? knowAboutQualityScoreOptions
      : condition === "repairs-needed"
      ? repairsNeededOptions
      : condition === "download-report"
      ? reportDownloadOptions
      : winningOfferOptions;

  return (
    <div className="space-y-4">
      <div className="agentChat py-1">{questionMessage.content}</div>
      <ChatOptionButton
        options={optionsMessage.options!}
        onSelect={onOptionSelect}
        variant={
          condition === "market-analysis"
            ? "data-switch"
            : condition === "know-about-quality-score" || condition === "repairs-needed"
            ? "know-about-quality-score"
            : condition === "download-report"
            ? "side-by-side"
            : undefined
        }
        optionRefs={condition === "market-analysis" ? optionRefs : undefined}
      />
    </div>
  );
}

export default WinningOfferQuestion;