import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, Flag, User, Clock } from "lucide-react";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { toast } from "sonner";
import { getInitials } from "@/lib/identity";
import { useLanguage } from "@/components/language-provider";

const GRADIENT_PAIRS = [
	{ from: "#ef4444", to: "#f97316" },
	{ from: "#f97316", to: "#eab308" },
	{ from: "#eab308", to: "#84cc16" },
	{ from: "#84cc16", to: "#22c55e" },
	{ from: "#22c55e", to: "#10b981" },
	{ from: "#10b981", to: "#14b8a6" },
	{ from: "#14b8a6", to: "#06b6d4" },
	{ from: "#06b6d4", to: "#0ea5e9" },
	{ from: "#0ea5e9", to: "#3b82f6" },
	{ from: "#3b82f6", to: "#6366f1" },
	{ from: "#6366f1", to: "#8b5cf6" },
	{ from: "#8b5cf6", to: "#a855f7" },
	{ from: "#a855f7", to: "#d946ef" },
	{ from: "#d946ef", to: "#ec4899" },
	{ from: "#ec4899", to: "#f43f5e" },
	{ from: "#f43f5e", to: "#ef4444" },
];

function getGradientFromName(name: string): { from: string; to: string } {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length];
}

interface QuestionItemProps {
	question: {
		_id: Id<"questions">;
		content: string;
		authorName: string;
		isAnonymous: boolean;
		authorColor: string;
		createdAt: number;
		voteCount: number;
		flagCount: number;
	};
	sessionId: string;
	hasVoted: boolean;
	hasFlagged: boolean;
}

export function QuestionItem({ question, sessionId, hasVoted, hasFlagged }: QuestionItemProps) {
	const [localVoted, setLocalVoted] = useState(hasVoted);
	const [localVoteCount, setLocalVoteCount] = useState(question.voteCount);
	const [localFlagged, setLocalFlagged] = useState(hasFlagged);
	const toggleVote = useMutation(api.votes.toggle);
	const toggleFlag = useMutation(api.flags.toggle);
	const { t, language } = useLanguage();

	useEffect(() => {
		setLocalVoted(hasVoted);
		setLocalVoteCount(question.voteCount);
		setLocalFlagged(hasFlagged);
	}, [hasVoted, question.voteCount, hasFlagged]);

	const handleVote = async () => {
		const optimisticVoted = !localVoted;
		const optimisticCount = optimisticVoted ? localVoteCount + 1 : localVoteCount - 1;
		setLocalVoted(optimisticVoted);
		setLocalVoteCount(optimisticCount);

		try {
			await toggleVote({ questionId: question._id, sessionId });
		} catch (error) {
			setLocalVoted(!optimisticVoted);
			setLocalVoteCount(question.voteCount);
			toast.error(t("failedToVote"));
		}
	};

	const handleFlag = async () => {
		const optimisticFlagged = !localFlagged;
		setLocalFlagged(optimisticFlagged);

		try {
			await toggleFlag({ questionId: question._id, sessionId });
		} catch (error) {
			setLocalFlagged(!optimisticFlagged);
			toast.error(t("failedToFlag"));
		}
	};

	const timeAgo = (timestamp: number) => {
		const seconds = Math.floor((Date.now() - timestamp) / 1000);
		if (seconds < 60) return language === "ja" ? "たった今" : "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return language === "ja" ? `${minutes}分前` : `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return language === "ja" ? `${hours}時間前` : `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return language === "ja" ? `${days}日前` : `${days}d ago`;
	};

	return (
		<Card className="p-4">
			<div className="flex items-start gap-3">
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<div
							className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
							style={{
								background: `linear-gradient(135deg, ${getGradientFromName(question.authorName).from}, ${getGradientFromName(question.authorName).to})`,
							}}
						>
							{question.isAnonymous ? "?" : getInitials(question.authorName)}
						</div>
						<span className="text-sm font-medium flex items-center gap-1">
							<User className="h-3 w-3" />
							{question.authorName}
						</span>
						<span className="text-xs text-muted-foreground flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{timeAgo(question.createdAt)}
						</span>
					</div>
					<p className="text-sm">{question.content}</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={localVoted ? "default" : "outline"}
						size="sm"
						onClick={handleVote}
						className="gap-1"
					>
						<ThumbsUp className="h-4 w-4" />
						{localVoteCount}
					</Button>
					<Button
						variant={localFlagged ? "destructive" : "outline"}
						size="sm"
						onClick={handleFlag}
					>
						<Flag className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</Card>
	);
}

