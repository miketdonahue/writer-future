import { z } from "zod";
import { publicProcedure, router } from "../init";

export const healthRouter = router({
  ping: publicProcedure.query(() => {
    return {
      message: "pong",
      timestamp: new Date(),
    };
  }),
});
