import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteStudent, Student } from "@/lib/hooks/fetch/students";
import { formatFullName } from "@/lib/hooks/format-full-name";

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null | undefined;
}

export function DeleteStudentModal({ isOpen, onClose, student }: DeleteStudentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-140" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar estudiante</DialogTitle>
        </DialogHeader>

        {student && (
          <p className="font-medium text-black-primary">
            ¿Seguro que deseas eliminar al estudiante{" "}
            <span className="font-semibold capitalize">
              {formatFullName(student.firstName, student.lastName)}
            </span>{" "}
            del registro?
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="lg">
            Cancelar
          </Button>
          <Button variant="destructive" size="lg" onClick={() => {
            student?.id && deleteStudent(student.id)
            onClose();
          }}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
