(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Ascender = factory());
}(this, (function () { 'use strict';

  var NATIVE_EVENTS = {
    CHANGE: 'change',
    CLICK: 'click',
    DRAG_START: 'dragstart',
    DRAG_END: 'dragend',
    DRAG_ENTER: 'dragenter',
    DRAG_LEAVE: 'dragleave',
    DRAG_OVER: 'dragover',
    DROP: 'drop'
  };

  var CUSTOM_EVENTS = {
    DESTROY: 'destroy',
    FILE_ADDED: 'file:added',
    FILES_ADDED: 'files:added'
  };

  function E() {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function on(name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    },

    once: function once(name, callback, ctx) {
      var self = this;
      function listener() {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },

    emit: function emit(name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },

    off: function off(name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
        }
      }

      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

      liveEvents.length ? e[name] = liveEvents : delete e[name];

      return this;
    }
  };

  var tinyEmitter = E;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var DEFAULT_OPTIONS = {
    multipleFiles: false,
    clickable: true,
    classes: {
      insideDropArea: 'asc-drop-area--inside'
    }

    /**
     * Makes an existing element a droppable area that fires events on drag 'n' drop of files.
     *
     * @class DropArea
     * @module DropArea
     * @extends Emitter
     */
  };
  var DropArea = function (_Emitter) {
    inherits(DropArea, _Emitter);

    /**
     * DropArea constructor.
     * @constructs DropArea
     * @param {HTMLElement} element - The desired element for drop area
     * @param {Object} options - Options for DropArea
     */
    function DropArea(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, DropArea);

      var _this = possibleConstructorReturn(this, (DropArea.__proto__ || Object.getPrototypeOf(DropArea)).call(this));

      if (!(element instanceof HTMLElement)) {
        throw new Error('[Ascender.DropArea] An HTMLElement must be passed to constructor');
      }

      _this.options = Object.assign({}, DEFAULT_OPTIONS, options);
      _this._element = element;

      _this._toggleListeners(true);
      _this._configureHiddenFileInput();
      return _this;
    }

    /**
     * Removes any listeners and logic bound to the DropArea instance.
     */


    createClass(DropArea, [{
      key: 'destroy',
      value: function destroy() {
        if (this._element) {
          this._toggleListeners(false);
          this.emit(CUSTOM_EVENTS.DESTROY);
        }
      }

      /**
       * An event delegator that calls the intended method based on event type.
       * @param {Event} event - The triggered event object
       */

    }, {
      key: 'handleEvent',
      value: function handleEvent(event) {
        if (!this._element.isSameNode(event.target) && !this._element.contains(event.target)) {
          return;
        }

        switch (event.type) {
          case NATIVE_EVENTS.CLICK:
            this._onClick();
            break;
          case NATIVE_EVENTS.DROP:
            event.preventDefault();
            this._onDrop(event);
            break;
          case NATIVE_EVENTS.DRAG_ENTER:
          case NATIVE_EVENTS.DRAG_OVER:
            event.preventDefault();
            this._onInsideDropArea();
            break;
          case NATIVE_EVENTS.DRAG_END:
          case NATIVE_EVENTS.DRAG_LEAVE:
            this._onOutsideDropArea();
            break;
        }

        this.emit(event.type, event);
      }

      /**
       * Toggles the listeners bound to the DropArea element.
       * @param {Boolean} toggle - The toggle: True will add listeners, false will remove.
       */

    }, {
      key: '_toggleListeners',
      value: function _toggleListeners(toggle) {
        var action = toggle ? 'addEventListener' : 'removeEventListener';

        this._element[action](NATIVE_EVENTS.CLICK, this);
        this._element[action](NATIVE_EVENTS.DRAG_START, this);
        this._element[action](NATIVE_EVENTS.DRAG_END, this);
        this._element[action](NATIVE_EVENTS.DRAG_ENTER, this);
        this._element[action](NATIVE_EVENTS.DRAG_LEAVE, this);

        // The following events need to be bound to the window to successfully prevent default actions
        window[action](NATIVE_EVENTS.DRAG_OVER, this);
        window[action](NATIVE_EVENTS.DROP, this);
      }

      /**
       * Adds a hidden file input within the DropArea for triggering file uploads on click
       */

    }, {
      key: '_configureHiddenFileInput',
      value: function _configureHiddenFileInput() {
        var _this2 = this;

        if (this._hiddenFileInput) {
          this._element.removeChild(this._hiddenFileInput);
        }

        var input = document.createElement('input');
        var styles = {
          position: 'absolute',
          opacity: 0,
          top: 0,
          left: 0,
          height: 0,
          width: 0
        };

        input.setAttribute('type', 'file');

        if (this.options.multipleFiles) {
          input.setAttribute('multiple', 'multiple');
        }

        input.addEventListener(NATIVE_EVENTS.CLICK, function (event) {
          // Stops the invoked file input click bubbling and triggering parent listeners
          event.stopPropagation();
        });
        input.addEventListener(NATIVE_EVENTS.CHANGE, function (event) {
          var files = input.files;


          _this2._onFilesAdded(files);
          _this2._configureHiddenFileInput();
        });

        Object.assign(input.style, styles);
        this._hiddenFileInput = input;
        this._element.appendChild(input);
      }

      /**
       * Handler for when a drag event occurs within the DropArea
       */

    }, {
      key: '_onInsideDropArea',
      value: function _onInsideDropArea() {
        this._element.classList.add(this.options.classes.insideDropArea);
      }

      /**
       * Handler for when a drag event occurs when leaving the DropArea
       */

    }, {
      key: '_onOutsideDropArea',
      value: function _onOutsideDropArea() {
        this._element.classList.remove(this.options.classes.insideDropArea);
      }

      /**
       * Handler for when a click event occurs within the DropArea
       */

    }, {
      key: '_onClick',
      value: function _onClick(event) {
        if (this.options.clickable && this._hiddenFileInput) {
          this._hiddenFileInput.click();
        }
      }

      /**
       * Handler for when a drop event occurs within the DropArea
       */

    }, {
      key: '_onDrop',
      value: function _onDrop(event) {
        if (event.dataTransfer && event.dataTransfer.files) {
          this._onFilesAdded(event.dataTransfer.files);
        }

        this._element.classList.remove(this.options.classes.insideDropArea);
      }

      /**
       * Handler for when a files are added after a Drop event
       */

    }, {
      key: '_onFilesAdded',
      value: function _onFilesAdded(files) {
        if (!files.length) {
          return;
        }

        // Only return one file, unless multiple files option set
        var filesToAdd = this.options.multipleFiles ? files : [files[0]];

        this.emit(CUSTOM_EVENTS.FILES_ADDED, filesToAdd);
      }
    }]);
    return DropArea;
  }(tinyEmitter);

  var DropFile = function () {
    /**
     * DropFile constructor.
     * @constructs DropFile
     * @param {File} file - The File object/blob to turn into internal
     */
    function DropFile(file) {
      classCallCheck(this, DropFile);

      this.data = file;
      this._dataUri = null;
    }

    /**
     * Gets the Data URI of the file
     * @return {Promise} A promise that resolves with the Data URI of file
     */


    createClass(DropFile, [{
      key: 'getDataUri',
      value: function getDataUri() {
        return this._dataUri ? Promise.resolve(this._dataUri) : this._createDataUri();
      }

      /**
       * Starts the async creation of the data URI
       * @private
       * @return {Promise} A promise that resolves with the Data URI of file
       */

    }, {
      key: '_createDataUri',
      value: function _createDataUri() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            resolve(reader.result);
          }, false);

          reader.addEventListener('error', function (err) {
            reject(err);
          }, false);

          reader.readAsDataURL(_this.data);
        });
      }
    }]);
    return DropFile;
  }();

  var Ascender = function (_Emitter) {
    inherits(Ascender, _Emitter);

    /**
     * Ascender constructor.
     * @constructs Ascender
     * @param {HTMLElement} element - The desired element for drop area
     * @param {Object} options - Options for ascender modules
     */
    function Ascender(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, Ascender);

      var _this = possibleConstructorReturn(this, (Ascender.__proto__ || Object.getPrototypeOf(Ascender)).call(this));

      _this.dropArea = new DropArea(element, options.dropArea);
      _this.files = [];

      _this._toggleListeners(true);
      return _this;
    }

    /**
     * Tidies up any listeners and logic created by Ascender
     */


    createClass(Ascender, [{
      key: 'destroy',
      value: function destroy() {
        if (this.dropArea) {
          this._toggleListeners(false);

          this.dropArea.destroy();
          this.dropArea = null;
        }

        this.emit(CUSTOM_EVENTS.DESTROY);
      }

      /**
       * Toggles the listeners created by Ascender
       * @private
       * @param {Boolean} toggle - The toggle: True will add listeners, false will remove.
       */

    }, {
      key: '_toggleListeners',
      value: function _toggleListeners(toggle) {
        var _this2 = this;

        var action = toggle ? 'on' : 'off';

        this.dropArea[action](CUSTOM_EVENTS.FILES_ADDED, function (files) {
          return _this2._onFilesAdded(files);
        });
      }

      /**
       * Handler for when files are added after a Drop event
       * @private
       * @param {FileList} files - Files added by the DropArea
       */

    }, {
      key: '_onFilesAdded',
      value: function _onFilesAdded(files) {
        var _this3 = this;

        files.forEach(function (file) {
          var fileToAdd = new DropFile(file);
          _this3.files.push(fileToAdd);
          _this3.emit(CUSTOM_EVENTS.FILE_ADDED, fileToAdd);
        });
      }
    }]);
    return Ascender;
  }(tinyEmitter);

  return Ascender;

})));
