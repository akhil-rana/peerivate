export function csv_to_array(
  data: string,
  delimiter = ',',
  omitFirstRow = false
) {
  return data
    .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
    .split('\n')
    .map((v: any) => v.split(delimiter));
}

export function generateRandomPeerId(prefix: string) {
  return Math.random()
    .toString(32)
    .replace('0.', (prefix || '') + '_');
}
