import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionItem } from "./question-item";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";

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
	const questions = useQuery(api.questions.list, { eventSlug, sortBy });
	const listRef = useRef<HTMLDivElement>(null);
	const wasNewModeRef = useRef(sortBy === "new");

	useEffect(() => {
		if (sortBy === "new" && wasNewModeRef.current && questions && questions.length > 0) {
			listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
		}
		wasNewModeRef.current = sortBy === "new";
	}, [questions, sortBy]);

	if (!questions) {
		return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
	}

	return (
		<div className="space-y-4">
			<Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "new" | "top")}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="new">Realtime</TabsTrigger>
					<TabsTrigger value="top">Top</TabsTrigger>
				</TabsList>
			</Tabs>

			<div ref={listRef} className="space-y-3 max-h-[600px] overflow-y-auto">
				{questions.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">
						<p className="text-lg font-medium">No questions yet</p>
						<p className="text-sm">Be the first to ask!</p>
					</div>
				) : (
					questions.map((question) => (
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

