import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building, Lock, LogOut } from "lucide-react";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

export default function PrincipalProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { document.title = "Principal Profile – Smart Campus"; }, []);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">Principal Profile</h1>

            <div className="campus-card-static p-6 space-y-5 shadow-elevated">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-md">
                        {user?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{user?.name || "Principal"}</p>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Head of Institution</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                    {[
                        { icon: User, label: "Full Name", value: user?.name || "Dr. Rajesh Verma" },
                        { icon: Mail, label: "Email", value: user?.email || "principal@campus.edu" },
                        { icon: Building, label: "Branch", value: user?.branch || "Administration" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 group">
                            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{item.label}</p>
                                <p className="text-sm font-medium">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                    <ChangePasswordDialog />
                    <button
                        onClick={() => { logout(); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
