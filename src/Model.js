import Exif from '@fengyuanchen/exif'
import Cropper from 'cropperjs'

const _view = Symbol('_view')
const _img = Symbol('_img')
const _imageEditor = Symbol('_imageEditor')
const _imgMIMEType = Symbol('_imgMIMEType')
const _imgFileSize = Symbol('_imgFileSize')
const _imgFileName = Symbol('_imgFileName')
const _imgWidth = Symbol('_imgWidth')
const _imgHeight = Symbol('_imgHeight')
const _outputWidth = Symbol('_outputWidth')
const _outputHeight = Symbol('_outputHeight')
const _maxOutputLongerLength = Symbol('_maxOutputLongerLength')
const _maxOutputShorterLength = Symbol('_maxOutputShorterLength')
const _resizePercentage = Symbol('_resizePercentage')
const _qualityRate = Symbol('_qualityRate')
const _isGrayscale = Symbol('_isGrayscale')
const _isResizeImgLock = Symbol('_isResizeImgLock')
const _imgCropper = Symbol('_imgCropper')
const _turnGrayscale = Symbol('_turnGrayscale')
const _destroyCropper = Symbol('_destroyCropper')
const _bindImgToOpenEditor = Symbol('_bindImgToOpenEditor')
const _openEditorHandler = Symbol('_openEditorHandler')
const _initImgEditor = Symbol('_initImgEditor')
const _checkFileType = Symbol('_checkFileType')
const _updateResizePercentage = Symbol('_updateResizePercentage')
const _resetOrientation = Symbol('_resetOrientation')
const _lastOpenEditorHandler = Symbol('_lastOpenEditorHandler')

class Model {
  constructor (view) {
    this[_view] = view

    this[_img] = null
    this[_imageEditor] = null
    this[_imgMIMEType] = ''
    this[_imgFileSize] = 0
    this[_imgFileName] = ''
    this[_imgWidth] = 0
    this[_imgHeight] = 0
    this[_outputWidth] = 0
    this[_outputHeight] = 0
    this[_maxOutputLongerLength] = 1600
    this[_maxOutputShorterLength] = 1200
    this[_resizePercentage] = 60
    this[_qualityRate] = 0.93
    this[_isGrayscale] = false
    this[_isResizeImgLock] = false
    this[_imgCropper] = null
    this[_lastOpenEditorHandler] = null
  }

  [_turnGrayscale] (canvasContext) {
    let tempImgData
    let tempData

    tempImgData = canvasContext.getImageData(0, 0, this[_outputWidth], this[_outputHeight])
    tempData = tempImgData.data

    for (let i = 0; i < tempData.length; i += 4) {
      const brightness = 0.34 * tempData[i] + 0.5 * tempData[i + 1] + 0.16 * tempData[i + 2]
      // red
      tempData[i] = brightness
      // green
      tempData[i + 1] = brightness
      // blue
      tempData[i + 2] = brightness
    }

    canvasContext.putImageData(tempImgData, 0, 0)
  }

  [_destroyCropper] () {
    this[_view].hideImgEditor()

    if (this[_imgCropper] !== null) {
      console.log('editor close...')
      this[_imgCropper].destroy()
    }
  }

  [_bindImgToOpenEditor] () {
    console.log('editor init...')

    if (this[_lastOpenEditorHandler] !== null) {
      // 先移除事件處理器，避免重複註冊
      this[_img].removeEventListener('click', this[_lastOpenEditorHandler])
    } else {
      this[_lastOpenEditorHandler] = this[_openEditorHandler]()
    }

    this[_img].addEventListener('click', this[_lastOpenEditorHandler])
  }

  [_openEditorHandler] () {
    return event => {
      console.log('editor open...')
      this[_view].displayImgEditor()

      this[_initImgEditor]()
    }
  }

  [_initImgEditor] () {
    this[_imgCropper] = new Cropper(this[_imageEditor], {
      movable: false,
      // zoomable: false,
      rotatable: false,
      scalable: false
      /*
      crop: function (event) {
         console.log('x = ' + event.detail.x)
         console.log('y = ' + event.detail.y)
         console.log('width = ' + event.detail.width)
         console.log('height = ' + event.detail.height)
         console.log('rotate = ' + event.detail.rotate)
         console.log('scaleX = ' + event.detail.scaleX)
         console.log('scaleY = ' + event.detail.scaleY)
       }
       */
    })
  }

  [_checkFileType] (imgFile) {
    const fileType = imgFile.type

    return /^image\/(jpe?g|png)$/i.test(fileType)
  }

