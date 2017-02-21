import view from './view';

const model = {
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
  _turnGrayscale: canvasContext => {
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
  _destroyCropper: () => {
    view.hideImgEditor();

    if (model._imgCropper !== null) {
      console.log('editor close...')
      model._imgCropper.destroy();

    }

  },
  _bindImgToOpenEditor: () => {
    console.log('editor init...');
    // 先移除事件處理器，避免重複註冊
    model._img.removeEventListener('click', model._openEditorHandler);
    model._img.addEventListener('click', model._openEditorHandler);

  },
  _openEditorHandler: event => {
    console.log('editor open...');
    view.displayImgEditor();

    model._initImgEditor();

  },
  _initImgEditor: () => {
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
  _checkFileType: imgFile => {
    var fileType = imgFile.type;

    return /^image\/(jpe?g|png)$/i.test(fileType);

  },
  _updateResizePercentage: () => {
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
  _resetOrientation: function (srcBase64, srcOrientation, srcImgMIMEType) {
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
  readImg: function (imgElement, imgFile, imageEditor) {
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
          done: function (exifTags) {
            resolve(exifTags.Orientation);

          },
          fail: function (msg) {
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

      return new Promise(function (resolve, reject) {
        model._imageEditor = imageEditor;

        model._imageEditor.addEventListener('load', function imgLoadHandler(event) {
          resolve();

          event.target.removeEventListener('load', imgLoadHandler);

        });

        model._imageEditor.src = model._img.src;

      })

    }).then(function () {
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

      view.refreshCroppedImgResolution(model._imgWidth, model._imgHeight);
      view.refreshResizePercentageWidthHeight(model._resizePercentage, model._outputWidth, model._outputHeight);

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

export default model;