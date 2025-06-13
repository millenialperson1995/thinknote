import { Redis } from "@upstash/redis";
import pkg from '@upstash/ratelimit';
const { Ratelimit } = pkg;

import dotenv from "dotenv";

dotenv.config();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "60 s"),
});

export default ratelimit;