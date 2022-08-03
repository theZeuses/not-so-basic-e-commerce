import { redisConfig } from "@src/config";

export const redisForMSConfig = {
    ...redisConfig,
    db: 1
}