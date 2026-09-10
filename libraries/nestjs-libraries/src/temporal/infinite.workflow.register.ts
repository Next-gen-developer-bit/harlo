import { Global, Injectable, Module, OnModuleInit } from '@nestjs/common';
import { TemporalService } from 'nestjs-temporal-core';

@Injectable()
export class InfiniteWorkflowRegister implements OnModuleInit {
  constructor(private _temporalService: TemporalService) {}

  async onModuleInit(): Promise<void> {
    // Skip only when explicitly disabled. Deploy and local default is to start
    // the overdue-QUEUE sweep so scheduled posts recover if a workflow start
    // was missed while Temporal was still coming up.
    if (process.env.RUN_CRON === 'false') {
      return;
    }

    void this.startMissingPostWorkflow();
  }

  private async startMissingPostWorkflow() {
    for (let attempt = 1; attempt <= 30; attempt++) {
      try {
        const client = this._temporalService.client?.getRawClient();
        if (!client?.workflow) {
          throw new Error('Temporal client is not connected');
        }

        await client.workflow.start('missingPostWorkflow', {
          workflowId: 'missing-post-workflow',
          taskQueue: 'main',
          workflowIdConflictPolicy: 'USE_EXISTING',
        });
        return;
      } catch (err: any) {
        if (
          err?.name === 'WorkflowExecutionAlreadyStartedError' ||
          /already started/i.test(err?.message || '')
        ) {
          return;
        }

        console.warn(
          `missingPostWorkflow start attempt ${attempt} failed:`,
          err?.message || err
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.error(
      'Could not start missingPostWorkflow after retries; overdue queued posts will not be recovered until Temporal is up'
    );
  }
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [InfiniteWorkflowRegister],
  get exports() {
    return this.providers;
  },
})
export class InfiniteWorkflowRegisterModule {}
