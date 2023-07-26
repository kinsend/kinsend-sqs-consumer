import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AWSCloudWatchLoggerService {
  private cloudWatchLogs: AWS.CloudWatchLogs;
  constructor(private configService: ConfigService) {
    this.cloudWatchLogs = new AWS.CloudWatchLogs({
      accessKeyId: configService.get('aws.accessKeyId'),
      secretAccessKey: configService.get('aws.secretAccessKey'),
      region: configService.get('aws.region'),
    });
  }

  async createLogStreamIfNotExists(
    logGroupName: string,
    logStreamName: string,
  ): Promise<void> {
    const describeParams = {
      logGroupName,
      logStreamNamePrefix: logStreamName,
    };

    try {
      const streamDescription = await this.cloudWatchLogs
        .describeLogStreams(describeParams)
        .promise();
      if (
        !streamDescription.logStreams ||
        streamDescription.logStreams.length === 0
      ) {
        // Log stream doesn't exist, create it
        const createParams = {
          logGroupName,
          logStreamName,
        };
        await this.cloudWatchLogs.createLogStream(createParams).promise();
      }
    } catch (err) {
      console.error('Error checking or creating log stream:', err);
    }
  }

  async putLogEvent(
    logGroupName: string,
    logStreamName: string,
    logMessage: string,
  ): Promise<void> {
    await this.createLogStreamIfNotExists(logGroupName, logStreamName);

    const logEvents = [
      {
        message: logMessage,
        timestamp: new Date().getTime(),
      },
    ];

    const params = {
      logGroupName,
      logStreamName,
      logEvents,
    };

    await new Promise((resolve, reject) => {
      this.cloudWatchLogs.putLogEvents(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
}
