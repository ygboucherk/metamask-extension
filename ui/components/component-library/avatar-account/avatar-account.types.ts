import { Size } from '../../../helpers/constants/design-system';

export enum AvatarAccountVariant {
  Jazzicon = 'jazzicon',
  Blockies = 'blockies',
}

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) =>
      (keys as readonly string[]).includes(key),
    ),
  ) as Pick<T, K>;

export const AvatarAccountSize = pick(Size, ['XS', 'SM', 'MD', 'LG', 'XL']);

export const AvatarAccountDiameter = {
  [AvatarAccountSize.XS]: 16,
  [AvatarAccountSize.SM]: 24,
  [AvatarAccountSize.MD]: 32,
  [AvatarAccountSize.LG]: 40,
  [AvatarAccountSize.XL]: 48,
} as const;
