import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Wifi, WifiOff, AlertCircle, Sparkles, Users, Rocket } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const healthCheck = useQuery(api.healthCheck.get);
	const { t } = useLanguage();

	return (
		<div className="container mx-auto max-w-4xl px-4 py-12">
			<div className="text-center mb-12">
				<div className="flex items-center justify-center gap-3 mb-4">
					<MessageSquare className="h-12 w-12 text-blue-600" />
					<h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						{t("appName")}
					</h1>
				</div>
				<p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
					<Sparkles className="h-5 w-5" />
					{t("realTimeQA")}
				</p>
			</div>

			<div className="grid gap-6 mb-8">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{healthCheck === "OK" ? (
								<Wifi className="h-5 w-5 text-green-500" />
							) : healthCheck === undefined ? (
								<WifiOff className="h-5 w-5 text-orange-400" />
							) : (
								<AlertCircle className="h-5 w-5 text-red-500" />
							)}
							<div>
								<h2 className="mb-2 font-semibold">{t("connectionStatus")}</h2>
								<div className="flex items-center gap-2">
									<div
										className={`h-2 w-2 rounded-full ${healthCheck === "OK" ? "bg-green-500" : healthCheck === undefined ? "bg-orange-400" : "bg-red-500"}`}
									/>
									<span className="text-sm text-muted-foreground">
										{healthCheck === undefined
											? t("checking")
											: healthCheck === "OK"
												? t("connected")
												: t("error")}
									</span>
								</div>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-8">
					<div className="flex items-center gap-3 mb-2">
						<Users className="h-6 w-6 text-blue-600" />
						<h2 className="text-2xl font-semibold">{t("cursorTokyoMeetup")}</h2>
					</div>
					<p className="mb-6 text-muted-foreground">
						{t("joinDescription")}
					</p>
					<Link to="/q/$eventSlug" params={{ eventSlug: "cursor-tokyo-meetup-ryo-qa" }}>
						<Button size="lg" className="w-full gap-2">
							<Rocket className="h-5 w-5" />
							{t("joinQASession")}
						</Button>
					</Link>
				</Card>
			</div>
		</div>
	);
}
