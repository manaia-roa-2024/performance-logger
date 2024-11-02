export default function InputLabel({label, elementId}: {label: string | undefined, elementId: string | undefined}) {
  return label && <label htmlFor={elementId}>{label}</label>
}
