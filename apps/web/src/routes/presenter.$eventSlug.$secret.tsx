import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle, ThumbsUp, Flag, MessageSquare, Clock, Loader2, AlertCircle } from "lucide-react";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { getInitials } from "@/lib/identity";
import { SlidontLogo } from "@/components/slidont-logo";
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

export const Route = createFileRoute("/presenter/$eventSlug/$secret")({
	component: PresenterPage,
});

function PresenterPage() {
	const { eventSlug, secret } = Route.useParams();
	const event = useQuery(api.events.getBySlug, { slug: eventSlug });
	const questions = useQuery(api.questions.listAll, { eventSlug });
	const markDone = useMutation(api.questions.markDone);
	const { t, language } = useLanguage();

	if (!event) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-black">
				<div className="text-center">
					<Loader2 className="h-16 w-16 mx-auto mb-8 animate-spin text-white" />
					<h1 className="text-8xl font-bold text-white mb-8">{t("loading")}</h1>
				</div>
			</div>
		);
	}

	if (event.presenterSecret !== secret) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-black">
				<div className="text-center">
					<AlertCircle className="h-16 w-16 mx-auto mb-8 text-red-500" />
					<h1 className="text-8xl font-bold text-white mb-8">{t("unauthorized")}</h1>
					<p className="text-4xl text-gray-400">{t("noAccess")}</p>
				</div>
			</div>
		);
	}

	const handleMarkDone = async (questionId: Id<"questions">) => {
		try {
			await markDone({ questionId, eventSlug, secret });
		} catch (error) {
			console.error("Failed to mark done:", error);
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

	// Filter out marked done questions
	const pendingQuestions = questions?.filter((q) => !q.hiddenByPresenter) || [];

	return (
		<div className="h-screen w-screen bg-black overflow-y-auto">
			<div className="min-h-screen px-16 py-12">
				{/* Header */}
				<div className="mb-16 text-center border-b border-gray-800 pb-8">
					<div className="flex items-center justify-center gap-6 mb-6">
						<SlidontLogo height={72} variant="dark" />
						<h1 className="text-7xl font-bold text-white">
							{event.title}
						</h1>
					</div>
					<div className="flex items-center justify-center gap-8 text-3xl text-gray-400">
						<span className="flex items-center gap-3">
							<Clock className="h-8 w-8" />
							{pendingQuestions.length} {t("pending")}
						</span>
					</div>
				</div>

				{/* Questions */}
				<div className="space-y-12 max-w-7xl mx-auto">
					{pendingQuestions.length === 0 ? (
						<div className="text-center py-32">
							<div className="flex justify-center mb-8 opacity-30">
								<SlidontLogo height={96} variant="dark" />
							</div>
							<p className="text-7xl font-medium text-gray-600">{t("noQuestionsYet")}</p>
							<p className="text-5xl text-gray-700 mt-8">{t("askAway")}</p>
						</div>
					) : (
						pendingQuestions.map((question) => (
							<div
								key={question._id}
								className="relative bg-white border border-gray-200 rounded-2xl p-12 hover:border-gray-300 transition-all duration-200"
							>
								<div className="flex justify-between items-start gap-8">
									<div className="flex-1 space-y-6">
										{/* Author info */}
										<div className="flex items-center gap-6">
											<div
												className="h-20 w-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
												style={{
													background: `linear-gradient(135deg, ${getGradientFromName(question.authorName).from}, ${getGradientFromName(question.authorName).to})`,
												}}
											>
												{question.isAnonymous ? "?" : getInitials(question.authorName)}
											</div>
											<div>
												<div className="text-4xl font-semibold text-black">
													{question.authorName}
												</div>
												<div className="text-2xl text-gray-500">
													{timeAgo(question.createdAt)}
												</div>
											</div>
										</div>

										{/* Question content */}
										<p className="text-5xl leading-relaxed text-black font-normal">
											{question.content}
										</p>

										{/* Stats */}
										<div className="flex items-center gap-8 text-3xl text-gray-600">
											<span className="flex items-center gap-3">
												<ThumbsUp className="h-8 w-8" />
												{question.voteCount}
											</span>
											<span className="flex items-center gap-3">
												<Flag className="h-8 w-8" />
												{question.flagCount}
											</span>
										</div>
									</div>

									{/* Mark Done Button */}
									<Button
										onClick={() => handleMarkDone(question._id)}
										className="h-24 px-12 text-3xl font-semibold bg-black hover:bg-gray-900 text-white rounded-xl transition-all gap-4 min-w-[200px]"
									>
										<CheckCircle className="h-10 w-10" />
										{t("done")}
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
