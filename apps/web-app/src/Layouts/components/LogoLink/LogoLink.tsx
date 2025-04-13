import path from "@/constants/path";
import { Link } from "react-router-dom";

const LogoLink = () => {
  return (
    <Link to={path.dashBoard} className="block">
      <div className="flex items-center gap-2 hover:opacity-90 transition-all duration-300">
        <svg
          width="42"
          height="42"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-float"
        >
          <defs>
            <linearGradient
              id="logoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "#3B82F6" }} />
              <stop offset="50%" style={{ stopColor: "#8B5CF6" }} />
              <stop offset="100%" style={{ stopColor: "#EC4899" }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring with gradient and rotation animation */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-spin-slow"
            style={{ transformOrigin: "center" }}
          />

          {/* Inner hexagon */}
          <path
            d="M50 15L75 30V60L50 75L25 60V30L50 15Z"
            fill="url(#logoGradient)"
            filter="url(#glow)"
            opacity="0.9"
          />

          {/* Token symbol */}
          <circle cx="50" cy="50" r="15" fill="white" opacity="0.95" />

          {/* Currency dots */}
          <circle cx="50" cy="42" r="2.5" fill="url(#logoGradient)" />
          <circle cx="50" cy="58" r="2.5" fill="url(#logoGradient)" />
          <rect
            x="45"
            y="46"
            width="10"
            height="2.5"
            rx="1.25"
            fill="url(#logoGradient)"
          />

          {/* Decorative particles */}
          <circle
            cx="20"
            cy="50"
            r="2"
            fill="url(#logoGradient)"
            className="animate-pulse"
          />
          <circle
            cx="80"
            cy="50"
            r="2"
            fill="url(#logoGradient)"
            className="animate-pulse"
          />
          <circle
            cx="50"
            cy="20"
            r="2"
            fill="url(#logoGradient)"
            className="animate-pulse"
          />
          <circle
            cx="50"
            cy="80"
            r="2"
            fill="url(#logoGradient)"
            className="animate-pulse"
          />
        </svg>

        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ERC20
          </span>
        </div>
      </div>
    </Link>
  );
};

export default LogoLink;
