import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import type { Id } from "@slidont/backend/convex/_generated/dataModel";

export const Route = createFileRoute("/presenter/$eventSlug/$secret")({
	component: PresenterPage,
});

function PresenterPage() {
	const { eventSlug, secret } = Route.useParams();
	const event = useQuery(api.events.getBySlug, { slug: eventSlug });
	const questions = useQuery(api.questions.listAll, { eventSlug });
	const markDone = useMutation(api.questions.markDone);

	if (!event) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Loading...</h1>
				</div>
			</div>
		);
	}

	if (event.presenterSecret !== secret) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
					<p className="text-muted-foreground">You don't have access to this presenter view.</p>
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
		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	};

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-2">{event.title}</h1>
					<p className="text-muted-foreground">Presenter Dashboard</p>
				</div>

				<div className="text-sm text-muted-foreground mb-4">
					{questions?.filter((q) => !q.hiddenByPresenter).length || 0} pending questions
				</div>

				<div className="space-y-3">
					{questions && questions.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							<p className="text-lg font-medium">No questions yet</p>
						</div>
					) : (
						questions?.map((question) => (
							<Card key={question._id} className="p-4">
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
											<span className="text-xs text-muted-foreground">
												{timeAgo(question.createdAt)}
											</span>
											{question.hiddenByFlags && (
												<span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
													Flagged
												</span>
											)}
											{question.hiddenByPresenter && (
												<span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1">
													<CheckCircle className="h-3 w-3" />
													Done
												</span>
											)}
										</div>
										<p className="text-sm">{question.content}</p>
										<div className="flex items-center gap-4 text-xs text-muted-foreground">
											<span>👍 {question.voteCount}</span>
											<span>🚩 {question.flagCount}</span>
										</div>
									</div>
									{!question.hiddenByPresenter && (
										<Button
											variant="default"
											size="sm"
											onClick={() => handleMarkDone(question._id)}
											className="gap-1"
										>
											<CheckCircle className="h-4 w-4" />
											Done
										</Button>
									)}
								</div>
							</Card>
						))
					)}
				</div>
			</div>
		</div>
	);
}
