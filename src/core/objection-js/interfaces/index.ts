import { Op } from "../Operations";

export type IWhereArr = [
    op: StringValueOf<Op>,
    value: any
];

export type IWhere = {
    [index: string] : string | number | { [index: string]: string | number } | IWhereArr | IWhere | null | undefined,
    [Op.orWhere]? : IWhere | null,
    [Op.andWhere]? : IWhere | null,
}

export interface IOrder {
    orderBy: string
    order: 'asc' | 'desc' | null
}

export interface IRelationshipFilter {
    relationship: string,
    attributes?: string[],
    condition?: {
        where?: null | IWhere,
        search?: { [index: string]: string | number | IWhereArr } | null,
        filters?: { [index: string]: string | number | IWhereArr } | null,
        order?: Array<IOrder> | null,
    }
}

export interface ICondition {
    attributes?: string[] | null,
    relationships?: string,
    relationshipFilters?: IRelationshipFilter[],
    where?: null | IWhere,
    search?: { [index: string]: string | number | IWhereArr } | null,
    filters?: { [index: string]: string | number | IWhereArr } | null,
    order?: Array<IOrder> | null,
    limit?: number | null,
    offset?: number | null
};