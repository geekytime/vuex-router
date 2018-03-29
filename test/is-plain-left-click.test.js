import isPlainLeftClick from "../lib/is-plain-left-click.js"
import test from "tape"

test("isPlainLeftClick", (t) => {
  t.notOk(isPlainLeftClick({button: 1}))
  t.notOk(isPlainLeftClick({metaKey: true}))
  t.notOk(isPlainLeftClick({altKey: true}))
  t.notOk(isPlainLeftClick({ctrlKey: true}))
  t.notOk(isPlainLeftClick({shiftKey: true}))
  t.notOk(isPlainLeftClick({defaultPrevented: true}))
  t.end()
})
