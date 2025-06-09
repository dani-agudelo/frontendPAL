import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "root/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { RadioGroup, RadioGroupItem } from "root/components/ui/radio-group";
import { Label } from "root/components/ui/label";
import { Progress } from "root/components/ui/progress";
import type { Exam, ExamSubmission } from "app/models/exam.model";
import examService from "app/services/exam.service";
import { toast } from "sonner";
import { Clock, AlertCircle } from "lucide-react";

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;

      setIsLoading(true);
      try {
        const examData = await examService.getExamById(Number(examId));
        setExam(examData);

        // Initialize answers array with -1 (no answer selected)
        setAnswers(new Array(examData.questions.length).fill(-1));

        // Set timer
        setTimeLeft(examData.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast.error("Failed to load exam");
        navigate("/student/courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (timeLeft === null) return;

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = Number.parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!exam || !examId) return;

    // Check if all questions are answered
    const unansweredQuestions = answers.filter(
      (answer) => answer === -1,
    ).length;
    if (unansweredQuestions > 0 && timeLeft && timeLeft > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredQuestions} unanswered question(s). Are you sure you want to submit?`,
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    try {
      const submission: ExamSubmission = {
        examId: Number(examId),
        answers: answers,
      };

      const result = await examService.submitExam(Number(examId), submission);

      // Navigate to results page
      navigate(`/student/exams/results/${examId}`, { state: { result } });
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-4"></div>
          <div className="h-4 w-full bg-muted animate-pulse rounded-md mb-8"></div>
          <div className="h-64 bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Exam not found</h1>
        <p className="mb-6">
          The exam you're looking for doesn't exist or you don't have access to
          it.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">{exam.description}</p>
          </div>

          {timeLeft !== null && (
            <div
              className={`flex items-center gap-2 text-lg font-medium ${timeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestionIndex + 1}
            </CardTitle>
            <CardDescription>{currentQuestion.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={
                answers[currentQuestionIndex] === -1
                  ? undefined
                  : String(answers[currentQuestionIndex])
              }
              onValueChange={handleAnswerChange}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem
                    value={String(index)}
                    id={`option-${index}`}
                  />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {answers[currentQuestionIndex] === -1 && (
              <div className="flex items-center gap-2 text-amber-500 mt-4 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Please select an answer before proceeding</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex < exam.questions.length - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestionIndex] === -1}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting || answers.includes(-1)}
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 flex justify-between">
          <div className="flex gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentQuestionIndex
                    ? "bg-primary text-primary-foreground"
                    : answers[index] !== -1
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === exam.questions.length - 1 && (
            <Button
              onClick={handleSubmitExam}
              disabled={isSubmitting || answers.includes(-1)}
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
