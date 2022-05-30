// Fork from react-freeze
// https://github.com/software-mansion/react-freeze/blob/main/src/index.tsx
import React, { Component, lazy, Suspense, Fragment } from 'react'
import { globalThis, isUndefined, isFunction } from '../../helpers'

const isSupported = isFunction(lazy) && !isUndefined(Suspense)
const notSupportSuspense = !isSupported

class Suspender extends Component {
  promiseCache = {}
  render() {
    const { freeze, children } = this.props
    const { promiseCache } = this

    if (freeze && !promiseCache.promise) {
      promiseCache.promise = new Promise((resolve) => {
        promiseCache.resolve = resolve
      })
      throw promiseCache.promise
    } else if (freeze) {
      throw promiseCache.promise
    } else if (promiseCache.promise) {
      promiseCache.resolve()
      promiseCache.promise = undefined
    }

    return <Fragment>{children}</Fragment>
  }
}

export default function Freeze({ freeze, children, placeholder = null }) {
  if (notSupportSuspense) return children

  return (
    <Suspense fallback={placeholder}>
      <Suspender freeze={freeze}>{children}</Suspender>
    </Suspense>
  )
}
