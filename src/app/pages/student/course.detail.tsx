import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "root/components/ui/button";
import { Progress } from "root/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "root/components/ui/tabs";
import { ExamCard } from "app/components/exam/exam.card";
import type { Course } from "app/models/course.model";
import type { Content } from "app/models/content.model";
import type { Exam, ExamResult } from "app/models/exam.model";
import type { Enrollment } from "app/models/enrollment.model";
import courseService from "app/services/course.service";
import contentService from "app/services/content.service";
import examService from "app/services/exam.service";
import enrollmentService from "app/services/enrollment.service";
import certificateService from "app/services/certificate.service";
import { toast } from "sonner";
import {
  BookOpen,
  FileText,
  Video,
  Music,
  Award,
  CheckCircle,
} from "lucide-react";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isEligibleForCertificate, setIsEligibleForCertificate] =
    useState(false);
  const [eligibilityReason, setEligibilityReason] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      try {
        const [courseData, contentsData, examsData, enrollmentData] =
          await Promise.all([
            courseService.getOne(Number(courseId)),
            contentService.getAll(), // This should be filtered by courseId on the backend
            examService.getExamsByCourse(Number(courseId)),
            enrollmentService.getEnrollmentStatus(Number(courseId)),
          ]);

        setCourse(courseData);

        // Filter contents by courseId
        const filteredContents = contentsData.filter(
          (content) => content.courseId === Number(courseId),
        );
        setContents(filteredContents);

        if (filteredContents.length > 0) {
          setSelectedContent(filteredContents[0]);
        }

        setExams(examsData);
        setEnrollment(enrollmentData);

        // If enrolled, fetch exam results
        if (enrollmentData) {
          const resultsData = await examService.getMyExamResults(
            Number(courseId),
          );
          setExamResults(resultsData);

          // Check certificate eligibility
          const eligibility = await certificateService.checkEligibility(
            Number(courseId),
          );
          setIsEligibleForCertificate(eligibility.eligible);
          setEligibilityReason(eligibility.reason);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleGenerateCertificate = async () => {
    if (!courseId) return;

    try {
      await certificateService.generateCertificate(Number(courseId));
      toast.success("Certificate generated successfully!");
      // Redirect to certificates page
      window.location.href = `/student/certificates/course/${courseId}`;
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate");
    }
  };

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-4"></div>
        <div className="h-4 w-full max-w-2xl bg-muted animate-pulse rounded-md mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-96 bg-muted animate-pulse rounded-md"></div>
          </div>
          <div>
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <p className="mb-6">
          The course you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <Button asChild>
          <Link to="/student/courses">Back to My Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground mb-4">{course.description}</p>

        {enrollment && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{Math.round(enrollment.progress * 100)}%</span>
            </div>
            <Progress value={enrollment.progress * 100} className="h-3" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Content
              </TabsTrigger>
              <TabsTrigger value="exams" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Exams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              {contents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card border rounded-md overflow-hidden">
                    <div className="p-4 bg-muted font-medium">Content List</div>
                    <div className="divide-y">
                      {contents.map((content) => (
                        <button
                          key={content.id}
                          className={`w-full text-left p-3 flex items-center gap-2 hover:bg-muted transition-colors ${
                            selectedContent?.id === content.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedContent(content)}
                        >
                          {getContentIcon(content.type)}
                          <span className="truncate">
                            {content.url.split("/").pop()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-card border rounded-md overflow-hidden">
                    {selectedContent ? (
                      <div className="p-4">
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                          {getContentIcon(selectedContent.type)}
                          {selectedContent.url.split("/").pop()}
                        </h3>

                        <div className="aspect-video bg-black rounded-md overflow-hidden">
                          {selectedContent.type.toLowerCase() === "video" ? (
                            <video
                              src={`http://localhost:8080/files/${selectedContent.url.split("/").pop()}`}
                              controls
                              className="w-full h-full"
                            />
                          ) : selectedContent.type.toLowerCase() === "pdf" ? (
                            <iframe
                              src={`http://localhost:8080/files/${selectedContent.url.split("/").pop()}`}
                              className="w-full h-full"
                              title="PDF Content"
                            />
                          ) : selectedContent.type.toLowerCase() === "audio" ? (
                            <div className="flex items-center justify-center h-full bg-muted">
                              <audio
                                src={`http://localhost:8080/files/${selectedContent.url.split("/").pop()}`}
                                controls
                                className="w-full max-w-md"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full bg-muted">
                              <a
                                href={`http://localhost:8080/files/${selectedContent.url.split("/").pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Download File
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Select content from the list to view
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <h3 className="text-xl font-medium">No content available</h3>
                  <p className="text-muted-foreground mt-2">
                    This course doesn't have any content yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="exams">
              {exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      result={examResults.find(
                        (result) => result.examId === exam.id,
                      )}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <h3 className="text-xl font-medium">No exams available</h3>
                  <p className="text-muted-foreground mt-2">
                    This course doesn't have any exams yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="bg-card border rounded-md overflow-hidden mb-6">
            <div className="p-4 bg-muted font-medium">Course Information</div>
            <div className="p-4 space-y-4">
              <div>
                <span className="font-medium">Difficulty: </span>
                <span className="capitalize">{course.difficulty}</span>
              </div>
              <div>
                <span className="font-medium">Price: </span>
                <span>{course.free ? "Free" : `$${course.price}`}</span>
              </div>
              <div>
                <span className="font-medium">Category: </span>
                <span>{course.categoryId}</span>
              </div>
              <div>
                <span className="font-medium">Instructor: </span>
                <span>{course.instructorId}</span>
              </div>
            </div>
          </div>

          {enrollment && enrollment.status === "completed" ? (
            <div className="bg-card border rounded-md overflow-hidden">
              <div className="p-4 bg-muted font-medium">Certificate</div>
              <div className="p-4">
                {isEligibleForCertificate ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <Award className="h-16 w-16 text-yellow-500" />
                    </div>
                    <h3 className="font-medium mb-2">Congratulations!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You've completed this course and are eligible for a
                      certificate.
                    </p>
                    <Button
                      onClick={handleGenerateCertificate}
                      className="w-full"
                    >
                      Generate Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="font-medium mb-2">
                      Certificate Not Available
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {eligibilityReason ||
                        "You need to complete all requirements to get a certificate."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-md overflow-hidden">
              <div className="p-4 bg-muted font-medium">Course Completion</div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Complete all course materials and pass the exams to receive
                  your certificate.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle
                      className={`h-4 w-4 ${enrollment && enrollment.progress === 1 ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Complete all content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle
                      className={`h-4 w-4 ${examResults.length === exams.length && examResults.every((result) => result.passed) ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Pass all exams</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
