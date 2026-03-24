import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course } from "@/lib/hooks/fetch/courses";
import { formatFullName } from "@/lib/hooks/format-full-name";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null | undefined;
}

export function DeleteCourseModal({ isOpen, onClose, course }: DeleteCourseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-140" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar estudiante</DialogTitle>
        </DialogHeader>

        {course && (
          <p className="font-medium text-black-primary">
            ¿Seguro que deseas eliminar el curso{" "}
            <span className="font-semibold capitalize">
              {formatFullName(course.courseName, course.parallel)}
            </span>{" "}
            del registro?
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="lg">
            Cancelar
          </Button>
          <Button variant="destructive" size="lg" onClick={() => {
            onClose();
          }}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
