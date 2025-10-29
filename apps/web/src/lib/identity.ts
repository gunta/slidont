import { useState, useEffect } from "react";

const COLORS = [
	"#ef4444", // red
	"#f97316", // orange
	"#eab308", // yellow
	"#84cc16", // lime
	"#22c55e", // green
	"#10b981", // emerald
	"#14b8a6", // teal
	"#06b6d4", // cyan
	"#0ea5e9", // sky
	"#3b82f6", // blue
	"#6366f1", // indigo
	"#8b5cf6", // violet
	"#a855f7", // purple
	"#d946ef", // fuchsia
	"#ec4899", // pink
	"#f43f5e", // rose
];

function generateColorFromName(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return COLORS[Math.abs(hash) % COLORS.length];
}

function generateSessionId(): string {
	if (typeof window === "undefined") return "";
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function useLocalIdentity() {
	const [displayName, setDisplayName] = useState<string>("");
	const [authorColor, setAuthorColor] = useState<string>("#3b82f6");
	const [sessionId, setSessionId] = useState<string>("");

	useEffect(() => {
		const storedName = localStorage.getItem("qa_display_name");
		const storedColor = localStorage.getItem("qa_author_color");
		const storedSessionId = localStorage.getItem("qa_session_id");

		if (storedName) {
			setDisplayName(storedName);
			setAuthorColor(storedColor || generateColorFromName(storedName));
		} else {
			setAuthorColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
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
		const color = generateColorFromName(name);
		localStorage.setItem("qa_author_color", color);
		setDisplayName(name);
		setAuthorColor(color);
	};

	return {
		displayName,
		authorColor,
		sessionId,
		rememberName,
	};
}

