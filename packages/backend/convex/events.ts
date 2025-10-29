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

		if (existing) {
			return existing;
		}

		const presenterSecret = Math.random().toString(36).substring(2, 15);
		const eventId = await ctx.db.insert("events", {
			slug: "cursor-tokyo-meetup-ryo-qa",
			title: "Cursor Tokyo Meetup - Ryo's Q&A",
			presenterSecret,
			createdAt: Date.now(),
		});

		return await ctx.db.get(eventId);
	},
});

