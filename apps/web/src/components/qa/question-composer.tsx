import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import meetupNames from "@/lib/meetup-names.json";
import { Send, User } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { motion } from "framer-motion";

interface QuestionComposerProps {
	eventSlug: string;
	displayName: string;
	authorColor: string;
	sessionId: string;
	onNameChange: (name: string) => void;
}

export function QuestionComposer({
	eventSlug,
	displayName,
	authorColor,
	sessionId,
	onNameChange,
}: QuestionComposerProps) {
	const [content, setContent] = useState("");
	const [name, setName] = useState(displayName);
	const createQuestion = useMutation(api.questions.create);
	const { t } = useLanguage();

	// Sync local state with displayName prop
	useEffect(() => {
		setName(displayName);
	}, [displayName]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) {
			toast.error(t("pleaseEnterQuestion"));
			return;
		}

		if (!name.trim()) {
			toast.error(t("pleaseEnterName"));
			return;
		}

		try {
			await createQuestion({
				eventSlug,
				content: content.trim(),
				authorName: name.trim(),
				isAnonymous: false,
				authorColor,
				sessionId,
			});
			setContent("");
			toast.success(t("questionPosted"));
		} catch (error) {
			toast.error(t("failedToPost"));
			console.error(error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="p-4 hover:shadow-lg transition-shadow">
				<div className="flex items-center gap-2 mb-4">
					<motion.h3
						className="font-semibold"
						animate={{ x: [0, 2, 0] }}
						transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
					>
						{t("askAQuestion")}
					</motion.h3>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Textarea
						placeholder={t("yourQuestion")}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={3}
						className="resize-none"
					/>
					<div className="flex items-center gap-4">
						<div className="flex-1 relative">
							<motion.div
								className="absolute left-3 top-1/2 -translate-y-1/2"
								animate={{ rotate: [0, 10, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
							>
								<User className="h-4 w-4 text-muted-foreground pointer-events-none" />
							</motion.div>
							<AutocompleteInput
								placeholder={t("askingAs")}
								value={name}
								options={meetupNames}
								onValueChange={(value) => {
									setName(value);
									onNameChange(value);
								}}
								className="pl-9"
							/>
						</div>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button type="submit" disabled={!content.trim() || !name.trim()} className="gap-2">
								<motion.div
									animate={{ x: [0, 2, 0] }}
									transition={{ duration: 1, repeat: Infinity }}
								>
									<Send className="h-4 w-4" />
								</motion.div>
								{t("submit")}
							</Button>
						</motion.div>
					</div>
				</form>
			</Card>
		</motion.div>
	);
}

