export class MockModel {
    static setMockReturnValue(value){
        (this as any).stub = value;
    };
    static get mockReturnValue(){
        return (this as any).stub;
    };
    static query = jest.fn().mockReturnThis();
    static insert = jest.fn().mockReturnThis();
    static insertGraphAndFetch = jest.fn().mockReturnThis();
    static insertAndFetch = jest.fn().mockReturnThis();
    static insertGraph = jest.fn().mockReturnThis();
    static returning = jest.fn().mockReturnThis();
    static where = jest.fn().mockReturnThis();
    static withGraphFetched = jest.fn().mockReturnThis();
    static findById = jest.fn().mockReturnThis();
    static modifiers = jest.fn().mockReturnThis();
    static orderBy = jest.fn().mockReturnThis();
    static selectByCondition = jest.fn().mockReturnThis();
    static allowGraph = jest.fn().mockReturnThis();
    static startTransaction = jest.fn();
    static then = jest.fn(function(done){ 
        done((this as any).mockReturnValue); 
    });
};