class View {
  constructor (document) {
    this.chooseFileInput = document.getElementById('chooseFileInput')
    this.fileNameTxt = document.getElementById('fileNameTxt')
    this.fileTypeTxt = document.getElementById('fileTypeTxt')
    this.originalImgSizeTxt = document.getElementById('originalImgSizeTxt')
    this.originalImgWidthTxt = document.getElementById('originalImgWidthTxt')
    this.originalImgHeightTxt = document.getElementById('originalImgHeightTxt')
    this.croppedImgWidthTxt = document.getElementById('croppedImgWidthTxt')
    this.croppedImgHeightTxt = document.getElementById('croppedImgHeightTxt')
    this.outputImgWidthTxt = document.getElementById('outputImgWidthTxt')
    this.outputImgHeightTxt = document.getElementById('outputImgHeightTxt')
    this.resizeImgPercentRange = document.getElementById('resizeImgPercentRange')
    this.resizeValTxt = document.getElementById('resizeValTxt')
    this.isResizeImgLockCheckBox = document.getElementById('isResizeImgLockCheckBox')
    this.qualityPercentRange = document.getElementById('qualityPercentRange')
    this.qualityValTxt = document.getElementById('qualityValTxt')
    this.outputFileBtn = document.getElementById('outputFileBtn')
    this.imgPreviewArea = document.getElementById('imgPreviewArea')
    this.formArea = document.getElementById('formArea')
    this.imageEditor = document.getElementById('imageEditor')
    this.imgContainer = document.getElementById('imgContainer')
    this.cropBtn = document.getElementById('cropBtn')
    this.resetBtn = document.getElementById('resetBtn')
    this.cancelBtn = document.getElementById('cancelBtn')
    this.isGrayscaleCheckBox = document.getElementById('isGrayscaleCheckBox')
  }

  displayImgFileDetail (imgDetailData) {
    this.fileNameTxt.textContent = imgDetailData.imgFileName
    this.fileTypeTxt.textContent = imgDetailData.imgMIMEType
    this.originalImgSizeTxt.textContent = imgDetailData.imgFileSizeKB
    this.originalImgWidthTxt.textContent = imgDetailData.imgWidth
    this.originalImgHeightTxt.textContent = imgDetailData.imgHeight
    this.croppedImgWidthTxt.textContent = imgDetailData.croppedImgWidth
    this.croppedImgHeightTxt.textContent = imgDetailData.croppedImgHeight
    this.outputImgWidthTxt.textContent = imgDetailData.imgOutputWidth
    this.outputImgHeightTxt.textContent = imgDetailData.imgOutputHeight

    this.resizeImgPercentRange.disabled = false
    this.qualityPercentRange.disabled = false
    this.isGrayscaleCheckBox.disabled = false
    this.isResizeImgLockCheckBox.disabled = false
    this.outputFileBtn.disabled = false
  }

  refreshCroppedImgResolution (croppedImgWidth, croppedImgHeight) {
    this.croppedImgWidthTxt.textContent = croppedImgWidth
    this.croppedImgHeightTxt.textContent = croppedImgHeight
  }

  displayImgEditor () {
    this.formArea.style.display = 'none'
    this.imgContainer.style.display = 'block'
  }

  hideImgEditor () {
    this.formArea.style.display = 'block'
    this.imgContainer.style.display = 'none'
  }

  refreshResizePercentageWidthHeight (resizePercentage, imgOutputWidth, imgOutputHeight) {
    this.resizeValTxt.textContent = resizePercentage
    this.outputImgWidthTxt.textContent = imgOutputWidth
    this.outputImgHeightTxt.textContent = imgOutputHeight
  }

  refreshResizeImgPercentRangeVal (resizePercentage) {
    this.resizeImgPercentRange.value = resizePercentage
  }

  refreshQualityPercentage (qualityPercentage) {
    this.qualityValTxt.textContent = qualityPercentage
  }

  disableResizeImgPercentRange (isToDisable) {
    if (isToDisable) {
      this.resizeImgPercentRange.disabled = true
    } else {
      this.resizeImgPercentRange.disabled = false
    }
  }
}

export default View
