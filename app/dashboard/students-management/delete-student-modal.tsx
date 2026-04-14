import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Student, useDeleteUser } from "@/lib/hooks/fetch/students";
import { formatFullName } from "@/lib/hooks/format-full-name";
import React from "react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null | undefined;
}

export function DeleteStudentModal({ isOpen, onClose, student }: DeleteUserModalProps) {

  const [lastStudent, setLastStudent] = React.useState<Student | null>(null);

  React.useEffect(() => {
    if (student) setLastStudent(student);
  }, [student]);

  const displayStudent = student || lastStudent;

  const { mutate: deleteStudent, isPending } = useDeleteUser();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-140" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
        </DialogHeader>

        {
          displayStudent && <p className="font-medium text-black-primary">
            ¿Seguro que deseas eliminar al estudiante{" "}
            <span className="font-semibold capitalize">
              {formatFullName(displayStudent.firstName, displayStudent.lastName)}
            </span>{" "}
            del registro?
          </p>
        }

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="lg">
            Cancelar
          </Button>
          <Button variant="destructive" size="lg"
            onClick={() => {
              deleteStudent(student?.id)
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
