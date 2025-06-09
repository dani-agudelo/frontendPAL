import { useState, useEffect } from "react";
import { EnrolledCourseCard } from "app/components/enrollment/enrolled.course.card";
import { Input } from "root/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "root/components/ui/select";
import type { EnrolledCourse } from "app/models/enrollment.model";
import enrollmentService from "app/services/enrollment.service";
import { Search } from "lucide-react";
import { useAuth } from "security/context/auth.context";

export default function EnrolledCourses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setIsLoading(true);
      try {
        const data = await enrollmentService.getMyEnrolledCourses(user!.id);
        setEnrolledCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = enrolledCourses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, statusFilter, enrolledCourses]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <EnrolledCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "You haven't enrolled in any courses yet"}
          </p>
        </div>
      )}
    </div>
  );
}
