export default [{
  path: "/",
  page: "home",
  transIndex: 0
},{
  path: "/foo",
  page: "foo",
  transIndex: 1
},{
  path: ["/bar","/bar/:id"],
  page: "bar",
  transIndex: 2
}]
