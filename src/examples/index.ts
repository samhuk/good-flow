import { exit } from 'process'
import { task } from './task'

const main = () => {
  const [taskResult, err] = task()
  if (err != null) {
    console.log(err.toLogString())

    exit(1)
  }

  exit(0)
}

main()
