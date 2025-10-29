import { Link, useRouterState } from "@tanstack/react-router";
import { Github, MessageSquare, Zap, HelpCircle, User, Edit2 } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import { useTab } from "./tab-provider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Header() {
	const { t, language } = useLanguage();
	const { activeTab, setActiveTab } = useTab();
	const location = useRouterState({
		select: (s) => s.location,
	});
	const [isEditingName, setIsEditingName] = useState(false);
	const [displayName, setDisplayName] = useState("");
	
	const isQAPage = location.pathname.startsWith("/q/");
	
	useEffect(() => {
		const storedName = localStorage.getItem("qa_display_name");
		if (storedName) {
			setDisplayName(storedName);
		}
	}, []);
	
	const handleNameSave = () => {
		if (!displayName.trim()) {
			toast.error(t("pleaseEnterName"));
			return;
		}
		const trimmedName = displayName.trim();
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
		
		setIsEditingName(false);
		toast.success(t("nameSaved"));
	};
	
	return (
		<div className="flex flex-row items-center justify-between px-4 py-3">
			<motion.div
				whileHover={{ scale: 1.05 }}
				transition={{ type: "spring", stiffness: 400 }}
			>
				<Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
					<motion.div
						animate={{ rotate: [0, 10, -10, 0] }}
						transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
					>
						<MessageSquare className="h-6 w-6 text-blue-600" />
					</motion.div>
					{t("appName")}
				</Link>
			</motion.div>
			<div className="flex items-center gap-4">
				{isQAPage && (
					<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "buzz" | "qa")}>
						<TabsList>
							<TabsTrigger value="buzz" className="gap-2">
								<motion.div
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{ duration: 2, repeat: Infinity }}
								>
									<Zap className="h-4 w-4" />
								</motion.div>
								{language === "ja" ? t("buzzJapanese") : t("buzz")}
							</TabsTrigger>
							<TabsTrigger value="qa" className="gap-2">
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
								>
									<HelpCircle className="h-4 w-4" />
								</motion.div>
								Q&A
							</TabsTrigger>
						</TabsList>
					</Tabs>
				)}
				{displayName && (
					<div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
						{isEditingName ? (
							<form onSubmit={(e) => { e.preventDefault(); handleNameSave(); }} className="flex items-center gap-2">
								<Input
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									className="h-7 w-32"
									autoFocus
									onBlur={handleNameSave}
								/>
							</form>
						) : (
							<>
								<User className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">{displayName}</span>
								<motion.button
									onClick={() => setIsEditingName(true)}
									className="text-muted-foreground hover:text-foreground transition-colors"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Edit2 className="h-3 w-3" />
								</motion.button>
							</>
						)}
					</div>
				)}
				<motion.a
					href="https://github.com/gunta/slidont"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center rounded-md hover:bg-accent h-9 w-9 transition-colors"
					aria-label={t("viewSourceCode")}
					whileHover={{ scale: 1.1, rotate: 10 }}
					whileTap={{ scale: 0.9 }}
				>
					<Github className="h-5 w-5" />
				</motion.a>
				<LanguageToggle />
				<ModeToggle />
			</div>
		</div>
	);
}
