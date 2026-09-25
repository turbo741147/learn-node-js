import 'dotenv/config';
import zod from 'zod';
import { DEFAULT_PORTS } from '../utils/common/constants.js';

const envSchema = zod.object({
    PORT: zod.coerce.number().default(DEFAULT_PORTS),
    DATABASE_URL: zod.string().min(1, 'Укажите DATABASE_URL'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(parsed.error.issues.map((issue) => issue.message).join('\n'));
    process.exit(1);
}

export const config = {
    port: parsed.data.PORT,
    databaseUrl: parsed.data.DATABASE_URL,
};
