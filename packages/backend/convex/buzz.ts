import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	args: {
		eventSlug: v.string(),
		sortBy: v.union(v.literal("new"), v.literal("top")),
	},
	handler: async (ctx, { eventSlug, sortBy }) => {
		const event = await ctx.db
			.query("events")
			.withIndex("by_slug", (q) => q.eq("slug", eventSlug))
			.first();

		if (!event) {
			return [];
		}

		const buzzItems = await ctx.db
			.query("buzz")
			.withIndex("by_event_created", (q) => q.eq("eventId", event._id))
			.collect();

		const visibleBuzz = buzzItems.filter((b) => !b.hiddenByFlags);

		if (sortBy === "new") {
			return visibleBuzz.sort((a, b) => b.createdAt - a.createdAt);
		} else {
			return visibleBuzz.sort((a, b) => {
				if (b.voteCount !== a.voteCount) {
					return b.voteCount - a.voteCount;
				}
				return b.createdAt - a.createdAt;
			});
		}
	},
});

export const create = mutation({
	args: {
		eventSlug: v.string(),
		content: v.string(),
		authorName: v.string(),
		isAnonymous: v.boolean(),
		authorColor: v.string(),
		sessionId: v.string(),
	},
	handler: async (ctx, { eventSlug, content, authorName, isAnonymous, authorColor, sessionId }) => {
		const event = await ctx.db
			.query("events")
			.withIndex("by_slug", (q) => q.eq("slug", eventSlug))
			.first();

		if (!event) {
			throw new Error("Event not found");
		}

		const buzzId = await ctx.db.insert("buzz", {
			eventId: event._id,
			content,
			authorName,
			isAnonymous,
			authorColor,
			createdAt: Date.now(),
			voteCount: 0,
			flagCount: 0,
			hiddenByFlags: false,
		});

		return await ctx.db.get(buzzId);
	},
});

