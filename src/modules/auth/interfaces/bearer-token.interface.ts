import { Role } from "@common/enums";

export interface BearerToken {
    user_id: number | string,
    roles: string[]
}