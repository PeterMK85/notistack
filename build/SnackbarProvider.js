'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Slide = require('@material-ui/core/Slide');

var _Slide2 = _interopRequireDefault(_Slide);

var _SnackbarContext = require('./SnackbarContext');

var _SnackbarContext2 = _interopRequireDefault(_SnackbarContext);

var _constants = require('./utils/constants');

var _SnackbarItem = require('./SnackbarItem');

var _SnackbarItem2 = _interopRequireDefault(_SnackbarItem);

var _SnackbarContainer = require('./SnackbarContainer');

var _SnackbarContainer2 = _interopRequireDefault(_SnackbarContainer);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Omit SnackbarContainer class keys that are not needed for SnakcbarItem
 */
var getClasses = function getClasses(classes) {
    return Object.keys(classes).filter(function (key) {
        return !_constants.allClasses.container[key];
    }).reduce(function (obj, key) {
        return _extends({}, obj, _defineProperty({}, key, classes[key]));
    }, {});
};

var SnackbarProvider = function (_Component) {
    _inherits(SnackbarProvider, _Component);

    function SnackbarProvider(props) {
        _classCallCheck(this, SnackbarProvider);

        var _this = _possibleConstructorReturn(this, (SnackbarProvider.__proto__ || Object.getPrototypeOf(SnackbarProvider)).call(this, props));

        _this.queue = [];

        _this.componentWillUnmount = function () {
            _this.queue = [];
        };

        _this.handleEnqueueSnackbar = function (message) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var key = _ref.key,
                preventDuplicate = _ref.preventDuplicate,
                options = _objectWithoutProperties(_ref, ['key', 'preventDuplicate']);

            if (preventDuplicate || _this.props.preventDuplicate) {
                var inQueue = _this.queue.findIndex(function (item) {
                    return item.message === message;
                }) > -1;
                var inView = _this.state.snacks.findIndex(function (item) {
                    return item.message === message;
                }) > -1;
                if (inQueue || inView) {
                    return null;
                }
            }

            var id = key || new Date().getTime() + Math.random();
            var snack = _extends({
                key: id
            }, options, {
                open: true,
                message: message,
                anchorOrigin: options.anchorOrigin || _this.props.anchorOrigin
            });

            if (options.persist) {
                snack.autoHideDuration = undefined;
            }

            _this.queue.push(snack);
            _this.handleDisplaySnack();

            return id;
        };

        _this.handleDisplaySnack = function () {
            var maxSnack = _this.props.maxSnack;
            var snacks = _this.state.snacks;

            if (snacks.length >= maxSnack) {
                return _this.handleDismissOldest();
            }
            return _this.processQueue();
        };

        _this.processQueue = function () {
            if (_this.queue.length > 0) {
                var newOne = _this.queue.shift();
                _this.setState(function (_ref2) {
                    var snacks = _ref2.snacks;
                    return {
                        snacks: [].concat(_toConsumableArray(snacks), [newOne])
                    };
                });
            }
        };

        _this.handleDismissOldest = function () {
            var popped = false;
            var ignore = false;

            var persistentCount = _this.state.snacks.reduce(function (acc, current) {
                return acc + (current.open && current.persist ? 1 : 0);
            }, 0);

            if (persistentCount === _this.props.maxSnack) {
                (0, _warning2.default)(_constants.MESSAGES.NO_PERSIST_ALL);
                ignore = true;
            }

            _this.setState(function (_ref3) {
                var snacks = _ref3.snacks;
                return {
                    snacks: snacks.filter(function (item) {
                        return item.open === true;
                    }).map(function (item) {
                        if (!popped && (!item.persist || ignore)) {
                            popped = true;
                            if (item.onClose) item.onClose(null, 'maxsnack', item.key);
                            if (_this.props.onClose) _this.props.onClose(null, 'maxsnack', item.key);

                            return _extends({}, item, {
                                open: false
                            });
                        }

                        return _extends({}, item);
                    })
                };
            });
        };

        _this.handleCloseSnack = function (event, reason, key) {
            _this.setState(function (_ref4) {
                var snacks = _ref4.snacks;
                return {
                    snacks: snacks.map(function (item) {
                        return !key || item.key === key ? _extends({}, item, { open: false }) : _extends({}, item);
                    })
                };
            });

            if (_this.props.onClose) _this.props.onClose(event, reason, key);
        };

        _this.handleDismissSnack = function (key) {
            _this.handleCloseSnack(null, null, key);
        };

        _this.handleExitedSnack = function (event, key) {
            _this.setState(function (_ref5) {
                var snacks = _ref5.snacks;
                return {
                    snacks: snacks.filter(function (item) {
                        return item.key !== key;
                    })
                };
            }, _this.handleDisplaySnack);

            if (_this.props.onExited) _this.props.onExited(event, key);
        };

        _this.state = {
            snacks: [],
            contextValue: {
                handleEnqueueSnackbar: _this.handleEnqueueSnackbar,
                handleCloseSnackbar: _this.handleDismissSnack
            }
        };
        return _this;
    }

    /**
     * Adds a new snackbar to the queue to be presented.
     * @param {string} message - text of the notification
     * @param {object} options - additional options for the snackbar we want to enqueue.
     * We can pass Material-ui Snackbar props for individual customisation.
     * @param {string} options.key
     * @param {string} options.variant - type of the snackbar. default value is 'default'.
     * can be: (default, success, error, warning, info)
     * @param {bool} options.persist
     * @param {bool} options.preventDuplicate
     * @returns generated or user defined key referencing the new snackbar or null
     */


    /**
     * Display snack if there's space for it. Otherwise, immediately begin dismissing the
     * oldest message to start showing the new one.
     */


    /**
     * Display items (notifications) in the queue if there's space for them.
     */


    /**
     * Hide oldest snackbar on the screen because there exists a new one which we have to display.
     * (ignoring the one with 'persist' flag. i.e. explicitly told by user not to get dismissed).
     */


    /**
     * Hide a snackbar after its timeout.
     * @param {object} event - The event source of the callback
     * @param {string} reason - can be timeout or clickaway
     * @param {number} key - id of the snackbar we want to hide
     */


    /**
     * Close snackbar with the given key
     * @param {number} key - id of the snackbar we want to hide
     */


    /**
     * When we set open attribute of a snackbar to false (i.e. after we hide a snackbar),
     * it leaves the screen and immediately after leaving animation is done, this method
     * gets called. We remove the hidden snackbar from state and then display notifications
     * waiting in the queue (if any).
     * @param {number} key - id of the snackbar we want to remove
     * @param {object} event - The event source of the callback
     */


    _createClass(SnackbarProvider, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                classes = _props.classes,
                children = _props.children,
                maxSnack = _props.maxSnack,
                dense = _props.dense,
                container = _props.container,
                props = _objectWithoutProperties(_props, ['classes', 'children', 'maxSnack', 'dense', 'container']);

            var contextValue = this.state.contextValue;


            var categ = this.state.snacks.reduce(function (acc, current) {
                var category = (0, _constants.originKeyExtractor)(current.anchorOrigin);
                var existingOfCategory = acc[category] || [];
                return _extends({}, acc, _defineProperty({}, category, [].concat(_toConsumableArray(existingOfCategory), [current])));
            }, {});

            var iconVariant = Object.assign(_extends({}, _constants.defaultIconVariant), _extends({}, this.props.iconVariant));
            var notistackElements = Object.entries(categ).map(function (_ref6) {
                var _ref7 = _slicedToArray(_ref6, 2),
                    origin = _ref7[0],
                    snacks = _ref7[1];

                return _react2.default.createElement(
                    _SnackbarContainer2.default,
                    {
                        key: origin,
                        dense: dense,
                        anchorOrigin: snacks[0].anchorOrigin,
                        className: classes['containerAnchorOrigin' + origin]
                    },
                    snacks.map(function (snack) {
                        return _react2.default.createElement(_SnackbarItem2.default, _extends({}, props, {
                            key: snack.key,
                            dense: dense,
                            snack: snack,
                            iconVariant: iconVariant,
                            classes: getClasses(classes),
                            onClose: _this2.handleCloseSnack,
                            onExited: _this2.handleExitedSnack
                        }));
                    })
                );
            });

            return _react2.default.createElement(
                _SnackbarContext2.default.Provider,
                { value: contextValue },
                children,
                container ? (0, _reactDom.createPortal)(notistackElements, container) : notistackElements
            );
        }
    }]);

    return SnackbarProvider;
}(_react.Component);

