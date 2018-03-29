import isSameLocation from "../lib/is-same-location.js"
import test from "tape"

test("isSameLocation", (t) => {
  t.ok(isSameLocation({}, {}))
  t.notOk(isSameLocation({pathname: "/"}, {pathname: ""}))
  t.ok(isSameLocation({pathname: "/"}, {pathname: "/"}))
  t.notOk(isSameLocation({search: "?foo=bar"}, {search: ""}))
  t.notOk(isSameLocation({hash: "#foobar"}, {hash: ""}))
  t.ok(isSameLocation({
    pathname: "/",
    search: "?foo=bar",
    hash: "#baz"
  }, {
    pathname: "/",
    search: "?foo=bar",
    hash: "#baz"
  }))
  t.notOk(isSameLocation({
    pathname: "/buzz",
    search: "?foo=bar",
    hash: "#baz"
  }, {
    pathname: "/",
    search: "?foo=bar",
    hash: "#baz"
  }))
  t.notOk(isSameLocation({
    pathname: "/",
    search: "?foo=baz",
    hash: "#baz"
  }, {
    pathname: "/",
    search: "?foo=bar",
    hash: "#baz"
  }))
  t.notOk(isSameLocation({
    pathname: "/",
    search: "?foo=bar",
    hash: "#baz"
  }, {
    pathname: "/",
    search: "?foo=bar",
    hash: "#buzz"
  }))
  t.end()
})
