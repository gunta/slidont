import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { useLocalIdentity } from "@/lib/identity";
import { QuestionComposer } from "@/components/qa/question-composer";
import { QuestionList } from "@/components/qa/question-list";
import { BuzzComposer } from "@/components/buzz/buzz-composer";
import { BuzzList } from "@/components/buzz/buzz-list";
// import { PresenceBar } from "@/components/qa/presence-bar";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { SlidontLogo } from "@/components/slidont-logo";
import { useLanguage } from "@/components/language-provider";
import { useTab } from "@/components/tab-provider";

export const Route = createFileRoute("/q/$eventSlug")({
	component: QAPage,
});

function QAPage() {
	const { eventSlug } = Route.useParams();
	const { displayName, authorColor, sessionId, rememberName } = useLocalIdentity();
	const ensureSeed = useMutation(api.events.ensureSeed);
	const event = useQuery(api.events.getBySlug, { slug: eventSlug });
	const { t } = useLanguage();
	const navigate = useNavigate();
	const { activeTab } = useTab();
	const [autoscroll, setAutoscroll] = useState(false);

	useEffect(() => {
		ensureSeed();
	}, [ensureSeed]);

	// Redirect to home if no name is set (only after event data is loaded and exists)
	useEffect(() => {
		if (event !== undefined && event !== null) {
			const storedName = localStorage.getItem("qa_display_name");
			if (!storedName) {
				navigate({ to: "/" });
			}
		}
	}, [event, navigate]);

	if (event === undefined) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-8">
				<div className="text-center">
					<Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
					<h1 className="text-2xl font-bold mb-4">{t("loading")}</h1>
					<p className="text-muted-foreground">{t("settingUpSession")}</p>
				</div>
			</div>
		);
	}

	if (event === null) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-8">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
					<h1 className="text-2xl font-bold mb-4">{t("eventNotFound")}</h1>
					<p className="text-muted-foreground">{t("eventDoesNotExist")}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8 pb-40">
			<div className="space-y-6">
				<div className="text-center">
					<div className="flex items-center justify-center gap-3 mb-2">
						<SlidontLogo height={36} />
						<h1 className="text-3xl font-bold">{event.title}</h1>
					</div>
				</div>

				{/* <PresenceBar eventSlug={eventSlug} userName={displayName || "Anonymous"} /> */}

			{/* Keep both tabs in memory for instant switching */}
			<div style={{ display: activeTab === "buzz" ? "block" : "none" }}>
				<BuzzList eventSlug={eventSlug} sessionId={sessionId} autoscroll={autoscroll} />
			</div>
			<div style={{ display: activeTab === "qa" ? "block" : "none" }}>
				<QuestionList eventSlug={eventSlug} sessionId={sessionId} />
			</div>
		</div>

		{/* Keep both composers in memory for instant switching */}
		<div style={{ display: activeTab === "buzz" ? "block" : "none" }}>
			<BuzzComposer
				eventSlug={eventSlug}
				displayName={displayName}
				authorColor={authorColor}
				sessionId={sessionId}
				onNameChange={rememberName}
				autoscroll={autoscroll}
				setAutoscroll={setAutoscroll}
			/>
		</div>
		<div style={{ display: activeTab === "qa" ? "block" : "none" }}>
			<QuestionComposer
				eventSlug={eventSlug}
				displayName={displayName}
				authorColor={authorColor}
				sessionId={sessionId}
				onNameChange={rememberName}
			/>
		</div>
		</div>
	);
}

