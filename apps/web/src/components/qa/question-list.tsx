import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionItem } from "./question-item";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { Clock, TrendingUp, Loader2 } from "lucide-react";
import { SlidontLogo } from "@/components/slidont-logo";
import { useLanguage } from "@/components/language-provider";

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
			<Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "new" | "top")}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="new" className="gap-2">
						<Clock className="h-4 w-4" />
						{t("realtime")}
					</TabsTrigger>
					<TabsTrigger value="top" className="gap-2">
						<TrendingUp className="h-4 w-4" />
						{t("top")}
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className="space-y-3">
				{sortedQuestions.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">
						<div className="flex justify-center mb-4 opacity-30">
							<SlidontLogo height={48} />
						</div>
						<p className="text-lg font-medium">{t("noQuestionsYet")}</p>
					</div>
				) : (
					sortedQuestions.map((question) => (
						<QuestionItem
							key={question._id}
							question={question}
							sessionId={sessionId}
							hasVoted={false}
							hasFlagged={false}
						/>
					))
				)}
			</div>
		</div>
	);
}

