import { Gym, Prisma } from '@prisma/client'

export interface FindManeNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(GymId: string): Promise<Gym | null>
  findManyNearby(params: FindManeNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
