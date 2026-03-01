import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    to?: string;
    showText?: boolean;
    onClick?: () => void;
}

export default function Logo({ className, to = "/", showText = true, onClick }: LogoProps) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={cn(
                "flex items-center gap-2.5 group transition-all duration-200 active:scale-95 shrink-0",
                className
            )}
        >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:-rotate-6 transition-all duration-300">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            {showText && (
                <span className="font-bold text-base sm:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                    Smart Campus
                </span>
            )}
        </Link>
    );
}
