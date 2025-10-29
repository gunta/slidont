import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
	args: {
		buzzId: v.id("buzz"),
		sessionId: v.string(),
	},
	handler: async (ctx, { buzzId, sessionId }) => {
		const existingVote = await ctx.db
			.query("buzzVotes")
			.withIndex("by_buzz_session", (q) =>
				q.eq("buzzId", buzzId).eq("sessionId", sessionId),
			)
			.first();

		const buzz = await ctx.db.get(buzzId);
		if (!buzz) {
			throw new Error("Buzz not found");
		}

		if (existingVote) {
			await ctx.db.delete(existingVote._id);
			await ctx.db.patch(buzzId, {
				voteCount: buzz.voteCount - 1,
			});
			return { voted: false };
		} else {
			await ctx.db.insert("buzzVotes", {
				buzzId,
				sessionId,
				createdAt: Date.now(),
			});
			await ctx.db.patch(buzzId, {
				voteCount: buzz.voteCount + 1,
			});
			return { voted: true };
		}
	},
});

export const hasVoted = mutation({
	args: {
		buzzId: v.id("buzz"),
		sessionId: v.string(),
	},
	handler: async (ctx, { buzzId, sessionId }) => {
		const existingVote = await ctx.db
			.query("buzzVotes")
			.withIndex("by_buzz_session", (q) =>
				q.eq("buzzId", buzzId).eq("sessionId", sessionId),
			)
			.first();

		return !!existingVote;
	},
});

