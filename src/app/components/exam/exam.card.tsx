import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "root/components/ui/card"
import { Button } from "root/components/ui/button"
import { Badge } from "root/components/ui/badge"
import type { Exam, ExamResult } from "app/models/exam.model"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { Link } from "react-router-dom"

interface ExamCardProps {
  exam: Exam
  result?: ExamResult
}

export function ExamCard({ exam, result }: ExamCardProps) {
  const hasTaken = !!result
  const hasPassed = result?.passed

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{exam.title}</CardTitle>
          {hasTaken && (
            <Badge variant={hasPassed ? "default" : "destructive"} className="flex items-center gap-1">
              {hasPassed ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Passed
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Failed
                </>
              )}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Time Limit: {exam.timeLimit} minutes</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>Questions: {exam.questions.length}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>Passing Score: {exam.passingScore}%</span>
        </div>

        {hasTaken && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Your Score</span>
              <span className="font-bold">{result.score}%</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Correct Answers: {result.correctAnswers} / {result.totalQuestions}
            </div>
            {result.feedback && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Feedback: </span>
                {result.feedback}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {hasTaken ? (
          <Button asChild variant={hasPassed ? "outline" : "default"} className="w-full">
            <Link to={`/student/exams/results/${exam.id}`}>{hasPassed ? "Review Results" : "Retake Exam"}</Link>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link to={`/student/exams/take/${exam.id}`}>Start Exam</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
