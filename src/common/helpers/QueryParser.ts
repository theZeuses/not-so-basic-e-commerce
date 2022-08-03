import { BadRequestException } from '@core/exceptions';
import { ICondition } from '@core/objection-js/interfaces';
import { Op } from '@core/objection-js/Operations';

//parse string tp objection-js operation
const operationParser = (operation: string, value: string) : string | [string, string | number] => {
  //TODO:Implement strategies to parse operation
  if(operation == 'ltei'){
    return [Op.lte, parseInt(value)];
  }else if(operation == 'gtei'){
    return [Op.gte, parseInt(value)];
  }
  return value;
}

/**
 * Parse query string into objection-js condition query
 * @param {Express.Request.Query} query
 * @param {string[]} search_fields
 * @returns {ICondition | undefined}
 */
export const makeSelectCondition = (query: any, search_fields: string[]) => {
  if(!query) return undefined;
  //since we will be using filters as a dynamic array so treat as a reserved word
  if(query.filters) throw new BadRequestException('BAD_QUERY_STRING');

  const condition: ICondition = {};
  let { q, attr, w, wf, wa, l, o, s, ...filters } = query; 

  //if columns to select are specified and properly formatted only then return them
  if(attr){
      try{
          attr = JSON.parse(attr.toString()) as string;
      }catch(err){}
      if(!Array.isArray(attr) && typeof attr != 'object') attr = attr.toString().split(",");
      if(!Array.isArray(attr) && typeof attr == 'object') throw new BadRequestException('BAD_QUERY_STRING');
      condition.attributes = attr;
  }

  //parse the relationships to eager load
  if(w){
      try{
          w = JSON.parse(w.toString()) as string;
      }catch(err){}
      if(Array.isArray(w)) w = w[0];
      if(!Array.isArray(w) && typeof w == 'object') throw new BadRequestException('BAD_QUERY_STRING');
      condition.relationships = w;
  }

  //parse the filters for relationships
  if(wf){
      try{
          wf = JSON.parse(wf.toString()) as string;
      }catch(err){}
      if(!condition.relationshipFilters) condition.relationshipFilters = [];
      if(Array.isArray(wf)) wf = wf[0];
      if(!Array.isArray(wf) && typeof wf == 'object') throw new BadRequestException('BAD_QUERY_STRING');
      const filters = wf.toString().split(",");
      filters.map((filter: string) => {
        const [relationship, column, opOrVal, val] = filter.split(":");
        if(!relationship || !column || !opOrVal) throw new BadRequestException('BAD_QUERY_STRING');
        let comparingValue;
        if(!val){
          comparingValue = opOrVal;
        }else{
          comparingValue = operationParser(opOrVal, val);
        }
        condition.relationshipFilters.push({
          relationship: relationship,
          condition: {
            filters: {
              [column]: comparingValue
            }
          }
        })
      });
  }

  //parse the search string in terms of search able fields
  if(q){
      condition.search = {};
      try{
        q = JSON.parse(q.toString()) as string;
      }catch(err){}
      if(!Array.isArray(q)) q = [q];
      q.map((search) => {
          let [field, value] = search.toString().split(":");
          if(value && search_fields.includes(field)){
              condition.search = {
                  ...condition.search,
                  [field]: [Op.like, `%${value}%`]
              }
          }else if(!value){
            value = field; 
            search_fields.map((field: string) => {
              condition.search = {
                  ...condition.search,
                  [field]: [Op.like, `%${value}%`]
              }
            });
          }
      });
  }

  //parse the filters
  if(filters){
      condition.filters = {};
      Object.keys(filters).map((field) => { 
        let value = filters[field] ?? '';
        if(Array.isArray(value)) value = value[0];
        const [opOrVal, val] = value.toString().split(':');
        let comparingValue;
        if(!val){
          comparingValue = opOrVal;
        }else{
          comparingValue = operationParser(opOrVal, val);
        }
        const [levelOne, levelTwo] = field.toString().split('.');
        condition.filters = {
          ...condition.filters,
          [levelOne]: comparingValue
        }
      });
  }

  //parse the sort mechanism
  if(s){
      try{
          s = JSON.parse(s.toString()) as string;
      }catch(err){}
      if(s && !Array.isArray(s)){
          s = [s.toString()];
      }

      s.map((sort) => {
          if(!condition.order) condition.order = [];
          const [field, order] = sort.toString().split(':');
          condition.order.push({
              orderBy: field,
              order: order == 'desc' ? 'desc' : 'asc'
          })
      });
  }

  //parse offset
  if(o){
      try{
          o = JSON.parse(o.toString()) as string;
      }catch(err){}
      if(Array.isArray(o)) condition.offset = parseInt(o[0] as string)
      else condition.offset = parseInt(o as string);
  }

  //parse limit
  if(l){
      try{
          l = JSON.parse(l.toString()) as string;
      }catch(err){}
      if(Array.isArray(l)) condition.limit = parseInt(l[0] as string)
      else condition.limit = parseInt(l as string);
  }
  return condition;
}