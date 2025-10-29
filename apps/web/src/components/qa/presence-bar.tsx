import usePresence from "@convex-dev/presence/react";
import { api } from "@slidont/backend/convex/_generated/api";

interface PresenceBarProps {
	eventSlug: string;
	userName: string;
}

export function PresenceBar({ eventSlug, userName }: PresenceBarProps) {
	const presence = usePresence(api.presence, eventSlug, userName);

	if (!presence || presence.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
			<div className="flex -space-x-2">
				{presence.slice(0, 5).map((user, idx) => (
					<div
						key={idx}
						className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white"
					>
						{user.charAt(0).toUpperCase()}
					</div>
				))}
			</div>
			<span>{presence.length} present</span>
		</div>
	);
}

