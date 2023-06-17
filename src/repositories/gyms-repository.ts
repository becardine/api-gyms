import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findById(GymId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
