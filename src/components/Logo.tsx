import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  to?: string;
  showText?: boolean;
  onClick?: () => void;
}

const Logo = ({
  className = "",
  to = "/",
  showText = true,
  onClick,
}: LogoProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 group transition-all duration-300 ${className}`}
    >
      <div className="relative">
        <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          <img
            src="/logo.svg"
            alt="EduAlert"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {showText && (
        <span className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-none">
          Edu<span className="text-primary">Alert</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
