import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { BuzzItem } from "./buzz-item";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { SlidontLogo } from "@/components/slidont-logo";
import { useLanguage } from "@/components/language-provider";
import { motion, AnimatePresence } from "framer-motion";

interface BuzzListProps {
	eventSlug: string;
	sessionId: string;
	autoscroll: boolean;
}

interface Buzz {
	_id: Id<"buzz">;
	content: string;
	authorName: string;
	isAnonymous: boolean;
	authorColor: string;
	createdAt: number;
	voteCount: number;
	flagCount: number;
}

export function BuzzList({ eventSlug, sessionId, autoscroll }: BuzzListProps) {
	const allBuzz = useQuery(api.buzz.list, { eventSlug, sortBy: "new" });
	const { t } = useLanguage();
	const previousBuzzIdsRef = useRef<Set<string>>(new Set());

	// Sort buzz in memory - oldest first so newest messages appear at bottom
	const sortedBuzz = useMemo(() => {
		if (!allBuzz) return null;
		return [...allBuzz].sort((a, b) => a.createdAt - b.createdAt);
	}, [allBuzz]);

	// Auto-scroll to bottom when new buzz arrives (only if autoscroll is enabled)
	// Newest messages appear at the bottom, so we scroll down to see them
	useEffect(() => {
		if (!sortedBuzz || sortedBuzz.length === 0) return;
		
		const currentIds = new Set(sortedBuzz.map(b => b._id));
		const hasNewMessages = sortedBuzz.some(b => !previousBuzzIdsRef.current.has(b._id));
		
		if (autoscroll && (hasNewMessages || previousBuzzIdsRef.current.size === 0)) {
			// Scroll down smoothly to show new messages
			setTimeout(() => {
				// Find the scrollable container div (the overflow-auto container from root)
				const scrollContainer = document.querySelector('.overflow-auto');
				if (scrollContainer) {
					scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
				} else {
					// Fallback to window scroll
					window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
				}
			}, 150);
		}
		
		previousBuzzIdsRef.current = currentIds;
	}, [sortedBuzz, autoscroll]);

	// Immediately scroll to bottom when user enables autoscroll
	useEffect(() => {
		if (autoscroll && sortedBuzz && sortedBuzz.length > 0) {
			setTimeout(() => {
				// Find the scrollable container div (the overflow-auto container from root)
				const scrollContainer = document.querySelector('.overflow-auto');
				if (scrollContainer) {
					scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
				} else {
					// Fallback to window scroll
					window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
				}
			}, 150);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoscroll]);

	if (!sortedBuzz) {
		return (
			<div className="text-center py-8 text-muted-foreground flex items-center justify-center gap-2">
				<Loader2 className="h-5 w-5 animate-spin" />
				{t("checking")}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				{sortedBuzz.length === 0 ? (
					<motion.div
						className="text-center py-12 text-muted-foreground"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex justify-center mb-4 opacity-30">
							<motion.div
								animate={{ rotate: [0, 5, -5, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
							>
								<SlidontLogo height={48} />
							</motion.div>
						</div>
						<p className="text-lg font-medium">{t("noCommentsYet")}</p>
					</motion.div>
				) : (
					<AnimatePresence mode="popLayout">
						{sortedBuzz.map((buzz, index) => (
							<motion.div
								key={buzz._id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
							>
								<BuzzItem
									buzz={buzz}
									sessionId={sessionId}
									hasVoted={false}
									hasFlagged={false}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}

