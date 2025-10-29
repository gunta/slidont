import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	events: defineTable({
		slug: v.string(),
		title: v.string(),
		presenterSecret: v.string(),
		createdAt: v.number(),
	}).index("by_slug", ["slug"]),
	questions: defineTable({
		eventId: v.id("events"),
		content: v.string(),
		authorName: v.string(),
		isAnonymous: v.boolean(),
		authorColor: v.string(),
		createdAt: v.number(),
		voteCount: v.number(),
		flagCount: v.number(),
		hiddenByFlags: v.boolean(),
		hiddenByPresenter: v.boolean(),
		doneAt: v.optional(v.number()),
	})
		.index("by_event_created", ["eventId", "createdAt"])
		.index("by_event_votes", ["eventId", "voteCount"]),
	questionVotes: defineTable({
		questionId: v.id("questions"),
		sessionId: v.string(),
		createdAt: v.number(),
	}).index("by_question_session", ["questionId", "sessionId"]),
	questionFlags: defineTable({
		questionId: v.id("questions"),
		sessionId: v.string(),
		createdAt: v.number(),
	}).index("by_question_session", ["questionId", "sessionId"]),
	buzz: defineTable({
		eventId: v.id("events"),
		content: v.string(),
		authorName: v.string(),
		isAnonymous: v.boolean(),
		authorColor: v.string(),
		createdAt: v.number(),
		voteCount: v.number(),
		flagCount: v.number(),
		hiddenByFlags: v.boolean(),
	})
		.index("by_event_created", ["eventId", "createdAt"])
		.index("by_event_votes", ["eventId", "voteCount"]),
	buzzVotes: defineTable({
		buzzId: v.id("buzz"),
		sessionId: v.string(),
		createdAt: v.number(),
	}).index("by_buzz_session", ["buzzId", "sessionId"]),
	buzzFlags: defineTable({
		buzzId: v.id("buzz"),
		sessionId: v.string(),
		createdAt: v.number(),
	}).index("by_buzz_session", ["buzzId", "sessionId"]),
});
