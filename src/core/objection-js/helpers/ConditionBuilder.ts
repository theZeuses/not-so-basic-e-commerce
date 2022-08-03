import { QueryBuilder } from "objection";
import { IWhere, ICondition, IOrder } from "../interfaces";
import { Op } from '../Operations';

function whereFactory(query: QueryBuilder<any, any>, where: IWhere, outerFunctionName: 'where' | 'orWhere' | 'andWhere', functionName: 'where' | 'orWhere' | 'andWhere'){
    const callback = ((builder) => {
        let flag = false;
        for (const [key, value] of Object.entries(where)) {
            if(key == Op.orWhere){
                if(functionName == 'where' || functionName == 'andWhere'){
                    whereFactory(builder, value as IWhere, !flag ? 'where' : 'andWhere', 'orWhere');
                }else{
                    whereFactory(builder, value as IWhere, !flag ? 'where' : 'orWhere', 'orWhere');
                }
            }else if(key == Op.andWhere){
                if(functionName == 'where' || functionName == 'andWhere'){
                    whereFactory(builder, value as IWhere, !flag ? 'where' : 'andWhere', 'andWhere');
                }else{
                    whereFactory(builder, value as IWhere, !flag ? 'where' : 'orWhere', 'andWhere');
                }
            }else{
                if(flag){
                    if(Array.isArray(value)){
                        (functionName == 'where' || functionName == 'andWhere' 
                        ?
                        builder.andWhere(key, value[0], value[1]) : builder.orWhere(key, value[0], value[1]));
                    }else{
                        (functionName == 'where' || functionName == 'andWhere' 
                        ?
                        builder.andWhere(key, value) : builder.orWhere(key, value));
                    }
                }else{
                    if(Array.isArray(value)){
                        builder.where(key, value[0], value[1]);
                    }else{
                        builder.where(key, value);
                    }
                }
            }
            flag = true;
        }
    });

    outerFunctionName == 'where' ? query.where(callback)
    : 
   (outerFunctionName == 'andWhere' ? query.andWhere(callback) : query.orWhere(callback));

    return query;
}

export function conditionBuilder(query: QueryBuilder<any, any>, condition: ICondition){
    let flag = false;

    if(condition.relationships && condition.relationships.length > 0){
        query.withGraphFetched(`[${condition.relationships}]`);
    }

    if(condition.relationshipFilters){
        condition.relationshipFilters.map((filter) =>{
            query.modifyGraph(filter.relationship, (builder) => {
                const { attributes, condition } = filter;
                if(attributes) builder.select(filter.attributes);
                if(condition) conditionBuilder(builder, condition);
            });
        });
    }
    
    if(condition.where){
        whereFactory(query, condition.where, 'where', 'where');
        flag = true;
    }

    if(condition.filters){
        const callback = ((builder) => {
            let innerFlag = false;
            for (const [key, value] of Object.entries(condition.filters)) {
                if(Array.isArray(value)){
                    (innerFlag ? builder.andWhere(key, value[0], value[1]) : builder.where(key, value[0], value[1]));
                }else{
                    (innerFlag ? builder.andWhere(key, value) : builder.where(key, value));
                }
                innerFlag = true;
            }
        });
        (flag ? query.andWhere(callback) : query.where(callback));
        flag = true;
    }

    if(condition.search){
        const callback = ((builder) => {
            let innerFlag = false;
            for (const [key, value] of Object.entries(condition.search)) {
                if(Array.isArray(value)){
                    (innerFlag ? builder.orWhere(key, value[0], value[1]) : builder.where(key, value[0], value[1]));
                }else{
                    (innerFlag ? builder.orWhere(key, value) : builder.where(key, value));
                }
                innerFlag = true;
            }
        });
        flag ? query.andWhere(callback): query.where(callback);
        flag = true;
    }

    condition.order?.forEach((o: IOrder) => {
        query.orderBy(o.orderBy, o.order ?? 'asc')
    })

    if(condition.limit){
        query.limit(condition.limit);
    }

    if(condition.offset){
        query.offset(condition.offset);
    }

    return query;
}