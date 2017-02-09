window.addEventListener('DOMContentLoaded', function () {
  'use strict'

  var model = {
    _img: null,
    _imageEditor: null,
    _imgMIMEType: '',
    _imgFileSize: 0,
    _imgFileName: '',
    _imgWidth: 0,
    _imgHeight: 0,
    _outputWidth: 0,
    _outputHeight: 0,
    _maxOutputLongerLength: 1600,
    _maxOutputShorterLength: 1200,
    _resizePercentage: 60,
    _qualityRate: 0.93,
    _isGrayscale: false,
    _isResizeImgLock: false,
    _imgCropper: null,
    _turnGrayscale: function (canvasContext) {
      var tempImgData;
      var tempData;

      tempImgData = canvasContext.getImageData(0, 0, model._outputWidth, model._outputHeight);
      tempData = tempImgData.data;

      for (var i = 0; i < tempData.length; i += 4) {
        var brightness = 0.34 * tempData[i] + 0.5 * tempData[i + 1] + 0.16 * tempData[i + 2];
        // red
        tempData[i] = brightness;
        // green
        tempData[i + 1] = brightness;
        // blue
        tempData[i + 2] = brightness;
      }

      canvasContext.putImageData(tempImgData, 0, 0);

    },
    _destroyCropper: function () {
      view.hideImgEditor();

      if (model._imgCropper !== null) {
        console.log('editor close...')
        model._imgCropper.destroy();

      }

    },
    _bindImgToOpenEditor: function () {
      console.log('editor init...');
      model._img.addEventListener('click', function openEditorHandler(event) {
        model._initImgEditor();

        view.displayImgEditor();

        event.target.removeEventListener('click', openEditorHandler);

      });

    },
    _initImgEditor: function () {
      model._imgCropper = new Cropper(model._imageEditor, {
        movable: false,
        // zoomable: false,
        rotatable: false,
        scalable: false,
        /*
        crop: function (event) {
           console.log('x = ' + event.detail.x);
           console.log('y = ' + event.detail.y);
           console.log('width = ' + event.detail.width);
           console.log('height = ' + event.detail.height);
           console.log('rotate = ' + event.detail.rotate);
           console.log('scaleX = ' + event.detail.scaleX);
           console.log('scaleY = ' + event.detail.scaleY);
         }
         */
      });

    },
    _updateResizePercentage: function () {
      if (model._isResizeImgLock) {
        var longerLength;
        var shorterLength;
        var longerLengthName;

        var isLongerLengthLongerThanMax;
        var isShorterLengthLongerThanMax;

        var rate;

        model._imgWidth > model._imgHeight ? (longerLength = model._imgWidth, shorterLength = model._imgHeight, longerLengthName = 'width') : (longerLength = model._imgHeight, shorterLength = model._imgWidth, longerLengthName = 'height');

        var isFirst = true;
        while (true) {
          isLongerLengthLongerThanMax = longerLength > model._maxOutputLongerLength;
          isShorterLengthLongerThanMax = shorterLength > model._maxOutputShorterLength;

          if (isLongerLengthLongerThanMax || isShorterLengthLongerThanMax) {
            isFirst && view.disableResizeImgPercentRange(true);

            if (isLongerLengthLongerThanMax) {
              rate = 1 - ((longerLength - model._maxOutputLongerLength) / longerLength);
              longerLength = model._maxOutputLongerLength;
              Math.round(shorterLength *= rate);

              isFirst = false;
              continue;

            }

            if (isShorterLengthLongerThanMax) {
              rate = 1 - ((shorterLength - model._maxOutputShorterLength) / shorterLength);
              shorterLength = model._maxOutputShorterLength;
              Math.round(longerLength *= rate);

              isFirst = false;
              continue;

            }

          } else {
            view.disableResizeImgPercentRange(true);
            break;

          }
          isFirst = false;

        }

        longerLengthName === 'width' ? (model._outputWidth = longerLength, model._outputHeight = shorterLength) : (model._outputWidth = shorterLength, model._outputHeight = longerLength);
        model._resizePercentage = Math.round(((model._outputWidth / model._imgWidth) + (model._outputHeight / model._imgHeight)) / 2 * 100);

        view.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);
        view.refreshResizeImgPercentRangeVal(model._resizePercentage);

      } else {
        model._outputWidth = Math.round(model._imgWidth * model._resizePercentage / 100);
        model._outputHeight = Math.round(model._imgHeight * model._resizePercentage / 100);

        view.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);
        view.disableResizeImgPercentRange(false);

      }

    },
    /**
     * 讀取圖片
     * 
     * @param {HTMLImageElement} imgElement 要顯示讀入圖片的 HTMLImageElement 元素
     * @param {Blob} imgFile input file 選取的檔案
     * @param {HTMLImageElement} imageEditor Cropper 編輯器所使用的 HTMLImageElement 元素
     */
    readImg: function (imgElement, imgFile, imageEditor) {
      new Promise(function (resolve, reject) {
        var fileReader = new FileReader();

        fileReader.addEventListener('load', function (event) {
          resolve(event.target.result);
        });

        fileReader.readAsDataURL(imgFile);

      }).then(function (dataUrl) {
        model._img = imgElement;
        model._img.src = dataUrl;
        model._imageEditor = imageEditor;

        model._imgFileName = imgFile.name;
        model._imgMIMEType = imgFile.type;
        model._imgFileSize = imgFile.size;
        model._imgWidth = model._img.naturalWidth;
        model._imgHeight = model._img.naturalHeight;
        model._updateResizePercentage();

        view.setImgToEditor(model._img);
        view.displayImgFileDetail({
          imgFileName: model._imgFileName,
          imgMIMEType: model._imgMIMEType,
          imgFileSizeKB: model._imgFileSize / 1024,
          imgWidth: model._imgWidth,
          imgHeight: model._imgHeight,
          croppedImgWidth: model._imgWidth,
          croppedImgHeight: model._imgHeight,
          imgOutputWidth: model._outputWidth,
          imgOutputHeight: model._outputHeight
        });

        model.closeCropper();

      });

    },
    /**
     * 下載編輯過的圖片
     */
    downloadImg: function () {
      var downloadUrl;
      var downloadLink = document.createElement('a');

      var tempCanvas = document.createElement('canvas');
      var tempCanvasContext = tempCanvas.getContext('2d');

      var imgClone = model._img.cloneNode();
      imgClone.width = model._outputWidth;
      imgClone.height = model._outputHeight;

      tempCanvas.width = imgClone.width;
      tempCanvas.height = imgClone.height;
      tempCanvasContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCanvasContext.drawImage(model._img, 0, 0, imgClone.width, imgClone.height);

      if (model._isGrayscale) {
        model._turnGrayscale(tempCanvasContext);

      }

      // quality > 93 時會 download failed，原因未知
      downloadUrl = tempCanvas.toDataURL(model._imgMIMEType, model._qualityRate);
      downloadLink.href = downloadUrl;
      downloadLink.download = 'edited_' + model._imgFileName;
      downloadLink.click();

    },
    /**
     * 將編輯過的圖片更新至負責顯示的 HTMLImageElement 元素
     */
    setEditedImgSrcToImg: function () {
      var croppedImgData = model._imgCropper.getCroppedCanvas();
      model._img.src = croppedImgData.toDataURL(model._imgMIMEType);

      model._imgWidth = model._img.naturalWidth;
      model._imgHeight = model._img.naturalHeight;
      model._outputWidth = Math.round(model._imgWidth * model._resizePercentage / 100);
      model._outputHeight = Math.round(model._imgHeight * model._resizePercentage / 100);

      view.setImgToEditor(model._img);
      view.refreshCroppedImgResolution(model._imgWidth, model._imgHeight);
      view.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);

      model.closeCropper();

    },
    /**
     * 重置 Cropper 編輯器
     */
    resetCropper: function () {
      model._imgCropper.reset();

    },
    /**
     * 關閉 Cropper 編輯器
     */
    closeCropper: function () {
      model._destroyCropper();
      model._bindImgToOpenEditor();

    },
    /**
     * 設定 resize 百分比數值
     * 
     * @param {number} resizePercentage resize 百分比數值
     */
    setResizePercentage: function (resizePercentage) {
      model._resizePercentage = resizePercentage;
      model._updateResizePercentage();

    },
    /**
     * 設定圖片輸出品質百分比數值
     * 
     * @param {number} qualityRate 圖片輸出品質百分比數值
     */
    setQualityRate: function (qualityRate) {
      model._qualityRate = qualityRate / 100;
      view.refreshQualityPercentage(Math.round(model._qualityRate * 100));

    },
    /**
     * 設定圖片是否輸出為灰階
     * 
     * @param {boolean} isGrayscale
     */
    setIsGrayscale: function (isGrayscale) {
      model._isGrayscale = isGrayscale;

    },
    /**
     * 設定圖片是否鎖定輸出解析度
     * 
     * @param {boolean} isResizeImgLock
     */
    setIsResizeImgLock: function (isResizeImgLock) {
      model._isResizeImgLock = isResizeImgLock;
      model._updateResizePercentage();

    }
  };

  var view = {
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
    setImgToEditor: function (imgElement) {
      view.imageEditor.src = imgElement.src;

    },
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

  var controller = {
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
      model.setIsGrayscale(isGrayscale.valueOf());

    },
    updateResizeImgLockFlag: function (isResizeImgLock) {
      model.setIsResizeImgLock(isResizeImgLock.valueOf());

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
      var isGrayscale = new Boolean(event.target.checked);
      controller.updateGrayscaleFlag(isGrayscale);

    });

    view.isResizeImgLockCheckBox.addEventListener('click', function (event) {
      var isResizeImgLock = new Boolean(event.target.checked);
      controller.updateResizeImgLockFlag(isResizeImgLock);

    });

  })();

});