  [_updateResizePercentage] () {
    if (this[_isResizeImgLock]) {
      let longerLength
      let shorterLength
      let longerLengthName

      let isLongerLengthLongerThanMax
      let isShorterLengthLongerThanMax

      let rate

      if (this[_imgWidth] > this[_imgHeight]) {
        longerLength = this[_imgWidth]
        shorterLength = this[_imgHeight]
        longerLengthName = 'width'
      } else {
        longerLength = this[_imgHeight]
        shorterLength = this[_imgWidth]
        longerLengthName = 'height'
      }

      let isFirst = true
      while (true) {
        isLongerLengthLongerThanMax = longerLength > this[_maxOutputLongerLength]
        isShorterLengthLongerThanMax = shorterLength > this[_maxOutputShorterLength]

        if (isLongerLengthLongerThanMax || isShorterLengthLongerThanMax) {
          isFirst && this[_view].disableResizeImgPercentRange(true)

          if (isLongerLengthLongerThanMax) {
            rate = 1 - ((longerLength - this[_maxOutputLongerLength]) / longerLength)
            longerLength = this[_maxOutputLongerLength]
            Math.round(shorterLength *= rate)

            isFirst = false
            continue
          }

          if (isShorterLengthLongerThanMax) {
            rate = 1 - ((shorterLength - this[_maxOutputShorterLength]) / shorterLength)
            shorterLength = this[_maxOutputShorterLength]
            Math.round(longerLength *= rate)

            isFirst = false
            continue
          }
        } else {
          this[_view].disableResizeImgPercentRange(true)
          break
        }
        isFirst = false
      }

      if (longerLengthName === 'width') {
        this[_outputWidth] = longerLength
        this[_outputHeight] = shorterLength
      } else {
        this[_outputWidth] = shorterLength
        this[_outputHeight] = longerLength
      }

      this[_resizePercentage] = Math.round(((this[_outputWidth] / this[_imgWidth]) + (this[_outputHeight] / this[_imgHeight])) / 2 * 100)

      this[_view].refreshResizePercentageWidthHeight(this[_resizePercentage], this[_outputWidth], this[_outputHeight])
      this[_view].refreshResizeImgPercentRangeVal(this[_resizePercentage])
    } else {
      this[_outputWidth] = Math.round(this[_imgWidth] * this[_resizePercentage] / 100)
      this[_outputHeight] = Math.round(this[_imgHeight] * this[_resizePercentage] / 100)

      this[_view].refreshResizePercentageWidthHeight(this[_resizePercentage], this[_outputWidth], this[_outputHeight])
      this[_view].disableResizeImgPercentRange(false)
    }
  }

