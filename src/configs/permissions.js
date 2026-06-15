/**
 * @fileOverview Defines the RBAC (Role-Based Access Control) hierarchy.
 */
export const ROLES = {
  ROOT_OWNER: 10,
  OWNER: 9,
  SUDO: 8,
  PREMIUM: 7,
  VIP: 6,
  ADMIN: 5,
  MODERATOR: 4,
  USER: 1,
  BLACKLISTED: 0
};

export const ROLE_NAMES = {
  [ROLES.ROOT_OWNER]: 'Root Owner',
  [ROLES.OWNER]: 'Owner',
  [ROLES.SUDO]: 'Sudo Admin',
  [ROLES.PREMIUM]: 'Premium User',
  [ROLES.VIP]: 'VIP Member',
  [ROLES.ADMIN]: 'Group Admin',
  [ROLES.MODERATOR]: 'Moderator',
  [ROLES.USER]: 'Standard User',
  [ROLES.BLACKLISTED]: 'Blacklisted'
};

export const DEFAULT_ROLE = ROLES.USER;
