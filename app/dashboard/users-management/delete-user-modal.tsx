import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser, User } from "@/lib/hooks/fetch/users";
import { formatFullName } from "@/lib/hooks/format-full-name";
import React from "react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null | undefined;
}

export function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {

  const [lastUser, setLastUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (user) setLastUser(user);
  }, [user]);

  const displayUser = user || lastUser;

  const { mutate: deleteUser, isPending } = useDeleteUser();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-140" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
        </DialogHeader>

        {
          displayUser && <p className="font-medium text-black-primary">
            ¿Seguro que deseas eliminar al usuario{" "}
            <span className="font-semibold capitalize">
              {formatFullName(displayUser.firstName, displayUser.lastName)}
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
              deleteUser(user?.id)
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
