import rbac from '@rbac/rbac';

const rbacConfig = {
    enableLogger: !(process.env.NODE_ENV === 'production')
};

export const configuredRBAC = rbac(rbacConfig);
