import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BounceInProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

export function BounceIn({ children, delay = 0, className }: BounceInProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.3 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				type: "spring",
				stiffness: 400,
				damping: 17,
				delay,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

