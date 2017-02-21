/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./controller.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = __webpack_require__("./model.js");

var _model2 = _interopRequireDefault(_model);

var _view = __webpack_require__("./view.js");

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {
  readSelectFile: function readSelectFile(imgFile) {
    _model2.default.readImg(_view2.default.imgPreviewArea, imgFile, _view2.default.imageEditor);
  },
  updateResizeImgPercent: function updateResizeImgPercent(resizeImgPercentVal) {
    var resizePercentage = Number.parseInt(resizeImgPercentVal);
    _model2.default.setResizePercentage(resizePercentage);
  },
  updateCompressionImgPercent: function updateCompressionImgPercent(compressionImgPercentVal) {
    var qualityRate = Number.parseInt(compressionImgPercentVal);
    _model2.default.setQualityRate(qualityRate);
  },
  updateGrayscaleFlag: function updateGrayscaleFlag(isGrayscale) {
    _model2.default.setIsGrayscale(isGrayscale);
  },
  updateResizeImgLockFlag: function updateResizeImgLockFlag(isResizeImgLock) {
    _model2.default.setIsResizeImgLock(isResizeImgLock);
  },
  getImgFile: function getImgFile() {
    _model2.default.downloadImg();
  },
  cropImg: function cropImg() {
    _model2.default.setEditedImgSrcToImg();
  },
  resetCrop: function resetCrop() {
    _model2.default.resetCropper();
  },
  closeCrop: function closeCrop() {
    _model2.default.closeCropper();
  }
};

exports.default = controller;

/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _view = __webpack_require__("./view.js");

var _view2 = _interopRequireDefault(_view);

var _controller = __webpack_require__("./controller.js");

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('DOMContentLoaded', function () {
  (function pageInit() {
    _view2.default.chooseFileInput.addEventListener('change', function (event) {
      var fileList = event.target.files;

      if (fileList.length > 0) {
        var file = fileList[0];
        _controller2.default.readSelectFile(file);
      }
    });

    _view2.default.resizeImgPercentRange.addEventListener('input', function (event) {
      var value = event.target.value;
      _controller2.default.updateResizeImgPercent(value);
    });

    _view2.default.qualityPercentRange.addEventListener('input', function (event) {
      var value = event.target.value;
      _controller2.default.updateCompressionImgPercent(value);
    });

    _view2.default.outputFileBtn.addEventListener('click', function () {
      _controller2.default.getImgFile();
    });

    _view2.default.cropBtn.addEventListener('click', function () {
      _controller2.default.cropImg();
    });

    _view2.default.resetBtn.addEventListener('click', function () {
      _controller2.default.resetCrop();
    });

    _view2.default.cancelBtn.addEventListener('click', function () {
      _controller2.default.closeCrop();
    });

    _view2.default.isGrayscaleCheckBox.addEventListener('change', function (event) {
      var isGrayscale = event.target.checked;
      _controller2.default.updateGrayscaleFlag(isGrayscale);
    });

    _view2.default.isResizeImgLockCheckBox.addEventListener('click', function (event) {
      var isResizeImgLock = event.target.checked;
      _controller2.default.updateResizeImgLockFlag(isResizeImgLock);
    });
  })();
});

/***/ }),

