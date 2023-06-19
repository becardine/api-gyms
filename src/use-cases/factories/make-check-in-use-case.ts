import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUseCase } from '../check-in'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

  return checkInUseCase
}