  [_resetOrientation] (srcBase64, srcOrientation, srcImgMIMEType) {
    return new Promise((resolve, reject) => {
      const tempImg = new window.Image()

      tempImg.addEventListener('load', () => {
        const width = tempImg.naturalWidth
        const height = tempImg.naturalHeight

        const tempCanvas = document.createElement('canvas')
        const tempCanvasContext = tempCanvas.getContext('2d')

        if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
          tempCanvas.width = height
          tempCanvas.height = width
        } else {
          tempCanvas.width = width
          tempCanvas.height = height
        }

        switch (srcOrientation) {
          case 2:
            tempCanvasContext.transform(-1, 0, 0, 1, width, 0)
            break

          case 3:
            tempCanvasContext.transform(-1, 0, 0, -1, width, height)
            break

          case 4:
            tempCanvasContext.transform(1, 0, 0, -1, 0, height)
            break

          case 5:
            tempCanvasContext.transform(0, 1, 1, 0, 0, 0)
            break

          case 6:
            tempCanvasContext.transform(0, 1, -1, 0, height, 0)
            break

          case 7:
            tempCanvasContext.transform(0, -1, -1, 0, height, width)
            break

          case 8:
            tempCanvasContext.transform(0, -1, 1, 0, 0, width)
            break

          default:
            tempCanvasContext.transform(1, 0, 0, 1, 0, 0)
        }

        tempCanvasContext.drawImage(tempImg, 0, 0)

        resolve(tempCanvas.toDataURL(srcImgMIMEType))
      })

      tempImg.src = srcBase64
    })
  }

  /**
   * 讀取圖片
   *
   * @param {HTMLImageElement} imgElement 要顯示讀入圖片的 HTMLImageElement 元素
   * @param {Blob} imgFile input file 選取的檔案
   * @param {HTMLImageElement} imageEditor Cropper 編輯器所使用的 HTMLImageElement 元素
   */
  readImg (imgElement, imgFile, imageEditor) {
    if (!this[_checkFileType](imgFile)) {
      window.alert('Invalid image type.')
      return
    }

    new Promise((resolve, reject) => {
      const fileReader = new window.FileReader()

      fileReader.addEventListener('load', event => {
        resolve(event.target.result)
      })

      fileReader.readAsDataURL(imgFile)
    }).then(dataUrl => {
      return new Promise((resolve, reject) => {
        const initExif = () => {
          return new Exif(dataUrl, {
            exif: true,
            done (exifTags) {
              resolve(exifTags.Orientation)
            },
            fail (msg) {
              reject(msg)
            }
          })
        }

        initExif()
      }).then(orientation => {
        return this[_resetOrientation](dataUrl, orientation, imgFile.type)
      }).catch(msg => {
        console.log(msg)
        return Promise.resolve(dataUrl)
      })
    }).then(dataUrlAfterRotated => {
      return new Promise((resolve, reject) => {
        this[_img] = imgElement

        this[_img].addEventListener('load', function imgLoadHandler (event) {
          resolve()

          event.target.removeEventListener('load', imgLoadHandler)
        })

        this[_img].src = dataUrlAfterRotated
      })
    }).then(() => {
      this[_imgFileName] = imgFile.name
      this[_imgMIMEType] = imgFile.type
      this[_imgFileSize] = imgFile.size
      this[_imgWidth] = this[_img].naturalWidth
      this[_imgHeight] = this[_img].naturalHeight
      this[_updateResizePercentage]()

      const model = this

      this[_view].displayImgFileDetail({
        imgFileName: model[_imgFileName],
        imgMIMEType: model[_imgMIMEType],
        imgFileSizeKB: model[_imgFileSize] / 1024,
        imgWidth: model[_imgWidth],
        imgHeight: model[_imgHeight],
        croppedImgWidth: model[_imgWidth],
        croppedImgHeight: model[_imgHeight],
        imgOutputWidth: model[_outputWidth],
        imgOutputHeight: model[_outputHeight]
      })

      return new Promise((resolve, reject) => {
        this[_imageEditor] = imageEditor

        this[_imageEditor].addEventListener('load', function imgLoadHandler (event) {
          resolve()

          event.target.removeEventListener('load', imgLoadHandler)
        })

        this[_imageEditor].src = this[_img].src
      })
    }).then(() => {
      this.closeCropper()
    })
  }

  /**
   * 下載編輯過的圖片
   */
  downloadImg () {
    let downloadUrl
    const downloadLink = document.createElement('a')

    const tempCanvas = document.createElement('canvas')
    const tempCanvasContext = tempCanvas.getContext('2d')

    const imgClone = this[_img].cloneNode()
    imgClone.width = this[_outputWidth]
    imgClone.height = this[_outputHeight]

    tempCanvas.width = imgClone.width
    tempCanvas.height = imgClone.height
    tempCanvasContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempCanvasContext.drawImage(this[_img], 0, 0, imgClone.width, imgClone.height)

    if (this[_isGrayscale]) {
      this[_turnGrayscale](tempCanvasContext)
    }

    // quality > 93 時會 download failed，原因未知
    downloadUrl = tempCanvas.toDataURL(this[_imgMIMEType], this[_qualityRate])
    downloadLink.href = downloadUrl
    downloadLink.download = `edited_${this[_imgFileName]}`
    downloadLink.click()
  }

  /**
   * 將編輯過的圖片更新至負責顯示的 HTMLImageElement 元素
   */
  setEditedImgSrcToImg () {
    new Promise((resolve, reject) => {
      const croppedImgData = this[_imgCropper].getCroppedCanvas()

      this[_img].addEventListener('load', function imgLoadHandler (event) {
        resolve()

        event.target.removeEventListener('load', imgLoadHandler)
      })

      this[_img].src = croppedImgData.toDataURL(this[_imgMIMEType])
    }).then(() => {
      this[_imgWidth] = this[_img].naturalWidth
      this[_imgHeight] = this[_img].naturalHeight
      this[_outputWidth] = Math.round(this[_imgWidth] * this[_resizePercentage] / 100)
      this[_outputHeight] = Math.round(this[_imgHeight] * this[_resizePercentage] / 100)

      this[_view].refreshCroppedImgResolution(this[_imgWidth], this[_imgHeight])
      this[_view].refreshResizePercentageWidthHeight(this[_resizePercentage], this[_outputWidth], this[_outputHeight])

      return new Promise((resolve, reject) => {
        this[_imageEditor].addEventListener('load', function imgLoadHandler (event) {
          resolve()

          event.target.removeEventListener('load', imgLoadHandler)
        })

        this[_imageEditor].src = this[_img].src
      })
    }).then(() => {
      this.closeCropper()
    })
  }

  /**
   * 重置 Cropper 編輯器
   */
  resetCropper () {
    this[_imgCropper].reset()
  }

  /**
   * 關閉 Cropper 編輯器
   */
  closeCropper () {
    this[_destroyCropper]()
    this[_bindImgToOpenEditor]()
  }

  /**
   * 設定 resize 百分比數值
   *
   * @param {number} resizePercentage resize 百分比數值
   */
  setResizePercentage (resizePercentage) {
    this[_resizePercentage] = resizePercentage
    this[_updateResizePercentage]()
  }

  /**
   * 設定圖片輸出品質百分比數值
   *
   * @param {number} qualityRate 圖片輸出品質百分比數值
   */
  setQualityRate (qualityRate) {
    this[_qualityRate] = qualityRate / 100
    this[_view].refreshQualityPercentage(Math.round(this[_qualityRate] * 100))
  }

  /**
   * 設定圖片是否輸出為灰階
   *
   * @param {boolean} isGrayscale
   */
  setIsGrayscale (isGrayscale) {
    this[_isGrayscale] = isGrayscale
  }

  /**
   * 設定圖片是否鎖定輸出解析度
   *
   * @param {boolean} isResizeImgLock
   */
  setIsResizeImgLock (isResizeImgLock) {
    this[_isResizeImgLock] = isResizeImgLock
    this[_updateResizePercentage]()
  }
}

export default Model
