import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
	args: {
		questionId: v.id("questions"),
		sessionId: v.string(),
	},
	handler: async (ctx, { questionId, sessionId }) => {
		const existingFlag = await ctx.db
			.query("questionFlags")
			.withIndex("by_question_session", (q) =>
				q.eq("questionId", questionId).eq("sessionId", sessionId),
			)
			.first();

		const question = await ctx.db.get(questionId);
		if (!question) {
			throw new Error("Question not found");
		}

		if (existingFlag) {
			await ctx.db.delete(existingFlag._id);
			const newFlagCount = question.flagCount - 1;
			await ctx.db.patch(questionId, {
				flagCount: newFlagCount,
				hiddenByFlags: newFlagCount >= 3,
			});
			return { flagged: false };
		} else {
			await ctx.db.insert("questionFlags", {
				questionId,
				sessionId,
				createdAt: Date.now(),
			});
			const newFlagCount = question.flagCount + 1;
			await ctx.db.patch(questionId, {
				flagCount: newFlagCount,
				hiddenByFlags: newFlagCount >= 3,
			});
			return { flagged: true };
		}
	},
});

export const hasFlagged = mutation({
	args: {
		questionId: v.id("questions"),
		sessionId: v.string(),
	},
	handler: async (ctx, { questionId, sessionId }) => {
		const existingFlag = await ctx.db
			.query("questionFlags")
			.withIndex("by_question_session", (q) =>
				q.eq("questionId", questionId).eq("sessionId", sessionId),
			)
			.first();

		return !!existingFlag;
	},
});

