import { useState, useEffect } from "react";

const GRADIENT_PAIRS = [
	{ from: "#ef4444", to: "#f97316" }, // red to orange
	{ from: "#f97316", to: "#eab308" }, // orange to yellow
	{ from: "#eab308", to: "#84cc16" }, // yellow to lime
	{ from: "#84cc16", to: "#22c55e" }, // lime to green
	{ from: "#22c55e", to: "#10b981" }, // green to emerald
	{ from: "#10b981", to: "#14b8a6" }, // emerald to teal
	{ from: "#14b8a6", to: "#06b6d4" }, // teal to cyan
	{ from: "#06b6d4", to: "#0ea5e9" }, // cyan to sky
	{ from: "#0ea5e9", to: "#3b82f6" }, // sky to blue
	{ from: "#3b82f6", to: "#6366f1" }, // blue to indigo
	{ from: "#6366f1", to: "#8b5cf6" }, // indigo to violet
	{ from: "#8b5cf6", to: "#a855f7" }, // violet to purple
	{ from: "#a855f7", to: "#d946ef" }, // purple to fuchsia
	{ from: "#d946ef", to: "#ec4899" }, // fuchsia to pink
	{ from: "#ec4899", to: "#f43f5e" }, // pink to rose
	{ from: "#f43f5e", to: "#ef4444" }, // rose to red
];

function generateGradientFromName(name: string): { from: string; to: string } {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length];
}

export function getInitials(name: string): string {
	if (!name) return "?";
	
	// Check if name contains kanji or other CJK characters
	const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff]/.test(name);
	
	if (hasCJK) {
		// For CJK names, use the last 2 characters
		return name.slice(-2);
	}
	
	// For Latin names, try to get first letter of first word and first letter of last word
	const parts = name.trim().split(/\s+/);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	
	// If only one word, use first 2 characters
	if (name.length >= 2) {
		return name.substring(0, 2).toUpperCase();
	}
	
	return name.charAt(0).toUpperCase();
}

function generateSessionId(): string {
	if (typeof window === "undefined") return "";
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function useLocalIdentity() {
	const [displayName, setDisplayName] = useState<string>("");
	const [authorGradient, setAuthorGradient] = useState<{ from: string; to: string }>({ from: "#3b82f6", to: "#6366f1" });
	const [sessionId, setSessionId] = useState<string>("");

	useEffect(() => {
		const storedName = localStorage.getItem("qa_display_name");
		const storedGradient = localStorage.getItem("qa_author_gradient");
		const storedSessionId = localStorage.getItem("qa_session_id");

		if (storedName) {
			setDisplayName(storedName);
			if (storedGradient) {
				setAuthorGradient(JSON.parse(storedGradient));
			} else {
				setAuthorGradient(generateGradientFromName(storedName));
			}
		} else {
			setAuthorGradient(GRADIENT_PAIRS[Math.floor(Math.random() * GRADIENT_PAIRS.length)]);
		}

		if (storedSessionId) {
			setSessionId(storedSessionId);
		} else {
			const newSessionId = generateSessionId();
			setSessionId(newSessionId);
			localStorage.setItem("qa_session_id", newSessionId);
		}
	}, []);

	const rememberName = (name: string) => {
		localStorage.setItem("qa_display_name", name);
		const gradient = generateGradientFromName(name);
		localStorage.setItem("qa_author_gradient", JSON.stringify(gradient));
		setDisplayName(name);
		setAuthorGradient(gradient);
	};

	return {
		displayName,
		authorColor: authorGradient.from, // Keep for backward compatibility
		authorGradient,
		sessionId,
		rememberName,
	};
}

