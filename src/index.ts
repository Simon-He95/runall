import { useNodeWorker } from 'lazy-js-utils'

export async function runall() {
  const params = process.argv.slice(2)
  useNodeWorker({ params, stdio: 'inherit' })
}

runall()
