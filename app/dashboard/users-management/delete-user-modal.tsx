import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteUser, User } from "@/lib/hooks/fetch/users";
import { formatFullName } from "@/lib/hooks/format-full-name";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null | undefined;
}

export function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {

  const { deleteUser, loading, error } = useDeleteUser();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-140" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
        </DialogHeader>

        {user && (
          <p className="font-medium text-black-primary">
            ¿Seguro que deseas eliminar al usuario{" "}
            <span className="font-semibold capitalize">
              {formatFullName(user.firstName, user.lastName)}
            </span>{" "}
            del registro?
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="lg">
            Cancelar
          </Button>
          <Button variant="destructive" size="lg"
           onClick={() => {
            deleteUser(user?.id)
            onClose();
          }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
