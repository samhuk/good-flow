import { exit } from 'process'
import { task } from './task'

const main = () => {
  const [taskResult, err] = task()
  if (err != null) {
    console.log(err.toLogString({ linesBetweenNodes: 1 }))

    exit(1)
  }

  exit(0)
}

main()
