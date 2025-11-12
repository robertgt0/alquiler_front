import type { Dest } from "./NotificationsContext";

// Lo llamas justo antes de enviar el payload al backend.
export function enrichPayloadWithExtraDestinations<T extends Record<string, any>>(
  payload: T,
  extraDestinations: Dest[]
): T {
  const metaOld = (payload as any).meta ?? {};
  return {
    ...payload,
    meta: {
      ...metaOld,
      extraDestinations: Array.isArray(metaOld.extraDestinations)
        ? [...metaOld.extraDestinations, ...extraDestinations]
        : extraDestinations,
    },
  };
}
