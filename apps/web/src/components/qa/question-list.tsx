import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionItem } from "./question-item";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { Clock, TrendingUp, Loader2 } from "lucide-react";
import { SlidontLogo } from "@/components/slidont-logo";
import { useLanguage } from "@/components/language-provider";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionListProps {
	eventSlug: string;
	sessionId: string;
}

interface Question {
	_id: Id<"questions">;
	content: string;
	authorName: string;
	isAnonymous: boolean;
	authorColor: string;
	createdAt: number;
	voteCount: number;
	flagCount: number;
}

export function QuestionList({ eventSlug, sessionId }: QuestionListProps) {
	const [sortBy, setSortBy] = useState<"new" | "top">("new");
	const allQuestions = useQuery(api.questions.list, { eventSlug, sortBy: "new" });
	const wasNewModeRef = useRef(sortBy === "new");
	const { t } = useLanguage();

	// Sort questions in memory based on selected tab
	const sortedQuestions = useMemo(() => {
		if (!allQuestions) return null;

		if (sortBy === "new") {
			return [...allQuestions].sort((a, b) => b.createdAt - a.createdAt);
		} else {
			return [...allQuestions].sort((a, b) => {
				if (b.voteCount !== a.voteCount) {
					return b.voteCount - a.voteCount;
				}
				return b.createdAt - a.createdAt;
			});
		}
	}, [allQuestions, sortBy]);

	useEffect(() => {
		if (sortBy === "new" && wasNewModeRef.current && sortedQuestions && sortedQuestions.length > 0) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
		wasNewModeRef.current = sortBy === "new";
	}, [sortedQuestions, sortBy]);

	if (!sortedQuestions) {
		return (
			<div className="text-center py-8 text-muted-foreground flex items-center justify-center gap-2">
				<Loader2 className="h-5 w-5 animate-spin" />
				{t("checking")}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "new" | "top")}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="new" className="gap-2">
							<motion.div
								animate={{ rotate: [0, 360] }}
								transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
							>
								<Clock className="h-4 w-4" />
							</motion.div>
							{t("realtime")}
						</TabsTrigger>
						<TabsTrigger value="top" className="gap-2">
							<motion.div
								animate={{ y: [0, -3, 0] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								<TrendingUp className="h-4 w-4" />
							</motion.div>
							{t("top")}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</motion.div>

			<div className="space-y-3">
				{sortedQuestions.length === 0 ? (
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
						<p className="text-lg font-medium">{t("noQuestionsYet")}</p>
					</motion.div>
				) : (
					<AnimatePresence mode="popLayout">
						{sortedQuestions.map((question, index) => (
							<motion.div
								key={question._id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
							>
								<QuestionItem
									question={question}
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

