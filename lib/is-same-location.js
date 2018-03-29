export default (a, b) => {
  return (
    a.pathname === b.pathname
    && a.search === b.search
    && a.hash === b.hash
  )
}
