import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// check expired calls every minute
crons.interval(
  "update expired calls status",
  { minutes: 1 },
  internal.calls.handleExpiredCalls
);

export default crons;
