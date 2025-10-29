import { motion } from "framer-motion";

interface PulseCircleProps {
	color?: string;
	size?: number;
}

export function PulseCircle({ color = "bg-green-500", size = 8 }: PulseCircleProps) {
	return (
		<motion.div
			className={`rounded-full ${color}`}
			style={{ width: size, height: size }}
			animate={{
				scale: [1, 1.5, 1],
				opacity: [1, 0.5, 1],
			}}
			transition={{
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			}}
		/>
	);
}

