import cursorLight from "@/assets/cursorlight.svg";

interface SlidontLogoProps {
	className?: string;
	height?: number;
}

export function SlidontLogo({ className = "", height = 40 }: SlidontLogoProps) {
	return (
		<img
			src={cursorLight}
			alt="Slidont"
			className={className}
			style={{ height }}
		/>
	);
}

