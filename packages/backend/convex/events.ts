import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		return await ctx.db
			.query("events")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.first();
	},
});

export const ensureSeed = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db
			.query("events")
			.withIndex("by_slug", (q) => q.eq("slug", "cursor-tokyo-meetup-ryo-qa"))
			.first();

		const presenterSecret = "12345"; // Hardcoded for now

		if (existing) {
			// Update the existing event's secret
			await ctx.db.patch(existing._id, { presenterSecret });
			return await ctx.db.get(existing._id);
		}

		const eventId = await ctx.db.insert("events", {
			slug: "cursor-tokyo-meetup-ryo-qa",
			title: "Cursor Tokyo Meetup - Ryo's Q&A",
			presenterSecret,
			createdAt: Date.now(),
		});

		return await ctx.db.get(eventId);
	},
});

