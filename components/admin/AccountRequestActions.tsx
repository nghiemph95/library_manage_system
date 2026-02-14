"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveUser, rejectUser } from "@/lib/admin/actions/user";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import RejectConfirmDialog from "./RejectConfirmDialog";

interface Props {
  userId: string;
}

const AccountRequestActions = ({ userId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleApprove = async () => {
    setLoading("approve");
    try {
      const result = await approveUser(userId);

      if (result.success) {
        toast({
          title: "Success",
          description: "User approved successfully",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error ?? "Failed to approve user",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRejectClick = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    setLoading("reject");
    try {
      const result = await rejectUser(userId);

      if (result.success) {
        setRejectDialogOpen(false);
        toast({
          title: "Success",
          description: "User rejected successfully",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error ?? "Failed to reject user",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={!!loading}
        className="confirm-approve"
      >
        {loading === "approve" ? "..." : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleRejectClick}
        disabled={!!loading}
        className="confirm-reject"
      >
        {loading === "reject" ? "..." : "Reject"}
      </Button>

      <RejectConfirmDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        loading={loading === "reject"}
      />
    </div>
  );
};

export default AccountRequestActions;
