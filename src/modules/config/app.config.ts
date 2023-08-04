import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  test_emails: process.env.TEST_EMAILS || '',
}));
