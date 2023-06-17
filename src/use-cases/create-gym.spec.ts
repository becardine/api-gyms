import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('create gym use case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(inMemoryGymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym test',
      description: null,
      phone: null,
      latitude: -27.6434716,
      longitude: -48.6755659,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
