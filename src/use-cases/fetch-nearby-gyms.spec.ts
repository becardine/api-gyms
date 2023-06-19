import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('fetch nearby gyms use case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -27.6434716,
      longitude: -48.6755659,
    })

    await inMemoryGymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -27.492855,
      longitude: -48.6432088,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.6434716,
      userLongitude: -48.6755659,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
