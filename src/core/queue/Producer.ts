import { JobOptions, Queue } from "bull";

export abstract class Producer<IData> {
    protected queue: Queue;
    protected job_name: string;
    protected defaultJobOpts: JobOptions = {
        removeOnComplete: true
    };

    /**
     * creates producer for a named job on given queue 
     * @date 2022-07-30
     * @param {Queue} queue Queue
     * @param {JobOption} job_name string
     * @returns {Object}
     */
    constructor(queue: Queue, job_name: string, defaultJobOptions?: JobOptions){
        this.queue = queue;
        this.job_name = job_name;
        if(defaultJobOptions) this.defaultJobOpts = defaultJobOptions;
    }

    /**
     * produce a job on queue
     * @date 2022-07-30
     * @param {IData} data:IData
     * @param {JobOption} options?:JobOptions
     * @returns {any}
     */
    async produce(data: IData, options?: JobOptions){
        return await this.queue.add(this.job_name, data, {...this.defaultJobOpts, ...options});
    }
}