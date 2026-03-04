import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export const FormNavigation = ({
  step,
  totalSteps,
  handleBack,
  handleNext,
  handleSubmit,
  isSubmitting,
}: FormNavigationProps) => {
  const isLastStep = step === totalSteps;

  const handleSubmitWithDebug = () => {
    console.group("[FormNavigation] Book Service clicked");
    console.log("step:", step);
    console.log("totalSteps:", totalSteps);
    console.log("isLastStep:", isLastStep);
    console.log("isSubmitting:", isSubmitting);
    console.groupEnd();
    handleSubmit();
  };

  const handleNextWithDebug = () => {
    console.group("[FormNavigation] Next clicked");
    console.log("step:", step);
    console.log("totalSteps:", totalSteps);
    console.groupEnd();
    handleNext();
  };

  const handleBackWithDebug = () => {
    console.group("[FormNavigation] Back clicked");
    console.log("step:", step);
    console.groupEnd();
    handleBack();
  };

  console.log(
    `[FormNavigation] render — step: ${step}/${totalSteps} | isLastStep: ${isLastStep} | isSubmitting: ${isSubmitting}`
  );

  return (
    <div className='flex justify-between'>
      {step > 1 ? (
        <Button
          type='button'
          variant='outline'
          onClick={handleBackWithDebug}
          disabled={isSubmitting}
        >
          <ChevronLeft className='mr-2 h-4 w-4' /> Back
        </Button>
      ) : (
        <div />
      )}

      {!isLastStep ? (
        <Button
          type='button'
          onClick={handleNextWithDebug}
          className='bg-red-600 hover:bg-red-700'
        >
          Next <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
      ) : (
        <Button
          type='button'
          onClick={handleSubmitWithDebug}
          className='bg-red-600 hover:bg-red-700'
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Book Service"}
        </Button>
      )}
    </div>
  );
};
