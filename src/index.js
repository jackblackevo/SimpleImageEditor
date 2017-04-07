import View from './View'
import Model from './Model'
import Controller from './Controller'

window.addEventListener('DOMContentLoaded', () => {
  ;(function pageInit() {
    const view = new View(document)
    const model = new Model(view)
    const controller = new Controller(model, view)

    view.chooseFileInput.addEventListener('change', event => {
      const fileList = event.target.files

      if (fileList.length > 0) {
        const file = fileList[0]
        controller.readSelectFile(file)

      }

    })

    view.resizeImgPercentRange.addEventListener('input', event => {
      const value = event.target.value
      controller.updateResizeImgPercent(value)

    })

    view.qualityPercentRange.addEventListener('input', event => {
      const value = event.target.value
      controller.updateCompressionImgPercent(value)

    })

    view.outputFileBtn.addEventListener('click', () => {
      controller.getImgFile()

    })

    view.cropBtn.addEventListener('click', () => {
      controller.cropImg()

    })

    view.resetBtn.addEventListener('click', () => {
      controller.resetCrop()

    })

    view.cancelBtn.addEventListener('click', () => {
      controller.closeCrop()

    })

    view.isGrayscaleCheckBox.addEventListener('change', event => {
      const isGrayscale = event.target.checked
      controller.updateGrayscaleFlag(isGrayscale)

    })

    view.isResizeImgLockCheckBox.addEventListener('click', event => {
      const isResizeImgLock = event.target.checked
      controller.updateResizeImgLockFlag(isResizeImgLock)

    })

  })()

})