SnackbarProvider.propTypes = {
    /**
     * Most of the time, this is your App. every component from this point onward
     * will be able to show snackbars.
     */
    children: _propTypes2.default.node.isRequired,
    /**
     * Override or extend the styles applied to the container component or Snackbars.
     */
    classes: _propTypes2.default.object,
    /**
     * Maximum snackbars that can be stacked on top of one another.
     */
    maxSnack: _propTypes2.default.number,
    /**
     * Denser margins for snackbars. Recommended to be used on mobile devices
     */
    dense: _propTypes2.default.bool,
    /**
     * Ignores displaying multiple snackbars with the same `message`
     */
    preventDuplicate: _propTypes2.default.bool,
    /**
     * Hides iconVariant if set to `true`.
     */
    hideIconVariant: _propTypes2.default.bool,
    /**
     * Little icon that is displayed at left corner of a snackbar.
     */
    iconVariant: _propTypes2.default.shape({
        /**
         * Icon displayed when variant of a snackbar is set to `success`.
         */
        success: _propTypes2.default.any,
        /**
         * Icon displayed when variant of a snackbar is set to `warning`.
         */
        warning: _propTypes2.default.any,
        /**
         * Icon displayed when variant of a snackbar is set to `error`.
         */
        error: _propTypes2.default.any,
        /**
         * Icon displayed when variant of a snackbar is set to `info`.
         */
        info: _propTypes2.default.any
    }),
    /**
     * Callback to get action(s). actions are mostly buttons displayed in Snackbar.
     * @param {string|number} key key of a snackbar
     */
    action: _propTypes2.default.func,
    /**
     * The anchor of the `Snackbar`.
     */
    anchorOrigin: _propTypes2.default.shape({
        horizontal: _propTypes2.default.oneOf(['left', 'center', 'right']).isRequired,
        vertical: _propTypes2.default.oneOf(['top', 'bottom']).isRequired
    }),
    /**
     * The number of milliseconds to wait before automatically calling the
     * `onClose` function. `onClose` should then set the state of the `open`
     * prop to hide the Snackbar. This behavior is disabled by default with
     * the `null` value.
     */
    autoHideDuration: _propTypes2.default.number,
    /**
     * If `true`, the `autoHideDuration` timer will expire even if the window is not focused.
     */
    disableWindowBlurListener: _propTypes2.default.bool,
    /**
     * Callback fired when the component requests to be closed.
     * The `reason` parameter can optionally be used to control the response to `onClose`,
     * for example ignoring `clickaway`.
     *
     * @param {object} event The event source of the callback
     * @param {string} reason Can be:`"timeout"` (`autoHideDuration` expired) or: `"clickaway"`
     *  or: `"maxsnack"` (snackbar is closed because `maxSnack` has reached.)
     * @param {string|number} key key of a Snackbar
     */
    onClose: _propTypes2.default.func,
    /**
     * Callback fired before the transition is entering.
     */
    onEnter: _propTypes2.default.func,
    /**
     * Callback fired when the transition has entered.
     */
    onEntered: _propTypes2.default.func,
    /**
     * Callback fired when the transition is entering.
     */
    onEntering: _propTypes2.default.func,
    /**
     * Callback fired before the transition is exiting.
     */
    onExit: _propTypes2.default.func,
    /**
     * Callback fired when the transition has exited.
     */
    onExited: _propTypes2.default.func,
    /**
     * Callback fired when the transition is exiting.
     */
    onExiting: _propTypes2.default.func,
    /**
     * The number of milliseconds to wait before dismissing after user interaction.
     * If `autoHideDuration` property isn't specified, it does nothing.
     * If `autoHideDuration` property is specified but `resumeHideDuration` isn't,
     * we default to `autoHideDuration / 2` ms.
     */
    resumeHideDuration: _propTypes2.default.number,
    /**
     * The component used for the transition.
     */
    TransitionComponent: _propTypes2.default.elementType,
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     */
    transitionDuration: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({ enter: _propTypes2.default.number, exit: _propTypes2.default.number })]),
    /**
     * Valid and exist HTML Node element, used to target `React.createPortal`
     */
    container: _propTypes2.default.instanceOf(Element)
};

SnackbarProvider.defaultProps = {
    maxSnack: 3,
    dense: false,
    preventDuplicate: false,
    hideIconVariant: false,
    classes: {},
    iconVariant: {},
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
    },
    autoHideDuration: 5000,
    TransitionComponent: _Slide2.default
};

exports.default = SnackbarProvider;