type InputProps<T> = {
  [P in keyof T]?: T[P];
} & {input: (string | T)}

export default InputProps