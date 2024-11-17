export default function roundToX(num: number, decimals: number) {
  return +(Math.round(num + "e" + decimals) + "e-" + decimals);
}