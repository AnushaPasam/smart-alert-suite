import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Password updated successfully");

      // Close after a short delay to show success state
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors group">
          <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="flex-1 text-left">Change Password</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        {success ? (
          <div className="py-10 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-campus-olive-light flex items-center justify-center text-campus-olive animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Password Updated!</h3>
              <p className="text-muted-foreground mt-2">
                Your security settings have been saved.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Update Password
              </DialogTitle>
              <DialogDescription>
                Secure your account by choosing a strong new password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current" className="text-sm font-semibold">
                  Current Password
                </Label>
                <Input
                  id="current"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="bg-muted/30 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new" className="text-sm font-semibold">
                  New Password
                </Label>
                <Input
                  id="new"
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="bg-muted/30 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-sm font-semibold">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-muted/30 focus-visible:ring-primary/20"
                />
              </div>
              <DialogFooter className="pt-4 flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-primary text-primary-foreground hover:bg-campus-blue-hover"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
