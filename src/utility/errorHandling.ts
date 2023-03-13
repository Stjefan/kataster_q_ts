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


