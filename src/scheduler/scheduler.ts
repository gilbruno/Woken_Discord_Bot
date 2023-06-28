import { CronJob } from 'cron';
import { Cache } from '../utils/cache';

export class Scheduler {
    cronJob: CronJob

    constructor() {

    }

    public run() {
        console.log('******* RUN')    
    }

}    