const wait = async () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

export default wait
