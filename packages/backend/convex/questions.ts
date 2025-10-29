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

		const questions = await ctx.db
			.query("questions")
			.withIndex("by_event_created", (q) => q.eq("eventId", event._id))
			.collect();

		const visibleQuestions = questions.filter(
			(q) => !q.hiddenByFlags && !q.hiddenByPresenter,
		);

		if (sortBy === "new") {
			return visibleQuestions.sort((a, b) => b.createdAt - a.createdAt);
		} else {
			return visibleQuestions.sort((a, b) => {
				if (b.voteCount !== a.voteCount) {
					return b.voteCount - a.voteCount;
				}
				return b.createdAt - a.createdAt;
			});
		}
	},
});

export const listAll = query({
	args: {
		eventSlug: v.string(),
	},
	handler: async (ctx, { eventSlug }) => {
		const event = await ctx.db
			.query("events")
			.withIndex("by_slug", (q) => q.eq("slug", eventSlug))
			.first();

		if (!event) {
			return [];
		}

		const questions = await ctx.db
			.query("questions")
			.withIndex("by_event_created", (q) => q.eq("eventId", event._id))
			.collect();

		return questions.sort((a, b) => b.createdAt - a.createdAt);
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

		const questionId = await ctx.db.insert("questions", {
			eventId: event._id,
			content,
			authorName,
			isAnonymous,
			authorColor,
			createdAt: Date.now(),
			voteCount: 0,
			flagCount: 0,
			hiddenByFlags: false,
			hiddenByPresenter: false,
		});

		return await ctx.db.get(questionId);
	},
});

export const markDone = mutation({
	args: {
		questionId: v.id("questions"),
		eventSlug: v.string(),
		secret: v.string(),
	},
	handler: async (ctx, { questionId, eventSlug, secret }) => {
		const event = await ctx.db
			.query("events")
			.withIndex("by_slug", (q) => q.eq("slug", eventSlug))
			.first();

		if (!event || event.presenterSecret !== secret) {
			throw new Error("Unauthorized");
		}

		await ctx.db.patch(questionId, {
			hiddenByPresenter: true,
			doneAt: Date.now(),
		});

		return { success: true };
	},
});