/***/ "./model.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _view = __webpack_require__("./view.js");

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  _turnGrayscale: function _turnGrayscale(canvasContext) {
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
  _destroyCropper: function _destroyCropper() {
    _view2.default.hideImgEditor();

    if (model._imgCropper !== null) {
      console.log('editor close...');
      model._imgCropper.destroy();
    }
  },
  _bindImgToOpenEditor: function _bindImgToOpenEditor() {
    console.log('editor init...');
    // 先移除事件處理器，避免重複註冊
    model._img.removeEventListener('click', model._openEditorHandler);
    model._img.addEventListener('click', model._openEditorHandler);
  },
  _openEditorHandler: function _openEditorHandler(event) {
    console.log('editor open...');
    _view2.default.displayImgEditor();

    model._initImgEditor();
  },
  _initImgEditor: function _initImgEditor() {
    model._imgCropper = new Cropper(model._imageEditor, {
      movable: false,
      // zoomable: false,
      rotatable: false,
      scalable: false
    });
  },
  _checkFileType: function _checkFileType(imgFile) {
    var fileType = imgFile.type;

    return (/^image\/(jpe?g|png)$/i.test(fileType)
    );
  },
  _updateResizePercentage: function _updateResizePercentage() {
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
          isFirst && _view2.default.disableResizeImgPercentRange(true);

          if (isLongerLengthLongerThanMax) {
            rate = 1 - (longerLength - model._maxOutputLongerLength) / longerLength;
            longerLength = model._maxOutputLongerLength;
            Math.round(shorterLength *= rate);

            isFirst = false;
            continue;
          }

          if (isShorterLengthLongerThanMax) {
            rate = 1 - (shorterLength - model._maxOutputShorterLength) / shorterLength;
            shorterLength = model._maxOutputShorterLength;
            Math.round(longerLength *= rate);

            isFirst = false;
            continue;
          }
        } else {
          _view2.default.disableResizeImgPercentRange(true);
          break;
        }
        isFirst = false;
      }

      longerLengthName === 'width' ? (model._outputWidth = longerLength, model._outputHeight = shorterLength) : (model._outputWidth = shorterLength, model._outputHeight = longerLength);
      model._resizePercentage = Math.round((model._outputWidth / model._imgWidth + model._outputHeight / model._imgHeight) / 2 * 100);

      _view2.default.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);
      _view2.default.refreshResizeImgPercentRangeVal(model._resizePercentage);
    } else {
      model._outputWidth = Math.round(model._imgWidth * model._resizePercentage / 100);
      model._outputHeight = Math.round(model._imgHeight * model._resizePercentage / 100);

      _view2.default.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);
      _view2.default.disableResizeImgPercentRange(false);
    }
  },
  _resetOrientation: function _resetOrientation(srcBase64, srcOrientation, srcImgMIMEType) {
    return new Promise(function (resolve, reject) {
      var tempImg = new Image();

      tempImg.addEventListener('load', function () {
        var width = tempImg.naturalWidth;
        var height = tempImg.naturalHeight;

        var tempCanvas = document.createElement('canvas');
        var tempCanvasContext = tempCanvas.getContext("2d");

        if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
          tempCanvas.width = height;
          tempCanvas.height = width;
        } else {
          tempCanvas.width = width;
          tempCanvas.height = height;
        }

        switch (srcOrientation) {
          case 2:
            tempCanvasContext.transform(-1, 0, 0, 1, width, 0);
            break;

          case 3:
            tempCanvasContext.transform(-1, 0, 0, -1, width, height);
            break;

          case 4:
            tempCanvasContext.transform(1, 0, 0, -1, 0, height);
            break;

          case 5:
            tempCanvasContext.transform(0, 1, 1, 0, 0, 0);
            break;

          case 6:
            tempCanvasContext.transform(0, 1, -1, 0, height, 0);
            break;

          case 7:
            tempCanvasContext.transform(0, -1, -1, 0, height, width);
            break;

          case 8:
            tempCanvasContext.transform(0, -1, 1, 0, 0, width);
            break;

          default:
            tempCanvasContext.transform(1, 0, 0, 1, 0, 0);

        }

        tempCanvasContext.drawImage(tempImg, 0, 0);

        resolve(tempCanvas.toDataURL(srcImgMIMEType));
      });

      tempImg.src = srcBase64;
    });
  },
  /**
   * 讀取圖片
   * 
   * @param {HTMLImageElement} imgElement 要顯示讀入圖片的 HTMLImageElement 元素
   * @param {Blob} imgFile input file 選取的檔案
   * @param {HTMLImageElement} imageEditor Cropper 編輯器所使用的 HTMLImageElement 元素
   */
  readImg: function readImg(imgElement, imgFile, imageEditor) {
    if (!model._checkFileType(imgFile)) {
      alert('Invalid image type.');
      return;
    }

    new Promise(function (resolve, reject) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (event) {
        resolve(event.target.result);
      });

      fileReader.readAsDataURL(imgFile);
    }).then(function (dataUrl) {
      return new Promise(function (resolve, reject) {
        new Exif(dataUrl, {
          exif: true,
          done: function done(exifTags) {
            resolve(exifTags.Orientation);
          },
          fail: function fail(msg) {
            reject(msg);
          }
        });
      }).then(function (orientation) {
        return model._resetOrientation(dataUrl, orientation, imgFile.type);
      }).catch(function (msg) {
        console.log(msg);
        return Promise.resolve(dataUrl);
      });
    }).then(function (dataUrlAfterRotated) {
      return new Promise(function (resolve, reject) {
        model._img = imgElement;

        model._img.addEventListener('load', function imgLoadHandler(event) {
          resolve();

          event.target.removeEventListener('load', imgLoadHandler);
        });

        model._img.src = dataUrlAfterRotated;
      });
    }).then(function () {
      model._imgFileName = imgFile.name;
      model._imgMIMEType = imgFile.type;
      model._imgFileSize = imgFile.size;
      model._imgWidth = model._img.naturalWidth;
      model._imgHeight = model._img.naturalHeight;
      model._updateResizePercentage();

      _view2.default.displayImgFileDetail({
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

      return new Promise(function (resolve, reject) {
        model._imageEditor = imageEditor;

        model._imageEditor.addEventListener('load', function imgLoadHandler(event) {
          resolve();

          event.target.removeEventListener('load', imgLoadHandler);
        });

        model._imageEditor.src = model._img.src;
      });
    }).then(function () {
      model.closeCropper();
    });
  },
  /**
   * 下載編輯過的圖片
   */
  downloadImg: function downloadImg() {
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
  setEditedImgSrcToImg: function setEditedImgSrcToImg() {
    new Promise(function (resolve, reject) {
      var croppedImgData = model._imgCropper.getCroppedCanvas();

      model._img.addEventListener('load', function imgLoadHandler(event) {
        resolve();

        event.target.removeEventListener('load', imgLoadHandler);
      });

      model._img.src = croppedImgData.toDataURL(model._imgMIMEType);
    }).then(function () {
      model._imgWidth = model._img.naturalWidth;
      model._imgHeight = model._img.naturalHeight;
      model._outputWidth = Math.round(model._imgWidth * model._resizePercentage / 100);
      model._outputHeight = Math.round(model._imgHeight * model._resizePercentage / 100);

      _view2.default.refreshCroppedImgResolution(model._imgWidth, model._imgHeight);
      _view2.default.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);

      return new Promise(function (resolve, reject) {
        model._imageEditor.addEventListener('load', function imgLoadHandler(event) {
          resolve();

          event.target.removeEventListener('load', imgLoadHandler);
        });

        model._imageEditor.src = model._img.src;
      });
    }).then(function () {
      model.closeCropper();
    });
  },
  /**
   * 重置 Cropper 編輯器
   */
  resetCropper: function resetCropper() {
    model._imgCropper.reset();
  },
  /**
   * 關閉 Cropper 編輯器
   */
  closeCropper: function closeCropper() {
    model._destroyCropper();
    model._bindImgToOpenEditor();
  },
  /**
   * 設定 resize 百分比數值
   * 
   * @param {number} resizePercentage resize 百分比數值
   */
  setResizePercentage: function setResizePercentage(resizePercentage) {
    model._resizePercentage = resizePercentage;
    model._updateResizePercentage();
  },
  /**
   * 設定圖片輸出品質百分比數值
   * 
   * @param {number} qualityRate 圖片輸出品質百分比數值
   */
  setQualityRate: function setQualityRate(qualityRate) {
    model._qualityRate = qualityRate / 100;
    _view2.default.refreshQualityPercentage(Math.round(model._qualityRate * 100));
  },
  /**
   * 設定圖片是否輸出為灰階
   * 
   * @param {boolean} isGrayscale
   */
  setIsGrayscale: function setIsGrayscale(isGrayscale) {
    model._isGrayscale = isGrayscale;
  },
  /**
   * 設定圖片是否鎖定輸出解析度
   * 
   * @param {boolean} isResizeImgLock
   */
  setIsResizeImgLock: function setIsResizeImgLock(isResizeImgLock) {
    model._isResizeImgLock = isResizeImgLock;
    model._updateResizePercentage();
  }
};

