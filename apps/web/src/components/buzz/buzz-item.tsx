import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, Flag, User, Clock } from "lucide-react";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { toast } from "sonner";
import { getInitials } from "@/lib/identity";
import { useLanguage } from "@/components/language-provider";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { motion } from "framer-motion";

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

interface BuzzItemProps {
	buzz: {
		_id: Id<"buzz">;
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

export function BuzzItem({ buzz, sessionId, hasVoted, hasFlagged }: BuzzItemProps) {
	const [localVoted, setLocalVoted] = useState(hasVoted);
	const [localVoteCount, setLocalVoteCount] = useState(buzz.voteCount);
	const [localFlagged, setLocalFlagged] = useState(hasFlagged);
	const [isVoting, setIsVoting] = useState(false);
	const [isFlagging, setIsFlagging] = useState(false);
	const isVotingRef = useRef(false);
	const isFlaggingRef = useRef(false);
	const shouldAnimateRef = useRef(true);
	const toggleVote = useMutation(api.buzzVotes.toggle);
	const toggleFlag = useMutation(api.buzzFlags.toggle);
	const { t, language } = useLanguage();

	useEffect(() => {
		shouldAnimateRef.current = false;
	}, []);

	// Sync vote count from server (hasVoted props are hardcoded to false, so ignore them)
	useEffect(() => {
		if (!isVotingRef.current && !isVoting) {
			setLocalVoteCount(buzz.voteCount);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buzz.voteCount, isVoting]);

	const handleVote = async () => {
		if (isVotingRef.current) return; // Prevent double-clicks
		
		const optimisticVoted = !localVoted;
		const optimisticCount = optimisticVoted ? localVoteCount + 1 : localVoteCount - 1;
		
		isVotingRef.current = true;
		setIsVoting(true);
		setLocalVoted(optimisticVoted);
		setLocalVoteCount(optimisticCount);

		try {
			await toggleVote({ buzzId: buzz._id, sessionId });
			// Small delay to ensure server state has propagated
			setTimeout(() => {
				isVotingRef.current = false;
				setIsVoting(false);
			}, 100);
		} catch (error) {
			setLocalVoted(!optimisticVoted);
			setLocalVoteCount(buzz.voteCount);
			isVotingRef.current = false;
			setIsVoting(false);
			toast.error(t("failedToVote"));
		}
	};

	const handleFlag = async () => {
		if (isFlaggingRef.current) return; // Prevent double-clicks
		
		const optimisticFlagged = !localFlagged;
		isFlaggingRef.current = true;
		setIsFlagging(true);
		setLocalFlagged(optimisticFlagged);

		try {
			await toggleFlag({ buzzId: buzz._id, sessionId });
			// Small delay to ensure server state has propagated
			setTimeout(() => {
				isFlaggingRef.current = false;
				setIsFlagging(false);
			}, 100);
		} catch (error) {
			setLocalFlagged(!optimisticFlagged);
			isFlaggingRef.current = false;
			setIsFlagging(false);
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
		<motion.div
			initial={shouldAnimateRef.current ? { opacity: 0, y: 20 } : false}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="p-4 hover:shadow-lg transition-shadow">
				<div className="flex items-start gap-3">
					<div className="flex-1 space-y-2">
						<div className="flex items-center gap-2">
							<motion.div
								className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
								style={{
									background: `linear-gradient(135deg, ${getGradientFromName(buzz.authorName).from}, ${getGradientFromName(buzz.authorName).to})`,
								}}
								whileHover={{ scale: 1.1 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								{buzz.isAnonymous ? "?" : getInitials(buzz.authorName)}
							</motion.div>
							<span className="text-sm font-medium flex items-center gap-1">
								<User className="h-3 w-3" />
								{buzz.authorName}
							</span>
							<span className="text-xs text-muted-foreground flex items-center gap-1">
								<Clock className="h-3 w-3" />
								{timeAgo(buzz.createdAt)}
							</span>
						</div>
						<p className="text-sm">{buzz.content}</p>
					</div>
					<div className="flex items-center gap-2">
						<motion.div whileHover={{ scale: isVoting ? 1 : 1.05 }} whileTap={{ scale: isVoting ? 1 : 0.95 }}>
							<Button
								variant={localVoted ? "default" : "outline"}
								size="sm"
								onClick={handleVote}
								disabled={isVoting}
								className="gap-1"
							>
								<motion.div
									animate={isVoting ? { rotate: 360 } : {}}
									transition={{ duration: 0.5, repeat: isVoting ? Infinity : 0, ease: "linear" }}
								>
									<ThumbsUp className="h-4 w-4" />
								</motion.div>
								<SlidingNumber value={localVoteCount} />
							</Button>
						</motion.div>
						<motion.div whileHover={{ scale: isFlagging ? 1 : 1.05 }} whileTap={{ scale: isFlagging ? 1 : 0.95 }}>
							<Button
								variant={localFlagged ? "destructive" : "outline"}
								size="sm"
								onClick={handleFlag}
								disabled={isFlagging}
							>
								<motion.div
									animate={isFlagging ? { rotate: 360 } : {}}
									transition={{ duration: 0.5, repeat: isFlagging ? Infinity : 0, ease: "linear" }}
								>
									<Flag className="h-4 w-4" />
								</motion.div>
							</Button>
						</motion.div>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}

