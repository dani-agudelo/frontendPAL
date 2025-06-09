import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "root/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import type { Exam, ExamResult } from "app/models/exam.model";
import examService from "app/services/exam.service";
import { toast } from "sonner";
import { CheckCircle, XCircle, ArrowLeft, Award } from "lucide-react";

export default function ExamResults() {
  const { examId } = useParams<{ examId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to get result from location state first (when coming directly from exam)
  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      if (!examId) return;

      setIsLoading(true);
      try {
        const [examData, resultData] = await Promise.all([
          examService.getExamById(Number(examId)),
          // Only fetch result if not already set from location state
          !result ? examService.getExamResults(Number(examId)) : null,
        ]);

        setExam(examData);
        if (!result && resultData) {
          setResult(resultData);
        }
      } catch (error) {
        console.error("Error fetching exam results:", error);
        toast.error("Failed to load exam results");
        navigate("/student/courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [examId, navigate, result]);

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

  if (!exam || !result) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Results not found</h1>
        <p className="mb-6">
          The exam results you're looking for don't exist or you don't have
          access to them.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate(`/student/courses/${exam.courseId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{exam.title} - Results</CardTitle>
            <CardDescription>{exam.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
              <div className="text-5xl font-bold mb-2">{result.score}%</div>
              <div className="text-lg font-medium mb-1">
                {result.passed ? (
                  <span className="text-green-500 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Passed
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Failed
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Passing score: {result.passingScore}%
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Correct Answers
                  </div>
                  <div className="text-2xl font-bold">
                    {result.correctAnswers}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Total Questions
                  </div>
                  <div className="text-2xl font-bold">
                    {result.totalQuestions}
                  </div>
                </div>
              </div>
            </div>

            {result.feedback && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Feedback</h3>
                <p>{result.feedback}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {result.passed ? (
              <div className="flex items-center gap-2 text-green-500">
                <Award className="h-5 w-5" />
                <span>This exam has been completed successfully</span>
              </div>
            ) : (
              <Button asChild>
                <Link to={`/student/exams/take/${exam.id}`}>Retake Exam</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Question Review</h2>

          {exam.questions.map((question, index) => {
            const userAnswer = result.answers[index];
            const isCorrect = userAnswer === question.correctOptionIndex;

            return (
              <Card
                key={index}
                className={isCorrect ? "border-green-200" : "border-red-200"}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">
                      Question {index + 1}
                    </CardTitle>
                    {isCorrect ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Correct
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        Incorrect
                      </span>
                    )}
                  </div>
                  <CardDescription>{question.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-md ${
                          optionIndex === question.correctOptionIndex
                            ? "bg-green-100 dark:bg-green-900/20"
                            : optionIndex === userAnswer
                              ? "bg-red-100 dark:bg-red-900/20"
                              : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {optionIndex === question.correctOptionIndex ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : optionIndex === userAnswer ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <div className="size-4" />
                          )}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
