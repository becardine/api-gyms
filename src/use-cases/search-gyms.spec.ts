import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('search gyms use case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(inMemoryGymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Javascript',
      description: '',
      phone: '',
      latitude: -27.6434716,
      longitude: -48.6755659,
    })

    await inMemoryGymsRepository.create({
      title: 'TypeScript',
      description: '',
      phone: '',
      latitude: -27.6434716,
      longitude: -48.6755659,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `TypeScript ${i}`,
        description: '',
        phone: '',
        latitude: -27.6434716,
        longitude: -48.6755659,
      })
    }

    const { gyms } = await sut.execute({
      query: 'TypeScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TypeScript 21' }),
      expect.objectContaining({ title: 'TypeScript 22' }),
    ])
  })
})
