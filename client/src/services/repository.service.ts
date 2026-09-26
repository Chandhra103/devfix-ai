import type { Repository } from '../types';
export const repositoryService = { list: (repositories: Repository[]) => repositories, find: (repositories: Repository[], id: string) => repositories.find((repo) => repo.id === id) };
