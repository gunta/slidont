import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@slidont/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) {
			toast.error("Please enter a question");
			return;
		}

		if (!name.trim()) {
			toast.error("Please enter your name");
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
			toast.success("Question posted!");
		} catch (error) {
			toast.error("Failed to post question");
			console.error(error);
		}
	};

	return (
		<Card className="p-4">
			<form onSubmit={handleSubmit} className="space-y-4">
				<Textarea
					placeholder="Ask your question..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={3}
					className="resize-none"
				/>
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<Input
							placeholder="Your name"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								onNameChange(e.target.value);
							}}
						/>
					</div>
					<Button type="submit" disabled={!content.trim() || !name.trim()}>
						Submit
					</Button>
				</div>
			</form>
		</Card>
	);
}

