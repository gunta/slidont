import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface SlidingNumberProps {
	value: number;
	className?: string;
}

export function SlidingNumber({ value, className }: SlidingNumberProps) {
	const spring = useSpring(0, {
		stiffness: 100,
		damping: 20,
	});
	const display = useTransform(spring, (current) =>
		Math.round(current).toLocaleString()
	);

	useEffect(() => {
		spring.set(value);
	}, [spring, value]);

	return (
		<motion.span className={className} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
			{display}
		</motion.span>
	);
}

