import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3200,
  env: process.env.NODE_ENV || 'development',
}));
