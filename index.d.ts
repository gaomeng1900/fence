export declare class Fence {
    /**
     * task list
     */
    tasks: (() => Promise<any>)[];
    /**
     * result for each task
     */
    results: any[];
    /**
     * error for each task
     */
    errors: Error[];
    state: 'pending' | 'fulfilled' | 'rejected' | 'partiallyRejected';
    fired: boolean;
    addTask(task: () => Promise<any>): number /** Task ID */;
    addTaskPromsise(task: (resolve: any, reject: any) => void): number /** Task ID */;
    /**
     * @todo error handling
     */
    done(needsAll?: boolean): Promise<any[]>;
    getResult(taskID: number): any;
    getError(taskID: number): Error;
}
