import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SparkleProps {
	size?: number;
	className?: string;
}

export function Sparkle({ size = 20, className }: SparkleProps) {
	return (
		<motion.span
			className={className}
			animate={{
				rotate: [0, 180, 360],
				scale: [1, 1.2, 1],
			}}
			transition={{
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			}}
		>
			<Sparkles size={size} className="text-yellow-400" />
		</motion.span>
	);
}

