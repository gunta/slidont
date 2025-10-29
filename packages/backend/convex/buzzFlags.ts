import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
	args: {
		buzzId: v.id("buzz"),
		sessionId: v.string(),
	},
	handler: async (ctx, { buzzId, sessionId }) => {
		const existingFlag = await ctx.db
			.query("buzzFlags")
			.withIndex("by_buzz_session", (q) =>
				q.eq("buzzId", buzzId).eq("sessionId", sessionId),
			)
			.first();

		const buzz = await ctx.db.get(buzzId);
		if (!buzz) {
			throw new Error("Buzz not found");
		}

		if (existingFlag) {
			await ctx.db.delete(existingFlag._id);
			const newFlagCount = buzz.flagCount - 1;
			await ctx.db.patch(buzzId, {
				flagCount: newFlagCount,
				hiddenByFlags: newFlagCount >= 3,
			});
			return { flagged: false };
		} else {
			await ctx.db.insert("buzzFlags", {
				buzzId,
				sessionId,
				createdAt: Date.now(),
			});
			const newFlagCount = buzz.flagCount + 1;
			await ctx.db.patch(buzzId, {
				flagCount: newFlagCount,
				hiddenByFlags: newFlagCount >= 3,
			});
			return { flagged: true };
		}
	},
});

export const hasFlagged = mutation({
	args: {
		buzzId: v.id("buzz"),
		sessionId: v.string(),
	},
	handler: async (ctx, { buzzId, sessionId }) => {
		const existingFlag = await ctx.db
			.query("buzzFlags")
			.withIndex("by_buzz_session", (q) =>
				q.eq("buzzId", buzzId).eq("sessionId", sessionId),
			)
			.first();

		return !!existingFlag;
	},
});

