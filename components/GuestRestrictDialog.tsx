"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const GuestRestrictDialog = ({
  open,
  onClose,
  title = "Sign in required",
  description = "You're browsing as a guest. To perform this action, please sign out and sign in with a real account.",
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

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className={cn(
        "admin-dialog",
        "rounded-xl border-0 bg-white p-0 shadow-xl",
        "max-w-md w-[calc(100%-2rem)]",
        "[&::backdrop]:bg-black/50 [&::backdrop]:backdrop-blur-[2px]"
      )}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-semibold text-dark-400">{title}</h3>
        <p className="mt-2 text-sm text-light-500">{description}</p>
        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 min-h-12 rounded-xl border-2"
          >
            Cancel
          </Button>
          <Button asChild className="flex-1 min-h-12 rounded-xl">
            <Link href="/sign-in">Go to Sign in</Link>
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default GuestRestrictDialog;
