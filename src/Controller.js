const _model = Symbol('_model')
const _view = Symbol('_view')

class Controller {
  constructor (model, view) {
    this[_model] = model
    this[_view] = view
  }

  readSelectFile (imgFile) {
    this[_model].readImg(this[_view].imgPreviewArea, imgFile, this[_view].imageEditor)
  }

  updateResizeImgPercent (resizeImgPercentVal) {
    const resizePercentage = Number.parseInt(resizeImgPercentVal)
    this[_model].setResizePercentage(resizePercentage)
  }

  updateCompressionImgPercent (compressionImgPercentVal) {
    const qualityRate = Number.parseInt(compressionImgPercentVal)
    this[_model].setQualityRate(qualityRate)
  }

  updateGrayscaleFlag (isGrayscale) {
    this[_model].setIsGrayscale(isGrayscale)
  }

  updateResizeImgLockFlag (isResizeImgLock) {
    this[_model].setIsResizeImgLock(isResizeImgLock)
  }

  getImgFile () {
    this[_model].downloadImg()
  }

  cropImg () {
    this[_model].setEditedImgSrcToImg()
  }

  resetCrop () {
    this[_model].resetCropper()
  }

  closeCrop () {
    this[_model].closeCropper()
  }
}

export default Controller
