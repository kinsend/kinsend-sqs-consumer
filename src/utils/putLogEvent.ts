import { Logger } from '@nestjs/common';
import { AWSCloudWatchLoggerService } from 'src/modules/aws/services/aws-cloudwatch-logger.service';

export const putLogEvent = async (
  awsCloudWatchLoggerService: AWSCloudWatchLoggerService,
  logGroup: string,
  logStream: string,
  logMessage: string,
) => {
  try {
    await awsCloudWatchLoggerService.putLogEvent(
      logGroup,
      logStream,
      logMessage,
    );
  } catch (error) {
    Logger.error(
      `Could not send log to cloudwatch ${error}. Switching to fallback logging`,
    );
    Logger.log(logMessage);
  }
};
