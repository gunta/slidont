import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle, ThumbsUp, Flag, MessageSquare, Clock, Loader2, AlertCircle } from "lucide-react";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";
import { getInitials } from "@/lib/identity";
import { SlidontLogo } from "@/components/slidont-logo";
import { useLanguage } from "@/components/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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

export const Route = createFileRoute("/p/$eventSlug/$secret")({
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
				<motion.div 
					className="text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					>
						<Loader2 className="h-16 w-16 mx-auto mb-8 text-white" />
					</motion.div>
					<h1 className="text-8xl font-bold text-white mb-8">{t("loading")}</h1>
				</motion.div>
			</div>
		);
	}

	if (event.presenterSecret !== secret) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-black">
				<motion.div 
					className="text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						<AlertCircle className="h-16 w-16 mx-auto mb-8 text-red-500" />
					</motion.div>
					<h1 className="text-8xl font-bold text-white mb-8">{t("unauthorized")}</h1>
					<p className="text-4xl text-gray-400">{t("noAccess")}</p>
				</motion.div>
			</div>
		);
	}

	const handleMarkDone = async (questionId: Id<"questions">) => {
		try {
			// Trigger confetti animation
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
			});
			
			// Additional burst after delay
			setTimeout(() => {
				confetti({
					particleCount: 50,
					angle: 60,
					spread: 55,
					origin: { x: 0 },
					colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
				});
			}, 200);
			
			setTimeout(() => {
				confetti({
					particleCount: 50,
					angle: 120,
					spread: 55,
					origin: { x: 1 },
					colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
				});
			}, 400);

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
				<motion.div 
					className="mb-16 text-center border-b border-gray-800 pb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="flex items-center justify-center gap-6 mb-6">
						<motion.div
							animate={{ rotate: [0, 5, -5, 0] }}
							transition={{ duration: 3, repeat: Infinity }}
						>
							<SlidontLogo height={72} variant="dark" />
						</motion.div>
						<h1 className="text-7xl font-bold text-white">
							{event.title}
						</h1>
					</div>
					<motion.div 
						className="flex items-center justify-center gap-8 text-3xl text-gray-400"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<span className="flex items-center gap-3">
							<motion.div
								animate={{ rotate: [0, 360] }}
								transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
							>
								<Clock className="h-8 w-8" />
							</motion.div>
							{pendingQuestions.length} {t("pending")}
						</span>
					</motion.div>
				</motion.div>

				{/* Questions */}
				<div className="space-y-12 max-w-7xl mx-auto">
					{pendingQuestions.length === 0 ? (
						<motion.div 
							className="text-center py-32"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<div className="flex justify-center mb-8 opacity-30">
								<motion.div
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{ duration: 3, repeat: Infinity }}
								>
									<SlidontLogo height={96} variant="dark" />
								</motion.div>
							</div>
							<p className="text-7xl font-medium text-gray-600">{t("noQuestionsYet")}</p>
							<p className="text-5xl text-gray-700 mt-8">{t("askAway")}</p>
						</motion.div>
					) : (
						<AnimatePresence mode="popLayout">
							{pendingQuestions.map((question, index) => (
								<motion.div
									key={question._id}
									layout
									initial={{ opacity: 0, y: 50, scale: 0.9 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ 
										opacity: 0, 
										scale: 0.8, 
										y: -30,
										transition: {
											duration: 0.4,
											ease: [0.4, 0, 0.2, 1]
										}
									}}
									transition={{ 
										layout: {
											duration: 0.5,
											ease: [0.4, 0, 0.2, 1]
										},
										duration: 0.5,
										delay: index * 0.1,
										type: "spring",
										stiffness: 100,
										damping: 15
									}}
									className="relative bg-white border border-gray-200 rounded-2xl p-12 hover:border-gray-300 transition-all duration-200"
								>
									<div className="flex justify-between items-start gap-8">
										<div className="flex-1 space-y-6">
											{/* Author info */}
											<div className="flex items-center gap-6">
												<motion.div
													className="h-20 w-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
													style={{
														background: `linear-gradient(135deg, ${getGradientFromName(question.authorName).from}, ${getGradientFromName(question.authorName).to})`,
													}}
													whileHover={{ scale: 1.1, rotate: 5 }}
													transition={{ type: "spring", stiffness: 400 }}
												>
													{question.isAnonymous ? "?" : getInitials(question.authorName)}
												</motion.div>
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
												<motion.span 
													className="flex items-center gap-3"
													whileHover={{ scale: 1.1 }}
												>
													<ThumbsUp className="h-8 w-8" />
													{question.voteCount}
												</motion.span>
												<motion.span 
													className="flex items-center gap-3"
													whileHover={{ scale: 1.1 }}
												>
													<Flag className="h-8 w-8" />
													{question.flagCount}
												</motion.span>
											</div>
										</div>

										{/* Mark Done Button */}
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												onClick={() => handleMarkDone(question._id)}
												className="h-24 px-12 text-3xl font-semibold bg-black hover:bg-gray-900 text-white rounded-xl transition-all gap-4 min-w-[200px]"
											>
												<motion.div
													animate={{ rotate: [0, 10, -10, 0] }}
													transition={{ duration: 2, repeat: Infinity }}
												>
													<CheckCircle className="h-10 w-10" />
												</motion.div>
												{t("done")}
											</Button>
										</motion.div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					)}
				</div>
			</div>
		</div>
	);
}