exports.default = model;

/***/ }),

/***/ "./view.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  displayImgFileDetail: function displayImgFileDetail(imgDetailData) {
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
  refreshCroppedImgResolution: function refreshCroppedImgResolution(croppedImgWidth, croppedImgHeight) {
    view.croppedImgWidthTxt.textContent = croppedImgWidth;
    view.croppedImgHeightTxt.textContent = croppedImgHeight;
  },
  displayImgEditor: function displayImgEditor() {
    view.formArea.style.display = 'none';
    view.imgContainer.style.display = 'block';
  },
  hideImgEditor: function hideImgEditor() {
    formArea.style.display = 'block';
    imgContainer.style.display = 'none';
  },
  refreshResizePercentageWidthHeight: function refreshResizePercentageWidthHeight(resizePercentage, imgOutputWidth, imgOutputHeight) {
    view.resizeValTxt.textContent = resizePercentage;
    view.outputImgWidthTxt.textContent = imgOutputWidth;
    view.outputImgHeightTxt.textContent = imgOutputHeight;
  },
  refreshResizeImgPercentRangeVal: function refreshResizeImgPercentRangeVal(resizePercentage) {
    view.resizeImgPercentRange.value = resizePercentage;
  },
  refreshQualityPercentage: function refreshQualityPercentage(qualityPercentage) {
    view.qualityValTxt.textContent = qualityPercentage;
  },
  disableResizeImgPercentRange: function disableResizeImgPercentRange(isToDisable) {
    if (isToDisable) {
      view.resizeImgPercentRange.disabled = true;
    } else {
      view.resizeImgPercentRange.disabled = false;
    }
  }
};

exports.default = view;

/***/ })

/******/ });