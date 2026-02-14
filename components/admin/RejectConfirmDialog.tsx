"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const RejectConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    const handleDialogClose = () => onClose();
    dialog.addEventListener("close", handleDialogClose);
    return () => {
      dialog.removeEventListener("close", handleDialogClose);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleClose}
      className={cn(
        "admin-dialog",
        "rounded-xl border-0 bg-white p-0 shadow-xl",
        "max-w-md w-[calc(100%-2rem)]",
        "[&::backdrop]:bg-black/50 [&::backdrop]:backdrop-blur-[2px]"
      )}
    >
      <div className="confirm-content">
        <div className="confirm-illustration bg-red-100">
          <div className="bg-red-400 text-white rounded-full size-full flex items-center justify-center">
            <span className="text-4xl font-bold">?</span>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-dark-400">
          Reject account request?
        </h3>
        <p className="mt-2 text-center text-sm text-light-500">
          This action cannot be undone. The user will not be able to access the
          library.
        </p>
        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 min-h-12 rounded-xl border-2 border-primary-admin bg-white font-bold text-primary-admin transition-colors hover:bg-primary-admin/10 hover:border-primary-admin"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 min-h-12 rounded-xl border-2 border-red-800 bg-red-800 font-bold text-white transition-colors hover:bg-red-800/90 hover:border-red-800/90"
          >
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default RejectConfirmDialog;
