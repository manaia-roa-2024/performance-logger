interface KeyValuePair<K, U>{
  key: K,
  value: U
}

export type DropdownOption<K=string> = KeyValuePair<K, string>

export type DropdownOptions<K=string> = Array<DropdownOption<K>>