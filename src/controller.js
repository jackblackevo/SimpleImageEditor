import model from './model';
import view from './view';

const controller = {
  readSelectFile: function (imgFile) {
    model.readImg(view.imgPreviewArea, imgFile, view.imageEditor);

  },
  updateResizeImgPercent: function (resizeImgPercentVal) {
    var resizePercentage = Number.parseInt(resizeImgPercentVal);
    model.setResizePercentage(resizePercentage);

  },
  updateCompressionImgPercent: function (compressionImgPercentVal) {
    var qualityRate = Number.parseInt(compressionImgPercentVal);
    model.setQualityRate(qualityRate);

  },
  updateGrayscaleFlag: function (isGrayscale) {
    model.setIsGrayscale(isGrayscale);

  },
  updateResizeImgLockFlag: function (isResizeImgLock) {
    model.setIsResizeImgLock(isResizeImgLock);

  },
  getImgFile: function () {
    model.downloadImg();

  },
  cropImg: function () {
    model.setEditedImgSrcToImg();

  },
  resetCrop: function () {
    model.resetCropper();

  },
  closeCrop: function () {
    model.closeCropper();

  }
};

export default controller;