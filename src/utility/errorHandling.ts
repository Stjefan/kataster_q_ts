export const errorHandler = (err: any) => {
  console.log('In error', err)
  switch (err.response.status) {
    case 400:
      console.log(err.response.data)
      break;
    default:
      console.log(err.response)

  }
}


export const castNumber = (node: any) => {
  node.hook.input((value: any, next: any) => next(Number(value)))
}

export const getRandomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min) * 10) / 10
}

export function createXlsxReportV1(args: any) {

}
