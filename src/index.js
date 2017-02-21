import view from './view';
import controller from './controller';

window.addEventListener('DOMContentLoaded', function () {
  (function pageInit() {
    view.chooseFileInput.addEventListener('change', function (event) {
      var fileList = event.target.files;

      if (fileList.length > 0) {
        var file = fileList[0];
        controller.readSelectFile(file);

      }

    });

    view.resizeImgPercentRange.addEventListener('input', function (event) {
      var value = event.target.value;
      controller.updateResizeImgPercent(value);

    });

    view.qualityPercentRange.addEventListener('input', function (event) {
      var value = event.target.value;
      controller.updateCompressionImgPercent(value);

    });

    view.outputFileBtn.addEventListener('click', function () {
      controller.getImgFile();

    });

    view.cropBtn.addEventListener('click', function () {
      controller.cropImg();

    });

    view.resetBtn.addEventListener('click', function () {
      controller.resetCrop();

    });

    view.cancelBtn.addEventListener('click', function () {
      controller.closeCrop();

    });

    view.isGrayscaleCheckBox.addEventListener('change', function (event) {
      var isGrayscale = event.target.checked;
      controller.updateGrayscaleFlag(isGrayscale);

    });

    view.isResizeImgLockCheckBox.addEventListener('click', function (event) {
      var isResizeImgLock = event.target.checked;
      controller.updateResizeImgLockFlag(isResizeImgLock);

    });

  })();

});