import { router } from "../init";
import { chatRouter } from "./chat";
import { healthRouter } from "./health";

export const appRouter = router({
  chat: chatRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
