import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function SignOutButton({
  className = "inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition",
  label = "Sign Out",
  onAfter,
}: {
  className?: string;
  label?: string;
  onAfter?: () => void;
}) {
  const { signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success("You've been signed out.");
      setOpen(false);
      onAfter?.();
      nav({ to: "/" });
    } catch (err) {
      toast.error("Couldn't sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className={className}>
          <LogOut size={14} /> {label}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of SautiApex?</AlertDialogTitle>
          <AlertDialogDescription>
            You'll need to sign in again to access your client portal. Any unsaved changes on this
            page will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Stay signed in</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              confirm();
            }}
            className="bg-brand-navy text-brand-cream hover:bg-brand-navy-deep"
          >
            {loading ? "Signing out…" : "Yes, sign out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
