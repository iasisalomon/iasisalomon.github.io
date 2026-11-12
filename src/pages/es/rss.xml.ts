import type { APIContext } from 'astro';
import { feed } from '../../utils/feed';

export const GET = (context: APIContext) => feed(context, 'es');
