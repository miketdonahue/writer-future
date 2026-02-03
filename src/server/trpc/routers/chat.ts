import { z } from "zod";
import { publicProcedure, router } from "../init";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";

export const chatRouter = router({
  getMessages: publicProcedure.query(async () => {
    return db.select().from(messages).orderBy(messages.createdAt);
  }),

  saveMessage: publicProcedure
    .input(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [msg] = await db.insert(messages).values(input).returning();
      return msg;
    }),

  clearMessages: publicProcedure.mutation(async () => {
    await db.delete(messages);
    return { success: true };
  }),
});
