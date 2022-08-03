import { Model, AjvValidator, QueryBuilder, Page, JSONSchema, ModelOptions, Pojo, QueryContext, TransactionOrKnex } from "objection";
import addFormats from "ajv-formats";
import VisibilityPlagin from "objection-visibility";
import { db } from "@providers/database/database.provider";
import { isEmpty, castArray, compact } from 'lodash';
import util from 'util';
import { Knex } from "knex";
import * as argon from 'argon2';
import { conditionBuilder } from "./helpers/ConditionBuilder";
import { ICondition } from "./interfaces";
import { UnprocessableEntityException } from "@core/exceptions";

export class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
    ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>;
    SingleQueryBuilderType!: CustomQueryBuilder<M, M>;
    MaybeSingleQueryBuilderType!: CustomQueryBuilder<M, M | undefined>;
    NumberQueryBuilderType!: CustomQueryBuilder<M, number>;
    PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>;
  
    selectByCondition(condition?: ICondition) : this {
        let query = this.select(condition?.attributes ?? '*');

        if(condition){
            query = conditionBuilder(query, condition) as this;
        }
        return query;
    }
}

abstract class BaseModel extends VisibilityPlagin(Model) {
    QueryBuilderType!: CustomQueryBuilder<this>;
    static QueryBuilder = CustomQueryBuilder;
    [key: string]: any,
    static casts: {
        [key: string]: string
    }
    static hashes: string[];
    static identifiers: string[];
    static unique: Array<string | string[]>

    static createValidator() {
        return new AjvValidator({
            onCreateAjv: ajv => {
                // Here you can modify the `Ajv` instance.
                return addFormats(ajv);
            },
            options: {
                allErrors: true,
                validateSchema: false,
                ownProperties: true
            }
        });
    };

    static get modelPaths() {
        return [__dirname];
    }

    $beforeValidate(jsonSchema: JSONSchema, json: Pojo, opt: ModelOptions): JSONSchema{
        const conf: any = this.constructor;
        if (conf.casts && typeof conf.casts == 'object') {
            Object.entries(conf.casts).map(function ([key, value]){
                if(json[key] && typeof json[key] == 'string' && (value == 'date' || value == 'date-time')){
                    json[key] = new Date(json[key]);
                }
            });
        }
        return super.$beforeValidate(jsonSchema, json, opt);
    }

    async $beforeInsert (queryContext: QueryContext) {
        await this.queryResolver(super.$beforeInsert(queryContext) as Promise<any>, false, {}, queryContext);

        const conf: any = this.constructor;
        if(conf.hashes && Array.isArray(conf.hashes)){
            for(let i = 0; i < conf.hashes.length; i++){
                if(this[conf.hashes[i]]){
                    await this.generateHash(conf.hashes[i], this[conf.hashes[i]]);
                }
            }
        }
    }

    async $beforeUpdate (queryOptions: ModelOptions, queryContext: QueryContext) {
        await this.queryResolver(super.$beforeUpdate(queryOptions, queryContext) as Promise<any>, true, queryOptions, queryContext);
        const conf: any = this.constructor;
        this.updated_at = new Date();
        if(conf.hashes && Array.isArray(conf.hashes)){
            for(let i = 0; i < conf.hashes.length; i++){
                if(this[conf.hashes[i]]){
                    await this.generateHash(conf.hashes[i], this[conf.hashes[i]]);
                }
            }
        }
    }

    // Compares a value to a argon hash, returns whether or not the password was verified.
    async verify(field: string, value: string) {
        return argon.verify(value, this[field])
    }

    /* Sets the password field to a argon hash of the password.*/
    async generateHash (field: string, value: string) {
        const hash = await argon.hash(value);
        this[field] = hash
    }

    /**
    * Query resolver for unique.
    */

    private queryResolver(parent: Promise<any>, update = false, queryOptions = {}, context: QueryContext) {
        const promises = this.getQuery(update, queryOptions, context);
        if(!promises) return;
        return Promise.resolve(parent)
            .then(() => Promise.all(promises))
            .then(rows => {
            const errors = this.parseErrors(rows);

            if (!isEmpty(errors)) {
                throw new UnprocessableEntityException("UNIQUE_VALIDATION_FAILED");
            }
        });
    }

    /**
    * Get select query for unique.
    */
    private getQuery(update: boolean, queryOptions: ModelOptions, context: QueryContext) {
        interface ModelOptionsExtended extends ModelOptions {
            old?: {
                [key: string]: any
            }
        }
        const extendedQueryOptions = queryOptions as ModelOptionsExtended;
        const conf:any = this.constructor;
        if(!Array.isArray(conf.unique) || isEmpty(conf.unique)) return null;

        return conf.unique.reduce((queries: Knex.QueryBuilder[], field: string, index: number) => {
            const knex = context.transaction || Model.knex();
            const collection = knex(conf.tableName);
            const fields = castArray(field);

            if (isEmpty(compact(fields.map(fieldName => this[fieldName])))) {
                return queries;
            }

            const query = fields
            .reduce((subset, fieldName) => {
                const oldFieldValue = extendedQueryOptions.old && extendedQueryOptions.old[fieldName];

                return subset.where(
                    fieldName,
                    this[fieldName] || oldFieldValue || null
                );
            }, collection.select())
            .limit(1);

            if (update && extendedQueryOptions?.old) {
                let identifiers = ['id'];
                if(Array.isArray(conf.identifiers) && !isEmpty(conf.identifiers)) identifiers = conf.identifiers;
                for(let i = 0; i < identifiers.length; i++){
                    if(extendedQueryOptions?.old[identifiers[i]])
                    query.andWhereNot(identifiers[i], extendedQueryOptions?.old[identifiers[i]])
                }
            }else if(update){
                let identifiers = ['id'];
                if(Array.isArray(conf.identifiers) && !isEmpty(conf.identifiers)) identifiers = conf.identifiers;

                for(let i = 0; i < identifiers.length; i++){
                    if(this[identifiers[i]])
                    query.andWhereNot(identifiers[i], this[identifiers[i]])
                }
            }

            queries[index] = query;

            return queries;
        }, []);
    }

    /**
    * Parse errors for unique.
    */
    private parseErrors(rows: any[]) {
        return rows.reduce((errors: {[key: string]: any}, error: any, index: any) => {
            const conf:any = this.constructor;
            if (!isEmpty(error)) {
            const fields = castArray(conf.unique[index]);

            fields.forEach(field => {
                errors[field] = [{
                    keyword: 'unique',
                    message: util.format('%s already in use.', conf.unique[index])
                }];
            });
            }

            return errors;
        }, {});
    }
};

BaseModel.knex(db);

export { BaseModel };