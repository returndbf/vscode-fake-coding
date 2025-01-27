import type { Uri } from 'vscode'
import { createRange, getCurrentFileUrl, getPosition, jumpToLine, nextTick, saveFile, updateText } from '@vscode-use/utils'
import { reset } from './run'
import { codingMap } from './utils'

export async function resetCoding(url: Uri) {
  const originCode = codingMap.get(url)!
  reset()

  if (getCurrentFileUrl(true) === url) {
    await updateText((edit) => {
      edit.replace(createRange(0, 0, getPosition(originCode.length).position), originCode)
    })
  }
  else {
    const currentFileUrl = getCurrentFileUrl()!
    jumpToLine(0, url.fsPath)?.then(() => {
      updateText((edit) => {
        edit.replace(createRange(0, 0, getPosition(originCode.length).position), originCode)
      })
      nextTick(() => {
        jumpToLine(0, currentFileUrl)
      })
    })
  }
  nextTick(() => {
    saveFile(true)
  })
  codingMap.delete(url)
}
