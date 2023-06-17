import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-erros'
import { MaxDistanceError } from './errors/max-distance-erros'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('checkIn use case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)

    await inMemoryGymsRepository.create({
      id: 'gym-01',
      title: 'test',
      description: '',
      phone: '',
      latitude: new Decimal(-27.6434716),
      longitude: new Decimal(-48.6755659),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.6434716,
      userLongitude: -48.6755659,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.6434716,
      userLongitude: -48.6755659,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.6434716,
        userLongitude: -48.6755659,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.6434716,
      userLongitude: -48.6755659,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.6434716,
      userLongitude: -48.6755659,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    inMemoryGymsRepository.items.push({
      id: 'gym-02',
      title: 'test',
      description: '',
      phone: '',
      latitude: new Decimal(-27.5901973),
      longitude: new Decimal(-48.616171),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.6434716,
        userLongitude: -48.6755659,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
