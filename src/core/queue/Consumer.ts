import { Job, Queue } from "bull";

export abstract class Consumer<IData> {
    protected queue: Queue;
    protected job_name: string;
    protected concurrently_process: number;

    /**
     * creates consumer for a named job on given queue 
     * @date 2022-07-30
     * @param {any} queue Queue
     * @param {any} job_name string
     * @returns {Object}
     */
    constructor(queue: Queue, job_name: string, concurrently: number = 1){
        this.queue = queue;
        this.job_name = job_name;
        this.concurrently_process = concurrently;
        
        this.onCompleteListener();
        this.onErrorListener();
        this.consume();
    }

    /**
     * overload the function to define/call the function which will process the actual intended work on the data
     * @date 2022-07-30
     * @param {any} data:IData
     * @returns {Promise}
     */
    protected abstract consumer(data: IData): Promise<any>;

    /**
    * overload the function to define a custom consumer specific to job
    * @date 2022-07-30
    * @returns {Promise}
    */
    protected async consume(){
        return this.queue.process(this.job_name, this.concurrently_process, async (job, done) => {
            try{
                done(null, await this.consumer(job.data));
            }catch(err){
                done(new Error("Failed"));
            }
        });
    }

    /**
    * overload this function to define a custom callback specific to job of on complete listener
    * @date 2022-07-30
    * @param {any} job:Job
    * @param {any} result:IData
    * @returns {Promise}
    */
    protected async onComplete(job: Job, result: IData){
        try{
            console.log(`${job.name} is successful with result: ${result}. Job id: ${job.id}. Ref Id: ${job.data.id}`);
            return;
        }catch(err){
            console.log(err);
        }
    }

    /**
    * overload this function to define a custom callback specific to job of on error listener
    * @date 2022-07-30
    * @param {any} error:Error
    * @returns {Promise}
    */
    protected async onError(error: Error){
        console.log(error.message);
    }

    /**
    * listens to on complete event
    * @date 2022-07-30
    * @returns {any}
    */
    protected onCompleteListener(){
        this.queue.on("completed", async (job, result) => {
            await this.onComplete(job, result);
        });
    }

    /**
    * listens to on error event
    * @date 2022-07-30
    * @returns {any}
    */
    protected onErrorListener(){
        this.queue.on("error", async (error) => {
            await this.onError(error);
        });
    }
}