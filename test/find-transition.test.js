import findTransition from "../lib/find-transition.js"
import test from "tape"

test("findTransition - no transIndexes", (t) => {
  t.notOk(findTransition(), "no routes")
  t.notOk(findTransition(undefined, {transIndex: 0}), "no from transIndex")
  t.notOk(findTransition({transIndex: 0}, undefined), "no to transIndex")
  t.notOk(findTransition({}, {transIndex: 0}), "no from route")
  t.notOk(findTransition({transIndex: 0}, {}), "no to route")
  t.end()
})

test("findTransition 'forward'", (t) => {
  const fooRoute = {page: "foo", transIndex: 0}
  const barRoute = {page: "bar", transIndex: 1}
  const expected = { foo: "slide-out-left", bar: "slide-in-left" }
  const actual = findTransition(fooRoute, barRoute)
  t.deepEqual(actual, expected, "forward slides left")
  t.end()
})

test("findTransition 'forward'", (t) => {
  const fooRoute = {page: "foo", transIndex: 0}
  const barRoute = {page: "bar", transIndex: 1}
  const expected = { bar: "slide-out-right", foo: "slide-in-right" }
  const actual = findTransition(barRoute, fooRoute)
  t.deepEqual(actual, expected, "backward slides right")
  t.end()
})
