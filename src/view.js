const view = {
  chooseFileInput: document.getElementById('chooseFileInput'),
  fileNameTxt: document.getElementById('fileNameTxt'),
  fileTypeTxt: document.getElementById('fileTypeTxt'),
  originalImgSizeTxt: document.getElementById('originalImgSizeTxt'),
  originalImgWidthTxt: document.getElementById('originalImgWidthTxt'),
  originalImgHeightTxt: document.getElementById('originalImgHeightTxt'),
  croppedImgWidthTxt: document.getElementById('croppedImgWidthTxt'),
  croppedImgHeightTxt: document.getElementById('croppedImgHeightTxt'),
  outputImgWidthTxt: document.getElementById('outputImgWidthTxt'),
  outputImgHeightTxt: document.getElementById('outputImgHeightTxt'),
  resizeImgPercentRange: document.getElementById('resizeImgPercentRange'),
  resizeValTxt: document.getElementById('resizeValTxt'),
  isResizeImgLockCheckBox: document.getElementById('isResizeImgLockCheckBox'),
  qualityPercentRange: document.getElementById('qualityPercentRange'),
  qualityValTxt: document.getElementById('qualityValTxt'),
  outputFileBtn: document.getElementById('outputFileBtn'),
  imgPreviewArea: document.getElementById('imgPreviewArea'),
  formArea: document.getElementById('formArea'),
  imageEditor: document.getElementById('imageEditor'),
  imgContainer: document.getElementById('imgContainer'),
  cropBtn: document.getElementById('cropBtn'),
  resetBtn: document.getElementById('resetBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  isGrayscaleCheckBox: document.getElementById('isGrayscaleCheckBox'),
  displayImgFileDetail: function (imgDetailData) {
    view.fileNameTxt.textContent = imgDetailData.imgFileName;
    view.fileTypeTxt.textContent = imgDetailData.imgMIMEType;
    view.originalImgSizeTxt.textContent = imgDetailData.imgFileSizeKB;
    view.originalImgWidthTxt.textContent = imgDetailData.imgWidth;
    view.originalImgHeightTxt.textContent = imgDetailData.imgHeight;
    view.croppedImgWidthTxt.textContent = imgDetailData.croppedImgWidth;
    view.croppedImgHeightTxt.textContent = imgDetailData.croppedImgHeight;
    view.outputImgWidthTxt.textContent = imgDetailData.imgOutputWidth;
    view.outputImgHeightTxt.textContent = imgDetailData.imgOutputHeight;

    view.resizeImgPercentRange.disabled = false;
    view.qualityPercentRange.disabled = false;
    view.isGrayscaleCheckBox.disabled = false;
    view.isResizeImgLockCheckBox.disabled = false;
    view.outputFileBtn.disabled = false;

  },
  refreshCroppedImgResolution: function (croppedImgWidth, croppedImgHeight) {
    view.croppedImgWidthTxt.textContent = croppedImgWidth;
    view.croppedImgHeightTxt.textContent = croppedImgHeight;

  },
  displayImgEditor: function () {
    view.formArea.style.display = 'none';
    view.imgContainer.style.display = 'block';

  },
  hideImgEditor: function () {
    formArea.style.display = 'block';
    imgContainer.style.display = 'none';

  },
  refreshResizePercentageWidthHeight: function (resizePercentage, imgOutputWidth, imgOutputHeight) {
    view.resizeValTxt.textContent = resizePercentage;
    view.outputImgWidthTxt.textContent = imgOutputWidth;
    view.outputImgHeightTxt.textContent = imgOutputHeight;

  },
  refreshResizeImgPercentRangeVal: function (resizePercentage) {
    view.resizeImgPercentRange.value = resizePercentage;

  },
  refreshQualityPercentage: function (qualityPercentage) {
    view.qualityValTxt.textContent = qualityPercentage;

  },
  disableResizeImgPercentRange: function (isToDisable) {
    if (isToDisable) {
      view.resizeImgPercentRange.disabled = true;

    } else {
      view.resizeImgPercentRange.disabled = false;

    }

  }
};

export default view;