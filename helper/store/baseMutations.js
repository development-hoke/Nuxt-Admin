export function set(state, data) {
  state.data = data
}

export function setOne(state, data, prepend = false) {
  if (state.data.length === 0) {
    state.data.push(data)
    return
  }

  const index = state.data.findIndex(
    (item) => Number(item.id) === Number(data.id)
  )

  if (index === -1) {
    if (prepend) {
      state.data.splice(0, 0, data)
    } else {
      state.data.push(data)
    }

    return
  }

  state.data.splice(index, 1, data)
}

export function setOnePrepend(state, data) {
  setOne(state, data, true)
}

export function append(state, data) {
  state.data.push(...data)
}

export function remove(state, id) {
  const index = state.data.findIndex((item) => Number(item.id) === Number(id))

  if (index === -1) {
    return
  }

  state.data.splice(index, 1)
}

export function clear(state) {
  state.data = []
}
