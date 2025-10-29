import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { useLocalIdentity } from "@/lib/identity";
import { QuestionComposer } from "@/components/qa/question-composer";
import { QuestionList } from "@/components/qa/question-list";
import { PresenceBar } from "@/components/qa/presence-bar";
import { useEffect } from "react";

export const Route = createFileRoute("/q/$eventSlug")({
	component: QAPage,
});

function QAPage() {
	const { eventSlug } = Route.useParams();
	const { displayName, authorColor, sessionId, rememberName } = useLocalIdentity();
	const ensureSeed = useMutation(api.events.ensureSeed);
	const event = useQuery(api.events.getBySlug, { slug: eventSlug });

	useEffect(() => {
		ensureSeed();
	}, [ensureSeed]);

	if (!event) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Event not found</h1>
					<p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-2">{event.title}</h1>
					<p className="text-muted-foreground">Ask your questions below</p>
				</div>

				<PresenceBar eventSlug={eventSlug} userName={displayName || "Anonymous"} />

				<QuestionComposer
					eventSlug={eventSlug}
					displayName={displayName}
					authorColor={authorColor}
					sessionId={sessionId}
					onNameChange={rememberName}
				/>

				<QuestionList eventSlug={eventSlug} sessionId={sessionId} />
			</div>
		</div>
	);
}

