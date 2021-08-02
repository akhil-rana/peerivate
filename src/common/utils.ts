import { RefObject } from 'react';

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

export const stringToKebabCase = (str: string) =>
  str
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    ?.replace(/[\s_]+/g, '-')
    ?.toLowerCase();

export function kebabToCapitalizedSpacedString(str: string) {
  return str
    ?.split('-')
    ?.join(' ')
    ?.replace(/^\w|\s\w/g, function (letter) {
      return letter.toUpperCase();
    });
}

export function generateRandomPeerId(prefix: string) {
  return Math.random()
    ?.toString(32)
    ?.replace('0.', (stringToKebabCase(prefix) || '') + '_');
}

export function playStream(
  track: MediaStream,
  videoRef: RefObject<HTMLVideoElement>
) {
  (
    (videoRef as RefObject<HTMLVideoElement>).current as HTMLVideoElement
  ).srcObject = track;
}

export async function getDefaultCameraDeviceId() {
  const mediaDevices = navigator.mediaDevices as any;

  const devices = (await mediaDevices.enumerateDevices()).filter((e: any) => {
    return e.kind === 'videoinput';
  });
  return devices[0].deviceId;
}
