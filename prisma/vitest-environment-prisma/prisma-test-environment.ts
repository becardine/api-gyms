import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Starting')

    return {
      teardown: () => {
        console.log('Stopping')
      },
    }
  },
}
