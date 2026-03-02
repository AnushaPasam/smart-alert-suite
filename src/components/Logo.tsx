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
                "flex items-center gap-3 group transition-all duration-200 active:scale-95 shrink-0",
                className
            )}
        >
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center transition-all duration-300 overflow-hidden">
                <img src="/logo.svg" alt="EduAlert Logo" className="h-full w-full object-contain" />
            </div>
            {showText && (
                <span className="font-black text-xl sm:text-2xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
                    Edu<span className="text-primary font-bold">Alert</span>
                </span>
            )}
        </Link>
    );
}
