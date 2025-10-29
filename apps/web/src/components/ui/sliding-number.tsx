import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface SlidingNumberProps {
	value: number;
	className?: string;
}

export function SlidingNumber({ value, className }: SlidingNumberProps) {
	const spring = useSpring(0, {
		stiffness: 300,
		damping: 30,
	});
	const display = useTransform(spring, (current) =>
		Math.round(current).toLocaleString()
	);
	const prevValueRef = useRef(value);

	useEffect(() => {
		// Only animate if the value has actually changed
		if (prevValueRef.current !== value) {
			spring.set(value);
			prevValueRef.current = value;
		}
	}, [spring, value]);

	return (
		<motion.span className={className}>
			{display}
		</motion.span>
	);
}

