import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "root/components/ui/input";
import { Button } from "root/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "root/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Course } from "app/models/course.model";
import type { Category } from "app/models/category.model";
import courseService from "app/services/course.service";
import categoryService from "app/services/category.service";
import { CourseCard } from "./course.card";
import enrollmentService from "app/services/enrollment.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "security/context/auth.context";

export function CourseSearch() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<string | null>("all");
  const [free, setFree] = useState<string | null>("all");
  const [sortBy, setSortBy] = useState<string | null>("default");
  const [category, setCategory] = useState<string | null>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        console.log("Categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const enrolledCourses = await enrollmentService.getMyEnrolledCourses(
          user!.id,
        );
        const courseIds = enrolledCourses.map((course) => course.id);
        setEnrolledCourseIds(courseIds);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchCategories();

    if (user) {
      fetchEnrolledCourses();
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const filters: any = {};
        if (searchTerm) filters.keyword = searchTerm;
        if (free !== "all") filters.free = free;
        if (difficulty !== "all") filters.difficulty = difficulty;
        if (sortBy !== "default") filters.sortBy = sortBy;
        if (category !== "all") filters.categoryId = Number(category);
        console.log("Filters:", filters);
        const data = await courseService.search(filters);
        console.log("Courses:", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [searchTerm, difficulty, free, sortBy, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already triggered by the useEffect
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await enrollmentService.enrollInCourse(user!.id, courseId);
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      toast.success("Successfully enrolled in the course!");
      navigate(`/student/courses/${courseId}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Encuentra tu próximo curso</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={category || "all"} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficulty || "all"} onValueChange={setDifficulty}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={free || "all"} onValueChange={setFree}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="true">Free</SelectItem>
                <SelectItem value="false">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy || "default"} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              isEnrolled={enrolledCourseIds.includes(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
