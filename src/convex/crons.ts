import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// check expired calls every minute
crons.interval(
  "update expired calls status",
  { minutes: 1 },
  internal.calls.handleExpiredCalls
);

// automatically end calls that have been ongoing for more than 2 hours
crons.interval(
  "end long running calls",
  { minutes: 5 }, // check every 5 minutes
  internal.calls.handleLongRunningCalls
);

export default crons;
