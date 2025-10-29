import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Wifi, WifiOff, AlertCircle, Users, Rocket, User } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { motion } from "framer-motion";
import { Sparkle } from "@/components/ui/sparkle";
import { useState, useEffect } from "react";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import meetupNames from "@/lib/meetup-names.json";
import { toast } from "sonner";
import { VelocityScroll } from "@/components/ui/scroll-velocity";
import { ColorBendsBackground } from "@/components/ui/color-bends-background";

// Format participant names for scrolling display (moved outside component to prevent re-computation)
const participantNames = meetupNames
	.map((person) => person.name || `${person.firstName} ${person.lastName}`.trim())
	.filter((name) => name.trim())
	.join(" • ");

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const healthCheck = useQuery(api.healthCheck.get);
	const { t } = useLanguage();
	const [userName, setUserName] = useState("");
	const [hasName, setHasName] = useState(false);

	useEffect(() => {
		const storedName = localStorage.getItem("qa_display_name");
		if (storedName) {
			setHasName(true);
			setUserName(storedName);
		}
	}, []);

	const handleNameSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userName.trim()) {
			toast.error(t("pleaseEnterName"));
			return;
		}
		const trimmedName = userName.trim();
		localStorage.setItem("qa_display_name", trimmedName);
		
		// Generate and store gradient for the name
		const GRADIENT_PAIRS = [
			{ from: "#ef4444", to: "#f97316" }, { from: "#f97316", to: "#eab308" },
			{ from: "#eab308", to: "#84cc16" }, { from: "#84cc16", to: "#22c55e" },
			{ from: "#22c55e", to: "#10b981" }, { from: "#10b981", to: "#14b8a6" },
			{ from: "#14b8a6", to: "#06b6d4" }, { from: "#06b6d4", to: "#0ea5e9" },
			{ from: "#0ea5e9", to: "#3b82f6" }, { from: "#3b82f6", to: "#6366f1" },
			{ from: "#6366f1", to: "#8b5cf6" }, { from: "#8b5cf6", to: "#a855f7" },
			{ from: "#a855f7", to: "#d946ef" }, { from: "#d946ef", to: "#ec4899" },
			{ from: "#ec4899", to: "#f43f5e" }, { from: "#f43f5e", to: "#ef4444" },
		];
		let hash = 0;
		for (let i = 0; i < trimmedName.length; i++) {
			hash = trimmedName.charCodeAt(i) + ((hash << 5) - hash);
		}
		const gradient = GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length];
		localStorage.setItem("qa_author_gradient", JSON.stringify(gradient));
		
	setHasName(true);
	toast.success(t("nameSaved"));
};

	return (
		<div className="relative">
			{/* Color Bends Background - Dark Mode Only */}
			<div className="absolute top-0 left-0 right-0 h-[400px] -z-10">
				<ColorBendsBackground />
			</div>

			<div className="container mx-auto max-w-4xl px-4 py-12">
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="flex items-center justify-center gap-3 mb-4">
						<motion.div
							animate={{ rotate: [0, 10, -10, 0] }}
							transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
						>
							<MessageSquare className="h-12 w-12 text-blue-600" />
						</motion.div>
						<h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{t("appName")}
						</h1>
					</div>
					<motion.p
						className="text-xl text-muted-foreground flex items-center justify-center gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<Sparkle size={20} />
						{t("realTimeQA")}
					</motion.p>
				</motion.div>

				{/* Scroll Velocity Participants Display */}
				<motion.div
					className="mb-12 py-8 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl overflow-hidden"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8 }}
				>
					<div className="space-y-4">
						<VelocityScroll
							text={participantNames}
							default_velocity={0.03}
							initialOffset={0}
							className="text-2xl md:text-3xl font-semibold text-gradient-to-r from-blue-600 to-purple-600"
						/>
						<VelocityScroll
							text={participantNames}
							default_velocity={-0.025}
							initialOffset={-50}
							className="text-2xl md:text-3xl font-semibold text-gradient-to-r from-purple-600 to-blue-600"
						/>
					</div>
				</motion.div>

				<div className="grid gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="p-6 hover:shadow-lg transition-shadow">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<motion.div
										animate={{ rotate: [0, 360] }}
										transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
									>
										{healthCheck === "OK" ? (
											<Wifi className="h-5 w-5 text-green-500" />
										) : healthCheck === undefined ? (
											<WifiOff className="h-5 w-5 text-orange-400" />
										) : (
											<AlertCircle className="h-5 w-5 text-red-500" />
										)}
									</motion.div>
									<div>
										<h2 className="mb-2 font-semibold">{t("connectionStatus")}</h2>
										<div className="flex items-center gap-2">
										{healthCheck === "OK" && (
											<motion.div
												className="h-2 w-2 rounded-full bg-green-500"
												animate={{
													scale: [1, 1.5, 1],
													opacity: [1, 0.5, 1],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											/>
										)}
										{healthCheck === undefined && (
											<motion.div
												className="h-2 w-2 rounded-full bg-orange-400"
												animate={{
													scale: [1, 1.5, 1],
													opacity: [1, 0.5, 1],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											/>
										)}
										{healthCheck !== "OK" && healthCheck !== undefined && (
											<div className="h-2 w-2 rounded-full bg-red-500" />
										)}
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
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Card className="p-8 hover:shadow-lg transition-shadow">
						<div className="flex items-center gap-3 mb-2">
							<motion.div
								whileHover={{ scale: 1.2, rotate: 10 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								{hasName ? (
									<Users className="h-6 w-6 text-blue-600" />
								) : (
									<User className="h-6 w-6 text-blue-600" />
								)}
							</motion.div>
							<h2 className="text-2xl font-semibold">
								{hasName ? t("cursorTokyoMeetup") : t("enterYourName")}
							</h2>
						</div>
						{hasName ? (
							<>
								<p className="mb-6 text-muted-foreground">
									{t("joinDescription")}
								</p>
								<div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
									<p className="text-sm text-muted-foreground">
										{t("currentName")}: <span className="font-semibold text-blue-600">{userName}</span>
									</p>
								</div>
								<Link to="/q/$eventSlug" params={{ eventSlug: "cursor-tokyo-meetup-ryo-qa" }}>
									<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
										<Button size="lg" className="w-full gap-2">
											<motion.div
												animate={{ y: [0, -5, 0] }}
												transition={{ duration: 1.5, repeat: Infinity }}
											>
												<Rocket className="h-5 w-5" />
											</motion.div>
											{t("joinQASession")}
										</Button>
									</motion.div>
								</Link>
							</>
						) : (
							<>
								<p className="mb-6 text-muted-foreground">
									{t("enterNameToJoin")}
								</p>
								<form onSubmit={handleNameSubmit} className="space-y-4">
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 }}
									>
										<div className="relative">
											<motion.div
												className="absolute left-3 top-1/2 -translate-y-1/2"
												animate={{ rotate: [0, 10, -10, 0] }}
												transition={{ duration: 2, repeat: Infinity }}
											>
												<User className="h-5 w-5 text-muted-foreground pointer-events-none" />
											</motion.div>
											<AutocompleteInput
												placeholder={t("enterYourNamePlaceholder")}
												value={userName}
												options={meetupNames}
												onValueChange={setUserName}
												className="pl-10 text-lg"
												autoFocus
											/>
										</div>
									</motion.div>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6 }}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button size="lg" type="submit" className="w-full gap-2" disabled={!userName.trim()}>
											<motion.div
												animate={{ y: [0, -5, 0] }}
												transition={{ duration: 1.5, repeat: Infinity }}
											>
												<Rocket className="h-5 w-5" />
											</motion.div>
											{t("continue")}
										</Button>
									</motion.div>
								</form>
							</>
						)}
					</Card>
				</motion.div>
			</div>
			</div>
		</div>
	);
}
