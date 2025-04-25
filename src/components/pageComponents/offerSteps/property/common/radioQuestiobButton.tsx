import RadioButtonGroup from "./radioButtonGroup";
import textData from "@/config/text.json";

interface RadioQuestionButtonProps {
  avatarUrl?: string;
  onOptionSelect: (selectedOptions: Array<{ id: string; text: string }>) => void;
  onSkip: () => void;
  onSubmit: () => void;
  condition?: string;
}

export function RadioQuestionButton({
  avatarUrl,
  onOptionSelect,
  onSkip,
  onSubmit,
  condition,
}: RadioQuestionButtonProps) {
  const radioQuestions = textData.step5Content.radioQuestionButton;
  const feedback = radioQuestions.feedback;

  const questions = {
    feedback: {
      id: "feedback-question",
      type: "agent" as const,
      content: feedback.question,
      showAvatar: true,
      avatarUrl,
      options: feedback.options.map((text, index) => ({
        id: String(index + 1),
        text,
      })),
    },
  };

  const question = condition === "feedback" ? questions.feedback : questions.feedback;

  return (
    <div className="space-y-4">
      <div className="agentChat py-1">{question.content}</div>
      <RadioButtonGroup
        options={question.options}
        onSelect={onOptionSelect}
        onSkip={onSkip}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default RadioQuestionButton;