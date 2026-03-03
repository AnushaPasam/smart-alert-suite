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
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    // Simulate API call to send reset link
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Security code sent to your email");
    }, 1500);
  };

  const handleReset = () => {
    setOpen(false);
    setSubmitted(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-xs text-primary font-medium hover:underline hover:text-campus-blue transition-colors"
        >
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-campus-olive-light flex items-center justify-center text-campus-olive animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Check your email</h3>
              <p className="text-sm text-muted-foreground px-4">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-foreground">{email}</span>.
                Please check your inbox and spam folder.
              </p>
            </div>
            <Button
              onClick={handleReset}
              className="mt-4 w-full bg-primary text-primary-foreground hover:bg-campus-blue-hover"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Mail className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Reset Password
              </DialogTitle>
              <DialogDescription>
                Enter your campus email address and we'll send you a link to
                reset your password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-semibold">
                  Campus Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="you@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/30 focus-visible:ring-primary/20 h-11"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-campus-blue-hover h-11 shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Instructions <ArrowRight className="h-4 w-4" />
                    </span>
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
