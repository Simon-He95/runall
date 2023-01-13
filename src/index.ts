import process from 'process'
import { filterEmpty, getPkg, getPkgTool, jsShell, useNodeWorker } from 'lazy-js-utils'

export async function runall() {
  const isParallel = process.argv.includes('--parallel') || process.argv.includes('-p')
  const params = process.argv.slice(2).filter(item => !item.startsWith('--'))
  if (!isParallel)
    params.forEach(params => isMatch(params))
  else
    useNodeWorker({ params, stdio: 'inherit' })
}

function isMatch(command: string) {
  if (command.includes('*'))
    return executorAllMatch(command)
  return jsShell(command)
}
async function executorAllMatch(command: string) {
  const { scripts } = await getPkg()
  command = command.slice(0, command.length - 1)
  if (!scripts)
    return
  const params = filterEmpty(Object.keys(scripts).map((key) => {
    if (!key.includes(command))
      return undefined
    switch (getPkgTool()) {
      case 'yarn':
        return `yarn run ${key}`
      case 'npm':
        return `npm run ${key}`
      case 'pnpm':
        return `pnpm run ${key}`
    }
    return undefined
  }))
  return useNodeWorker({ params, stdio: 'inherit' })
}
runall()
