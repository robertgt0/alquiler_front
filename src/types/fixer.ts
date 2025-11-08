export type LocationDTO = { lat: number; lng: number; address?: string };
export type UpsertFixerDTO = { userId: string; location: LocationDTO; categories?: string[] };
export type Category = { id: string; name: string; slug: string; createdAt: string };
