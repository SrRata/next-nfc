import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Course, useDeleteCourse } from "@/lib/hooks/fetch/courses";
import { formatFullName } from "@/lib/hooks/format-full-name";
import React from "react";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null | undefined;
}

export function DeleteCourseModal({ isOpen, onClose, course }: DeleteCourseModalProps) {

  const [lastCourse, setLastCourse] = React.useState<Course | null>(null);

    React.useEffect(() => {
      if (course) setLastCourse(course);
    }, [course]);

  const displayCourse = course || lastCourse;

    const { mutate: deleteCourse, isPending } = useDeleteCourse();
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-140" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar estudiante</DialogTitle>
        </DialogHeader>

        {
          displayCourse && 
          <p className="font-medium text-black-primary">
            ¿Seguro que deseas eliminar el curso{" "}
            <span className="font-semibold capitalize">
              {displayCourse.courseName}
            </span>{" "}
            del registro?
          </p>
        }

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="lg">
            Cancelar
          </Button>
          <Button variant="destructive" size="lg" onClick={() => {
            deleteCourse(course?.id)
            onClose();
          }}
          disabled={isPending}
          >
            {isPending && <Spinner />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
