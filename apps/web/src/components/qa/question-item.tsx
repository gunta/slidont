import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, Flag } from "lucide-react";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { toast } from "sonner";

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
			toast.error("Failed to vote");
		}
	};

	const handleFlag = async () => {
		const optimisticFlagged = !localFlagged;
		setLocalFlagged(optimisticFlagged);

		try {
			await toggleFlag({ questionId: question._id, sessionId });
		} catch (error) {
			setLocalFlagged(!optimisticFlagged);
			toast.error("Failed to flag");
		}
	};

	const timeAgo = (timestamp: number) => {
		const seconds = Math.floor((Date.now() - timestamp) / 1000);
		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	};

	return (
		<Card className="p-4">
			<div className="flex items-start gap-3">
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<div
							className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
							style={{ backgroundColor: question.authorColor }}
						>
							{question.isAnonymous ? "?" : question.authorName.charAt(0).toUpperCase()}
						</div>
						<span className="text-sm font-medium">{question.authorName}</span>
						<span className="text-xs text-muted-foreground">{timeAgo(question.createdAt)}</span>
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

