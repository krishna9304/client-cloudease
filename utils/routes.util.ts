export const ApiRoutes = {
  baseUri: () => 'http://localhost:5005/api',
  auth: {
    login: () => '/auth/login',
    logout: () => '/auth/logout',
    self: () => '/auth/self',
  },
  user: {
    signup: () => '/user/signup',
  },
  project: {
    create: () => '/project',
    getAll: () => '/project',
    get: (projectId: string) => '/project/' + projectId,
    update: (projectId: string) => '/project/' + projectId,
  },
  design: {
    update: (designId: string) => '/project/design/' + designId,
    get: (designId: string) => '/project/design/' + designId,
  },
};
