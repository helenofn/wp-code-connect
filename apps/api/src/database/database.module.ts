import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Env } from '../env.schema.js';

export type Database = NodePgDatabase;

@Module({
  imports: [
    DrizzleModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        drizzle,
        connection: config.getOrThrow('DATABASE_URL', { infer: true }),
      }),
    }),
  ],
})
export class DatabaseModule {}
