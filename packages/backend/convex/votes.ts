import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
	args: {
		questionId: v.id("questions"),
		sessionId: v.string(),
	},
	handler: async (ctx, { questionId, sessionId }) => {
		const existingVote = await ctx.db
			.query("questionVotes")
			.withIndex("by_question_session", (q) =>
				q.eq("questionId", questionId).eq("sessionId", sessionId),
			)
			.first();

		const question = await ctx.db.get(questionId);
		if (!question) {
			throw new Error("Question not found");
		}

		if (existingVote) {
			await ctx.db.delete(existingVote._id);
			await ctx.db.patch(questionId, {
				voteCount: question.voteCount - 1,
			});
			return { voted: false };
		} else {
			await ctx.db.insert("questionVotes", {
				questionId,
				sessionId,
				createdAt: Date.now(),
			});
			await ctx.db.patch(questionId, {
				voteCount: question.voteCount + 1,
			});
			return { voted: true };
		}
	},
});

export const hasVoted = mutation({
	args: {
		questionId: v.id("questions"),
		sessionId: v.string(),
	},
	handler: async (ctx, { questionId, sessionId }) => {
		const existingVote = await ctx.db
			.query("questionVotes")
			.withIndex("by_question_session", (q) =>
				q.eq("questionId", questionId).eq("sessionId", sessionId),
			)
			.first();

		return !!existingVote;
	},
});

