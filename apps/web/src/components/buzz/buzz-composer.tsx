import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, ArrowDown } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { motion } from "framer-motion";

interface BuzzComposerProps {
	eventSlug: string;
	displayName: string;
	authorColor: string;
	sessionId: string;
	onNameChange: (name: string) => void;
	autoscroll: boolean;
	setAutoscroll: (value: boolean) => void;
}

export function BuzzComposer({
	eventSlug,
	displayName,
	authorColor,
	sessionId,
	onNameChange,
	autoscroll,
	setAutoscroll,
}: BuzzComposerProps) {
	const [content, setContent] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const createBuzz = useMutation(api.buzz.create);
	const { t } = useLanguage();
	
	// Detect platform for keyboard shortcut display
	const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
	const shortcutKey = isMac ? "⌘" : "Ctrl";

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}
		if (!content.trim()) {
			toast.error(t("pleaseEnterComment"));
			return;
		}

		if (!displayName.trim()) {
			toast.error(t("pleaseEnterName"));
			return;
		}

		try {
			await createBuzz({
				eventSlug,
				content: content.trim(),
				authorName: displayName.trim(),
				isAnonymous: false,
				authorColor,
				sessionId,
			});
			setContent("");
			toast.success(t("commentPosted"));
		} catch (error) {
			toast.error(t("failedToPostComment"));
			console.error(error);
		}
	};

	// Handle CMD+Enter keyboard shortcut
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				e.preventDefault();
				// Submit logic inline to avoid dependency issues
				if (!content.trim()) {
					toast.error(t("pleaseEnterComment"));
					return;
				}
				if (!displayName.trim()) {
					toast.error(t("pleaseEnterName"));
					return;
				}
				createBuzz({
					eventSlug,
					content: content.trim(),
					authorName: displayName.trim(),
					isAnonymous: false,
					authorColor,
					sessionId,
				}).then(() => {
					setContent("");
					toast.success(t("commentPosted"));
				}).catch((error) => {
					toast.error(t("failedToPostComment"));
					console.error(error);
				});
			}
		};

		const textarea = textareaRef.current;
		if (textarea) {
			textarea.addEventListener("keydown", handleKeyDown);
			return () => {
				textarea.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [content, displayName, eventSlug, authorColor, sessionId, createBuzz, t]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t"
		>
			<div className="container mx-auto max-w-3xl px-4 py-4">
				<Card className="p-4 shadow-lg">
					<form onSubmit={handleSubmit} className="space-y-3">
						<div className="flex items-end gap-3">
							<div className="flex-1 relative">
								<Textarea
									ref={textareaRef}
									placeholder={t("yourComment")}
									value={content}
									onChange={(e) => setContent(e.target.value)}
									rows={2}
									className="resize-none pr-16"
								/>
								<span className="absolute bottom-2 right-3 text-xs text-muted-foreground hidden sm:block">
									{shortcutKey}+↵
								</span>
							</div>
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Button type="submit" disabled={!content.trim()} className="gap-2 h-10">
									<motion.div
										animate={{ x: [0, 2, 0] }}
										transition={{ duration: 1, repeat: Infinity }}
									>
										<Send className="h-4 w-4" />
									</motion.div>
									<span className="hidden sm:inline">{t("submit")}</span>
								</Button>
							</motion.div>
						</div>
						<div className="flex justify-end">
							<div className="flex items-center gap-2">
								<Checkbox
									id="autoscroll"
									checked={autoscroll}
									onCheckedChange={(checked) => setAutoscroll(checked === true)}
								/>
								<Label
									htmlFor="autoscroll"
									className="flex items-center gap-1 cursor-pointer text-sm"
								>
									<motion.div
										animate={autoscroll ? { y: [0, -2, 0] } : {}}
										transition={{ duration: 1.5, repeat: autoscroll ? Infinity : 0 }}
									>
										<ArrowDown className="h-3 w-3" />
									</motion.div>
									<span className="hidden sm:inline">{t("autoscroll")}</span>
								</Label>
							</div>
						</div>
					</form>
				</Card>
			</div>
		</motion.div>
	);
}

