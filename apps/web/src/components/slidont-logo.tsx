import { useTheme } from "@/components/theme-provider";
import cursorLight from "@/assets/cursorlight.svg";
import cursorDark from "@/assets/cursordark.svg";

interface SlidontLogoProps {
	className?: string;
	height?: number;
	variant?: "light" | "dark" | "auto";
}

export function SlidontLogo({ className = "", height = 40, variant = "auto" }: SlidontLogoProps) {
	const { theme } = useTheme();
	
	let src = cursorLight;
	
	if (variant === "light") {
		src = cursorLight;
	} else if (variant === "dark") {
		src = cursorDark;
	} else {
		// auto mode - check theme
		const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
		src = isDark ? cursorDark : cursorLight;
	}

	return (
		<img
			src={src}
			alt="Slidont"
			className={className}
			style={{ height }}
		/>
	);
}

