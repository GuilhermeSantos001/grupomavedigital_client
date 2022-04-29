/**
 * @description Copia o texto para a área de transferência
 * @author GuilhermeSantos001
 * @update 07/02/2022
 */

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}