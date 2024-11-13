type Optional<T> = {
  [prop in keyof T]?: T[prop]
}

export default Optional