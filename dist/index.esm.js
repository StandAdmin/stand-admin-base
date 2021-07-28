import React, {
  useRef,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useState,
  Fragment,
} from 'react';
import 'antd/es/notification/style';
import 'antd/es/modal/style';
import 'antd/es/tag/style';
import 'antd/es/button/style';
import 'antd/es/pagination/style';
import 'antd/es/empty/style';
import 'antd/es/spin/style';
import 'antd/es/message/style';
import 'antd/es/form/style';
import 'antd/es/tooltip/style';
import 'antd/es/popconfirm/style';
import 'antd/es/table/style';
import 'antd/es/input/style';
import {
  Modal,
  notification,
  Spin,
  message,
  Empty,
  Pagination,
  Button,
  Tag,
  Table,
  Popconfirm,
  Form,
  Input,
  Tooltip,
} from 'antd';
import {
  merge,
  get,
  cloneDeepWith,
  isEqual,
  uniqWith,
  pullAll,
  memoize,
  omit,
  debounce,
  pick,
  omitBy,
  pickBy,
  set,
  identity as identity$1,
  isMatch,
  isEmpty,
} from 'lodash';
import {
  LoadingOutlined,
  PlusCircleOutlined,
  HistoryOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { stringify, parse } from 'query-string';
import moment from 'moment';
import Localforage from 'localforage';

var globalConfig = {
  getDvaApp: function getDvaApp() {
    throw new Error('getDvaApp not set in Config');
  },
  getHistory: function getHistory() {
    throw new Error('getHistory not set in Config');
  },
  getConnect: function getConnect() {
    throw new Error('getConnect not set in Config');
  },
};
function getConfig() {
  return globalConfig;
}
function setConfig(config) {
  Object.assign(globalConfig, config);
  return globalConfig;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }

  return target;
}

function _typeof(obj) {
  '@babel/helpers - typeof';

  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true,
    },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;

  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function() {}),
    );
    return true;
  } catch (e) {
    return false;
  }
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === 'object' || typeof call === 'function')) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (
    (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) ||
    iter['@@iterator'] != null
  )
    return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr &&
    ((typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
      arr['@@iterator']);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

var StandContext = /*#__PURE__*/ React.createContext({});
var ConfigLoadMethod = 'loadConfig';
var ConfigUpdateMethod = 'updateConfig';
var StateParamPrefix = '_zstate_';
var ConfigLoadingFld = '_stdadm_config_loading_';
var ModelNsPre = '_StdAdmMod_';

function getAutoIdGenerator() {
  var base =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var baseId = base;
  return function() {
    baseId += 1;
    return baseId;
  };
}
function markAndMatch() {
  var markMap = {};
  var getAutoId = getAutoIdGenerator();
  return function(tag) {
    var newTag = getAutoId();
    markMap[tag] = newTag;
    return [
      function() {
        return newTag === markMap[tag];
      },
      newTag,
    ];
  };
}
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var warnLevel = 2;
var errorLevel = 4;
var infoLevel = 1;
var logLevel = 0;
function closeLog() {
  logLevel = 0;
}
function openLog() {
  var level =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : warnLevel | errorLevel | infoLevel;
  logLevel = level;
}
function logInfo() {
  if ((infoLevel & logLevel) === infoLevel) {
    var _console;

    (_console = console).log.apply(_console, arguments);
  }
}
function logWarn() {
  if ((warnLevel & logLevel) === warnLevel) {
    var _console2;

    (_console2 = console).warn.apply(_console2, arguments);
  }
}

var getAutoId = getAutoIdGenerator();

function delayP(ms) {
  var val =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return new Promise(function(resolve) {
    setTimeout(resolve, ms, val);
  });
}

var emptySearchRecords = /*#__PURE__*/ (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              return _context.abrupt('return', {
                success: true,
                data: {},
              });

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    }),
  );

  return function emptySearchRecords() {
    return _ref.apply(this, arguments);
  };
})(); // const localforage = Localforage.createInstance({
//   name: 'StandModel',
// });

var isFunction = function isFunction(f) {
  return typeof f === 'function';
};

function convertParamsName(params, nameMap) {
  if (!params) {
    return params;
  }

  var newParams = {};
  Object.keys(params).forEach(function(key) {
    newParams[nameMap[key] || key] = params[key];
  });
  return newParams;
}

function getFirstNotEmptyVal(obj, key, pathList) {
  if (!pathList) {
    throw new Error('pathList is Empty!');
  }

  var list = Array.isArray(pathList) ? pathList : [pathList];

  for (var i = 0, len = list.length; i < len; i += 1) {
    var fldPath = list[i];
    var val =
      typeof fldPath === 'string' ? get(obj, fldPath) : fldPath(obj, key);

    if (val) {
      return val;
    }
  }

  return undefined;
}

var defaultErrorMsgFields = ['message', 'msg', 'resultMsg'];
var defaultPermissionApplyUrlFields = ['permissionApplyUrl'];
function handleCommonRespError(requestTitle, response) {
  var _ref2 =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$errorTitle = _ref2.errorTitle,
    errorTitle =
      _ref2$errorTitle === void 0 ? '接口请求失败' : _ref2$errorTitle,
    _ref2$errorMsgFields = _ref2.errorMsgFields,
    errorMsgFields =
      _ref2$errorMsgFields === void 0
        ? defaultErrorMsgFields
        : _ref2$errorMsgFields,
    _ref2$permissionApply = _ref2.permissionApplyUrlFields,
    permissionApplyUrlFields =
      _ref2$permissionApply === void 0
        ? defaultPermissionApplyUrlFields
        : _ref2$permissionApply;

  if (!response || response.success) {
    return;
  }

  var errorContent = getFirstNotEmptyVal(response, 'errorMsg', errorMsgFields);
  var permissionApplyUrl = getFirstNotEmptyVal(
    response,
    'permissionApplyUrl',
    permissionApplyUrlFields,
  );

  if (permissionApplyUrl) {
    Modal.warning({
      title: errorContent,
      content: /*#__PURE__*/ React.createElement(
        'a',
        {
          href: permissionApplyUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        '\u7533\u8BF7\u6743\u9650',
      ),
    });
    return;
  }

  notification.error({
    message: ''.concat(requestTitle, ': ').concat(errorTitle),
    description: errorContent || JSON.stringify(response),
  });
}
function getStandModel(opts) {
  var _opts$idFieldName = opts.idFieldName,
    idFieldName = _opts$idFieldName === void 0 ? 'id' : _opts$idFieldName,
    _opts$nameFieldName = opts.nameFieldName,
    nameFieldName =
      _opts$nameFieldName === void 0 ? 'name' : _opts$nameFieldName,
    origFldsPathInResp = opts.fldsPathInResp,
    origSearchParamsMap = opts.searchParamsMap,
    _opts$StoreNs = opts.StoreNs,
    StoreNs =
      _opts$StoreNs === void 0 ? getAutoStoreNs('Record') : _opts$StoreNs,
    _opts$StoreNsTitle = opts.StoreNsTitle,
    StoreNsTitle = _opts$StoreNsTitle === void 0 ? '记录' : _opts$StoreNsTitle,
    _opts$searchRecords = opts.searchRecords,
    searchRecords =
      _opts$searchRecords === void 0 ? emptySearchRecords : _opts$searchRecords,
    _getRecord = opts.getRecord,
    _addRecord = opts.addRecord,
    _updateRecord = opts.updateRecord,
    _deleteRecord = opts.deleteRecord,
    extensions = opts.extensions;

  if (!StoreNs) {
    throw new Error('StoreNs should no be empty!');
  }

  var fldsPathInResp = _objectSpread2(
    {
      pageNum: 'data.pageNum',
      pageSize: 'data.pageSize',
      total: 'data.total',
      list: 'data.list',
      extraPayload: 'data.extraPayload',
      errorMsg: defaultErrorMsgFields,
      permissionApplyUrl: defaultPermissionApplyUrlFields,
    },
    origFldsPathInResp || undefined,
  );

  var searchParamsMap = _objectSpread2(
    {
      pageNum: 'pageNum',
      pageSize: 'pageSize',
    },
    origSearchParamsMap || undefined,
  ); // const LSKey_SearchParams = `${StoreNs}_searchParams`;

  var filterParams = function filterParams(params) {
    return convertParamsName(params, searchParamsMap);
  };

  var getCommonFlds = function getCommonFlds(resp) {
    var result = {};
    Object.keys(fldsPathInResp).forEach(function(key) {
      var val = getFirstNotEmptyVal(resp, key, fldsPathInResp[key]);

      if (val !== undefined) {
        result[key] = val;
      }
    });
    return result;
  };

  var handleRespError = function handleRespError(_ref3) {
    var response = _ref3.response,
      errorTitle = _ref3.errorTitle;
    handleCommonRespError(StoreNsTitle, response, {
      errorTitle: errorTitle,
      errorMsgFields: fldsPathInResp.errorMsg,
      permissionApplyUrlFields: fldsPathInResp.permissionApplyUrl,
    });
  };

  var markTag = markAndMatch();
  var interModel = {
    namespace: StoreNs,
    state: {
      mountId: null,
      idFieldName: idFieldName,
      nameFieldName: nameFieldName,
      blinkRecord: null,
      activeRecord: null,
      removingRecord: null,
      records: [],
      extraPayload: null,
      searchParams: {},
      searchLoading: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      recordFormVisibleTag: false,
    },
    effects: {
      // *searchWithLastParams(_, { put }) {
      //   const params = yield put.resolve({
      //     type: 'getSearchParamsInLocalStore',
      //   });
      //   return yield put.resolve({
      //     type: 'search',
      //     params,
      //   });
      // },
      // *getSearchParamsInLocalStore(_, { cps }) {
      //   const params = yield cps([localforage, localforage.getItem], LSKey_SearchParams);
      //   return params;
      // },
      searchOne: /*#__PURE__*/ regeneratorRuntime.mark(function searchOne(
        _ref4,
        _ref5,
      ) {
        var params, call, response, _getCommonFlds, _getCommonFlds$list, list;

        return regeneratorRuntime.wrap(function searchOne$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                params = _ref4.params;
                call = _ref5.call;

                if (searchRecords) {
                  _context2.next = 4;
                  break;
                }

                throw new Error('searchRecords is empty!');

              case 4:
                _context2.next = 6;
                return call(
                  searchRecords,
                  filterParams(
                    _objectSpread2(
                      {
                        pageNum: 1,
                        pageSize: 10,
                      },
                      params,
                    ),
                  ),
                );

              case 6:
                response = _context2.sent;

                if (!(!response || !response.success)) {
                  _context2.next = 10;
                  break;
                }

                handleRespError({
                  response: response,
                  errorTitle: '查询单一结果失败',
                });
                return _context2.abrupt('return', false);

              case 10:
                (_getCommonFlds = getCommonFlds(response)),
                  (_getCommonFlds$list = _getCommonFlds.list),
                  (list =
                    _getCommonFlds$list === void 0 ? [] : _getCommonFlds$list);
                return _context2.abrupt(
                  'return',
                  list && list.length > 0 ? list[0] : null,
                );

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, searchOne);
      }),
      getRecord: /*#__PURE__*/ regeneratorRuntime.mark(function getRecord(
        _ref6,
        _ref7,
      ) {
        var params,
          _ref6$opts,
          options,
          call,
          put,
          searchOneAsBackup,
          result,
          response;

        return regeneratorRuntime.wrap(function getRecord$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                (params = _ref6.params),
                  (_ref6$opts = _ref6.opts),
                  (options = _ref6$opts === void 0 ? {} : _ref6$opts);
                (call = _ref7.call), (put = _ref7.put);

                if (_getRecord) {
                  _context3.next = 10;
                  break;
                }

                searchOneAsBackup = options.searchOneAsBackup;

                if (!searchOneAsBackup) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 7;
                return put.resolve({
                  type: 'searchOne',
                  params: params,
                });

              case 7:
                result = _context3.sent;
                return _context3.abrupt('return', result);

              case 9:
                throw new Error('getRecord is empty!');

              case 10:
                _context3.next = 12;
                return call(
                  _getRecord,
                  filterParams(_objectSpread2({}, params)),
                );

              case 12:
                response = _context3.sent;

                if (!(!response || !response.success)) {
                  _context3.next = 16;
                  break;
                }

                handleRespError({
                  response: response,
                  errorTitle: '获取单一结果失败',
                });
                return _context3.abrupt('return', false);

              case 16:
                return _context3.abrupt('return', response.data);

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, getRecord);
      }),
      search: [
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(_ref8, _ref9) {
          var params,
            _ref8$opts,
            options,
            call,
            put,
            updateSearchParamsEvenError,
            mountId,
            reqParams,
            _markTag,
            _markTag2,
            tagMatch,
            response,
            newPayload,
            _getCommonFlds2,
            _getCommonFlds2$list,
            list,
            origTotal,
            extraPayload,
            _getCommonFlds2$pageS,
            pageSize,
            _getCommonFlds2$pageN,
            pageNum,
            total;

          return regeneratorRuntime.wrap(function _callee2$(_context4) {
            while (1) {
              switch ((_context4.prev = _context4.next)) {
                case 0:
                  (params = _ref8.params),
                    (_ref8$opts = _ref8.opts),
                    (options = _ref8$opts === void 0 ? {} : _ref8$opts);
                  (call = _ref9.call), (put = _ref9.put);
                  (updateSearchParamsEvenError =
                    options.updateSearchParamsEvenError),
                    (mountId = options.mountId);
                  reqParams = _objectSpread2(
                    {
                      pageNum: 1,
                      pageSize: 10,
                    },
                    params,
                  );
                  _context4.next = 6;
                  return put({
                    type: 'saveState',
                    payload: _objectSpread2(
                      {
                        searchLoading: true,
                      },
                      mountId
                        ? {
                            mountId: mountId,
                          }
                        : undefined,
                    ),
                  });

                case 6:
                  if (searchRecords) {
                    _context4.next = 8;
                    break;
                  }

                  throw new Error('searchRecords is empty!');

                case 8:
                  (_markTag = markTag('search')),
                    (_markTag2 = _slicedToArray(_markTag, 1)),
                    (tagMatch = _markTag2[0]);
                  _context4.next = 11;
                  return call(searchRecords, filterParams(reqParams));

                case 11:
                  response = _context4.sent;

                  if (!tagMatch()) {
                    logWarn('Seemed another search request has been sent!!!');
                  }

                  newPayload = {};

                  if (!response || !response.success) {
                    if (updateSearchParamsEvenError) {
                      Object.assign(newPayload, {
                        searchParams: params,
                      });
                    }

                    handleRespError({
                      response: response,
                      errorTitle: '获取结果列表失败',
                    });
                  } else {
                    (_getCommonFlds2 = getCommonFlds(response)),
                      (_getCommonFlds2$list = _getCommonFlds2.list),
                      (list =
                        _getCommonFlds2$list === void 0
                          ? []
                          : _getCommonFlds2$list),
                      (origTotal = _getCommonFlds2.total),
                      (extraPayload = _getCommonFlds2.extraPayload),
                      (_getCommonFlds2$pageS = _getCommonFlds2.pageSize),
                      (pageSize =
                        _getCommonFlds2$pageS === void 0
                          ? reqParams.pageSize
                          : _getCommonFlds2$pageS),
                      (_getCommonFlds2$pageN = _getCommonFlds2.pageNum),
                      (pageNum =
                        _getCommonFlds2$pageN === void 0
                          ? reqParams.pageNum || 1
                          : _getCommonFlds2$pageN);
                    total = origTotal !== undefined ? origTotal : list.length;
                    Object.assign(newPayload, {
                      searchParams: params,
                      records: list,
                      extraPayload: extraPayload,
                      pagination: {
                        current: pageNum,
                        pageSize: pageSize,
                        total: total,
                      },
                    });
                  }

                  _context4.next = 17;
                  return put({
                    type: 'saveState',
                    payload: _objectSpread2(
                      _objectSpread2({}, newPayload),
                      {},
                      {
                        searchLoading: false,
                      },
                    ),
                  });

                case 17:
                  return _context4.abrupt('return', response);

                case 18:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee2);
        }),
        {
          type: 'takeLatest',
        },
      ],
      showRecordForm: /*#__PURE__*/ regeneratorRuntime.mark(
        function showRecordForm(_ref10, _ref11) {
          var params, put;
          return regeneratorRuntime.wrap(function showRecordForm$(_context5) {
            while (1) {
              switch ((_context5.prev = _context5.next)) {
                case 0:
                  params = _ref10.params;
                  put = _ref11.put;
                  _context5.next = 4;
                  return put({
                    type: 'saveState',
                    payload: _objectSpread2(
                      {
                        recordFormVisibleTag: true,
                      },
                      params,
                    ),
                  });

                case 4:
                  return _context5.abrupt('return', true);

                case 5:
                case 'end':
                  return _context5.stop();
              }
            }
          }, showRecordForm);
        },
      ),
      hideRecordForm: /*#__PURE__*/ regeneratorRuntime.mark(
        function hideRecordForm(_, _ref12) {
          var put;
          return regeneratorRuntime.wrap(function hideRecordForm$(_context6) {
            while (1) {
              switch ((_context6.prev = _context6.next)) {
                case 0:
                  put = _ref12.put;
                  _context6.next = 3;
                  return put({
                    type: 'saveState',
                    payload: {
                      activeRecord: null,
                      recordFormVisibleTag: false,
                    },
                  });

                case 3:
                  return _context6.abrupt('return', true);

                case 4:
                case 'end':
                  return _context6.stop();
              }
            }
          }, hideRecordForm);
        },
      ),
      clearActiveRecord: /*#__PURE__*/ regeneratorRuntime.mark(
        function clearActiveRecord(_, _ref13) {
          var put;
          return regeneratorRuntime.wrap(function clearActiveRecord$(
            _context7,
          ) {
            while (1) {
              switch ((_context7.prev = _context7.next)) {
                case 0:
                  put = _ref13.put;
                  _context7.next = 3;
                  return put({
                    type: 'saveState',
                    payload: {
                      activeRecord: null,
                    },
                  });

                case 3:
                  return _context7.abrupt('return', true);

                case 4:
                case 'end':
                  return _context7.stop();
              }
            }
          },
          clearActiveRecord);
        },
      ),
      setRemovingRecord: /*#__PURE__*/ regeneratorRuntime.mark(
        function setRemovingRecord(_ref14, _ref15) {
          var record, put;
          return regeneratorRuntime.wrap(function setRemovingRecord$(
            _context8,
          ) {
            while (1) {
              switch ((_context8.prev = _context8.next)) {
                case 0:
                  record = _ref14.record;
                  put = _ref15.put;
                  _context8.next = 4;
                  return put({
                    type: 'saveState',
                    payload: {
                      removingRecord: record,
                    },
                  });

                case 4:
                  return _context8.abrupt('return', true);

                case 5:
                case 'end':
                  return _context8.stop();
              }
            }
          },
          setRemovingRecord);
        },
      ),
      saveSearchParams: /*#__PURE__*/ regeneratorRuntime.mark(
        function saveSearchParams(_ref16, _ref17) {
          var params, put;
          return regeneratorRuntime.wrap(function saveSearchParams$(_context9) {
            while (1) {
              switch ((_context9.prev = _context9.next)) {
                case 0:
                  params = _ref16.params;
                  put = _ref17.put;
                  _context9.next = 4;
                  return put({
                    type: 'saveState',
                    payload: {
                      searchParams: params,
                    },
                  });

                case 4:
                  return _context9.abrupt('return', true);

                case 5:
                case 'end':
                  return _context9.stop();
              }
            }
          }, saveSearchParams);
        },
      ),
      hideRecordFormOnly: /*#__PURE__*/ regeneratorRuntime.mark(
        function hideRecordFormOnly(_, _ref18) {
          var put;
          return regeneratorRuntime.wrap(function hideRecordFormOnly$(
            _context10,
          ) {
            while (1) {
              switch ((_context10.prev = _context10.next)) {
                case 0:
                  put = _ref18.put;
                  _context10.next = 3;
                  return put({
                    type: 'saveState',
                    payload: {
                      recordFormVisibleTag: false,
                    },
                  });

                case 3:
                  return _context10.abrupt('return', true);

                case 4:
                case 'end':
                  return _context10.stop();
              }
            }
          },
          hideRecordFormOnly);
        },
      ),
      findRecordById: /*#__PURE__*/ regeneratorRuntime.mark(
        function findRecordById(_ref19, _ref20) {
          var id, select, records;
          return regeneratorRuntime.wrap(function findRecordById$(_context11) {
            while (1) {
              switch ((_context11.prev = _context11.next)) {
                case 0:
                  id = _ref19.id;
                  select = _ref20.select;
                  _context11.next = 4;
                  return select(function(state) {
                    return state[StoreNs].records;
                  });

                case 4:
                  records = _context11.sent;
                  return _context11.abrupt(
                    'return',
                    records.find(function(item) {
                      return item[idFieldName] === id;
                    }),
                  );

                case 6:
                case 'end':
                  return _context11.stop();
              }
            }
          }, findRecordById);
        },
      ),
      blinkRecordById: /*#__PURE__*/ regeneratorRuntime.mark(
        function blinkRecordById(_ref21, _ref22) {
          var id, _ref21$timeout, timeout, put, recordItem;

          return regeneratorRuntime.wrap(function blinkRecordById$(_context12) {
            while (1) {
              switch ((_context12.prev = _context12.next)) {
                case 0:
                  (id = _ref21.id),
                    (_ref21$timeout = _ref21.timeout),
                    (timeout =
                      _ref21$timeout === void 0 ? 1000 : _ref21$timeout);
                  put = _ref22.put;
                  _context12.next = 4;
                  return put.resolve({
                    type: 'findRecordById',
                    id: id,
                  });

                case 4:
                  recordItem = _context12.sent;
                  _context12.next = 7;
                  return put({
                    type: 'blinkRecord',
                    record: recordItem || null,
                    timeout: timeout,
                  });

                case 7:
                  return _context12.abrupt('return', true);

                case 8:
                case 'end':
                  return _context12.stop();
              }
            }
          }, blinkRecordById);
        },
      ),
      blinkRecord: /*#__PURE__*/ regeneratorRuntime.mark(function blinkRecord(
        _ref23,
        _ref24,
      ) {
        var record, _ref23$timeout, timeout, put, call;

        return regeneratorRuntime.wrap(function blinkRecord$(_context13) {
          while (1) {
            switch ((_context13.prev = _context13.next)) {
              case 0:
                (record = _ref23.record),
                  (_ref23$timeout = _ref23.timeout),
                  (timeout = _ref23$timeout === void 0 ? 2000 : _ref23$timeout);
                (put = _ref24.put), (call = _ref24.call);
                _context13.next = 4;
                return put({
                  type: 'saveState',
                  payload: {
                    blinkRecord: record,
                  },
                });

              case 4:
                _context13.next = 6;
                return call(delayP, timeout);

              case 6:
                _context13.next = 8;
                return put({
                  type: 'saveState',
                  payload: {
                    blinkRecord: null,
                  },
                });

              case 8:
                return _context13.abrupt('return', true);

              case 9:
              case 'end':
                return _context13.stop();
            }
          }
        }, blinkRecord);
      }),
      addRecord: /*#__PURE__*/ regeneratorRuntime.mark(function addRecord(
        _ref25,
        _ref26,
      ) {
        var record, callback, call, response;
        return regeneratorRuntime.wrap(function addRecord$(_context14) {
          while (1) {
            switch ((_context14.prev = _context14.next)) {
              case 0:
                (record = _ref25.record), (callback = _ref25.callback);
                call = _ref26.call;

                if (_addRecord) {
                  _context14.next = 4;
                  break;
                }

                throw new Error('addRecord is empty!');

              case 4:
                _context14.next = 6;
                return call(_addRecord, record);

              case 6:
                response = _context14.sent;

                if (!response || !response.success) {
                  handleRespError({
                    response: response,
                    errorTitle: '新建失败',
                  });
                }

                if (callback) callback(response);
                return _context14.abrupt('return', response);

              case 10:
              case 'end':
                return _context14.stop();
            }
          }
        }, addRecord);
      }),
      updateRecord: /*#__PURE__*/ regeneratorRuntime.mark(function updateRecord(
        _ref27,
        _ref28,
      ) {
        var record, callback, call, response;
        return regeneratorRuntime.wrap(function updateRecord$(_context15) {
          while (1) {
            switch ((_context15.prev = _context15.next)) {
              case 0:
                (record = _ref27.record), (callback = _ref27.callback);
                call = _ref28.call;

                if (_updateRecord) {
                  _context15.next = 4;
                  break;
                }

                throw new Error('updateRecord is empty!');

              case 4:
                _context15.next = 6;
                return call(_updateRecord, record);

              case 6:
                response = _context15.sent;

                if (!response || !response.success) {
                  handleRespError({
                    response: response,
                    errorTitle: '更新失败',
                  });
                }

                if (callback) callback(response);
                return _context15.abrupt('return', response);

              case 10:
              case 'end':
                return _context15.stop();
            }
          }
        }, updateRecord);
      }),
      deleteRecord: /*#__PURE__*/ regeneratorRuntime.mark(function deleteRecord(
        _ref29,
        _ref30,
      ) {
        var params, callback, call, put, id, recordItem, response;
        return regeneratorRuntime.wrap(function deleteRecord$(_context16) {
          while (1) {
            switch ((_context16.prev = _context16.next)) {
              case 0:
                (params = _ref29.params), (callback = _ref29.callback);
                (call = _ref30.call), (put = _ref30.put);
                id = params[idFieldName];

                if (!id) {
                  _context16.next = 9;
                  break;
                }

                _context16.next = 6;
                return put.resolve({
                  type: 'findRecordById',
                  id: id,
                });

              case 6:
                _context16.t0 = _context16.sent;
                _context16.next = 10;
                break;

              case 9:
                _context16.t0 = null;

              case 10:
                recordItem = _context16.t0;
                _context16.next = 13;
                return put({
                  type: 'setRemovingRecord',
                  record: recordItem || null,
                });

              case 13:
                if (_deleteRecord) {
                  _context16.next = 15;
                  break;
                }

                throw new Error('deleteRecord is empty!');

              case 15:
                _context16.next = 17;
                return call(_deleteRecord, params);

              case 17:
                response = _context16.sent;
                _context16.next = 20;
                return put({
                  type: 'setRemovingRecord',
                  record: null,
                });

              case 20:
                if (!response || !response.success) {
                  handleRespError({
                    response: response,
                    errorTitle: '删除失败',
                  });
                }

                if (callback) callback(response);
                return _context16.abrupt('return', response);

              case 23:
              case 'end':
                return _context16.stop();
            }
          }
        }, deleteRecord);
      }),
      callService: /*#__PURE__*/ regeneratorRuntime.mark(function callService(
        _ref31,
        _ref32,
      ) {
        var serviceTitle,
          serviceFunction,
          serviceParams,
          callback,
          call,
          response;
        return regeneratorRuntime.wrap(function callService$(_context17) {
          while (1) {
            switch ((_context17.prev = _context17.next)) {
              case 0:
                (serviceTitle = _ref31.serviceTitle),
                  (serviceFunction = _ref31.serviceFunction),
                  (serviceParams = _ref31.serviceParams),
                  (callback = _ref31.callback);
                call = _ref32.call;

                if (serviceFunction) {
                  _context17.next = 4;
                  break;
                }

                throw new Error(
                  ''.concat(serviceTitle, ': serviceFunction is empty!'),
                );

              case 4:
                _context17.next = 6;
                return call.apply(
                  void 0,
                  [serviceFunction].concat(_toConsumableArray(serviceParams)),
                );

              case 6:
                response = _context17.sent;

                if (!response || !response.success) {
                  handleRespError({
                    response: response,
                    errorTitle: ''.concat(
                      serviceTitle,
                      ' \u64CD\u4F5C\u5931\u8D25',
                    ),
                  });
                }

                if (callback) callback(response);
                return _context17.abrupt('return', response);

              case 10:
              case 'end':
                return _context17.stop();
            }
          }
        }, callService);
      }),
    },
    reducers: {
      replaceRecord: function replaceRecord(state, action) {
        var records = state.records;
        var _action$params = action.params,
          record = _action$params.record,
          _action$params$record = _action$params.recordList,
          recordList =
            _action$params$record === void 0 ? [] : _action$params$record;
        [record]
          .concat(_toConsumableArray(recordList))
          .forEach(function(repItem) {
            var idx = records.findIndex(function(item) {
              return item[idFieldName] === repItem[idFieldName];
            });

            if (idx < 0) {
              // eslint-disable-next-line no-console
              console.warn('No match record found: ', repItem);
              return;
            }

            records[idx] = repItem;
          });
        return _objectSpread2(
          _objectSpread2({}, state),
          {},
          {
            records: _toConsumableArray(records),
          },
        );
      },
      resetRecordsState: function resetRecordsState(state, action) {
        return _objectSpread2(
          _objectSpread2({}, state),
          {},
          {
            mountId: action.mountId,
            blinkRecord: null,
            activeRecord: null,
            removingRecord: null,
            records: [],
            extraPayload: null,
            searchParams: {},
            pagination: {
              total: 0,
              current: 1,
              pageSize: 10,
            },
          },
        );
      },
      saveState: function saveState(state, action) {
        return _objectSpread2(_objectSpread2({}, state), action.payload);
      },
    }, // subscriptions: {
    //   setup({ dispatch }) {
    //     console.log(StoreNsTitle);
    //   },
    // },
  };
  return merge(
    interModel,
    isFunction(extensions)
      ? extensions(
          _objectSpread2(
            _objectSpread2({}, opts),
            {},
            {
              handleRespError: handleRespError,
            },
          ),
        )
      : extensions,
  );
}
function getStandConfigModel(opts) {
  var _effects;

  var _opts$getConfig = opts.getConfig,
    getConfig = _opts$getConfig === void 0 ? [] : _opts$getConfig,
    _opts$StoreNs2 = opts.StoreNs,
    StoreNs =
      _opts$StoreNs2 === void 0 ? getAutoStoreNs('Config') : _opts$StoreNs2;

  if (!StoreNs) {
    throw new Error('StoreNs should no be empty!');
  }

  return {
    namespace: StoreNs,
    state: _defineProperty({}, ConfigLoadingFld, true),
    effects:
      ((_effects = {}),
      _defineProperty(
        _effects,
        ConfigLoadMethod,
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee3(_, _ref33) {
          var all, call, put, configObj;
          return regeneratorRuntime.wrap(function _callee3$(_context18) {
            while (1) {
              switch ((_context18.prev = _context18.next)) {
                case 0:
                  (all = _ref33.all), (call = _ref33.call), (put = _ref33.put);
                  _context18.next = 3;
                  return put.resolve({
                    type: ConfigUpdateMethod,
                    getConfig: getConfig,
                    updateConfigLoading: true,
                  });

                case 3:
                  configObj = _context18.sent;
                  return _context18.abrupt('return', configObj);

                case 5:
                case 'end':
                  return _context18.stop();
              }
            }
          }, _callee3);
        }),
      ),
      _defineProperty(
        _effects,
        ConfigUpdateMethod,
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee4(
          _ref34,
          _ref35,
        ) {
          var getConfig,
            _ref34$updateConfigLo,
            updateConfigLoading,
            all,
            call,
            put,
            results,
            configObj,
            payload;

          return regeneratorRuntime.wrap(function _callee4$(_context19) {
            while (1) {
              switch ((_context19.prev = _context19.next)) {
                case 0:
                  (getConfig = _ref34.getConfig),
                    (_ref34$updateConfigLo = _ref34.updateConfigLoading),
                    (updateConfigLoading =
                      _ref34$updateConfigLo === void 0
                        ? true
                        : _ref34$updateConfigLo);
                  (all = _ref35.all), (call = _ref35.call), (put = _ref35.put);

                  if (!updateConfigLoading) {
                    _context19.next = 5;
                    break;
                  }

                  _context19.next = 5;
                  return put({
                    type: 'saveState',
                    payload: _defineProperty({}, ConfigLoadingFld, true),
                  });

                case 5:
                  _context19.next = 7;
                  return all(
                    (Array.isArray(getConfig) ? getConfig : [getConfig]).map(
                      function(item) {
                        return isFunction(item)
                          ? call(item)
                          : Promise.resolve(item);
                      },
                    ),
                  );

                case 7:
                  results = _context19.sent;
                  configObj = results.reduce(function(map, item) {
                    Object.assign(map, item);
                    return map;
                  }, {});
                  payload = _objectSpread2(
                    _objectSpread2({}, configObj),
                    updateConfigLoading
                      ? _defineProperty({}, ConfigLoadingFld, false)
                      : undefined,
                  );
                  _context19.next = 12;
                  return put({
                    type: 'saveState',
                    payload: payload,
                  });

                case 12:
                  return _context19.abrupt('return', configObj);

                case 13:
                case 'end':
                  return _context19.stop();
              }
            }
          }, _callee4);
        }),
      ),
      _effects),
    reducers: {
      saveState: function saveState(state, action) {
        return _objectSpread2(_objectSpread2({}, state), action.payload);
      },
    },
    subscriptions: {
      setup: function setup(_ref37) {
        var dispatch = _ref37.dispatch;
        dispatch({
          type: ConfigLoadMethod,
        });
      },
    },
  };
}
function getAutoStoreNs(key) {
  return '_Auto'
    .concat(getAutoId(), '_')
    .concat(ModelNsPre)
    .concat(key);
}
function buildStandRecordModelPkg() {
  var opts =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$idFieldName2 = opts.idFieldName,
    idFieldName = _opts$idFieldName2 === void 0 ? 'id' : _opts$idFieldName2,
    _opts$nameFieldName2 = opts.nameFieldName,
    nameFieldName =
      _opts$nameFieldName2 === void 0 ? 'name' : _opts$nameFieldName2,
    _opts$StoreNs3 = opts.StoreNs,
    StoreNs =
      _opts$StoreNs3 === void 0 ? getAutoStoreNs('Record') : _opts$StoreNs3,
    _opts$StoreNsTitle2 = opts.StoreNsTitle,
    StoreNsTitle =
      _opts$StoreNsTitle2 === void 0 ? '记录' : _opts$StoreNsTitle2,
    _opts$isDynamic = opts.isDynamic,
    isDynamic = _opts$isDynamic === void 0 ? false : _opts$isDynamic;
  return {
    StoreNs: StoreNs,
    StoreNsTitle: StoreNsTitle,
    idFieldName: idFieldName,
    nameFieldName: nameFieldName,
    isDynamic: isDynamic,
    modelOpts: opts,
    default: getStandModel(
      _objectSpread2(
        _objectSpread2({}, opts),
        {},
        {
          StoreNs: StoreNs,
        },
      ),
    ),
  };
}
function cloneModelPkg(modelPkg) {
  var nsTag =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : '_Clone';
  var opts = arguments.length > 2 ? arguments[2] : undefined;
  var modelOpts = modelPkg.modelOpts,
    StoreNs = modelPkg.StoreNs;

  if (!modelOpts) {
    throw new Error('modelOpts is missing');
  }

  var newStoreNs = ''
    .concat(nsTag, '_A', ''.concat(getAutoId()), '-')
    .concat(StoreNs);

  var newModelOpts = _objectSpread2(
    _objectSpread2(_objectSpread2({}, modelPkg.modelOpts), opts),
    {},
    {
      StoreNs: newStoreNs,
    },
  );

  return buildStandRecordModelPkg(newModelOpts);
}
function getDynamicModelPkg(modelPkg) {
  var nsTag =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : '_Dynamic';
  return cloneModelPkg(modelPkg, nsTag, {
    isDynamic: true,
  });
}
function buildStandConfigModelPkg(opts) {
  var _opts$StoreNs4 = opts.StoreNs,
    StoreNs =
      _opts$StoreNs4 === void 0 ? getAutoStoreNs('Config') : _opts$StoreNs4,
    _opts$StoreNsTitle3 = opts.StoreNsTitle,
    StoreNsTitle =
      _opts$StoreNsTitle3 === void 0 ? '配置' : _opts$StoreNsTitle3;
  return {
    StoreNs: StoreNs,
    StoreNsTitle: StoreNsTitle,
    default: getStandConfigModel(
      _objectSpread2(
        _objectSpread2({}, opts),
        {},
        {
          StoreNs: StoreNs,
        },
      ),
    ),
  };
}
var EmptyConfigModel = buildStandConfigModelPkg({
  StoreNs: ''.concat(ModelNsPre, 'EmptyConfig'),
  StoreNsTitle: '空配置',
  getConfig: [],
});
var EmptyRecordModel = buildStandRecordModelPkg({
  StoreNs: ''.concat(ModelNsPre, 'EmptyRecord'),
  StoreNsTitle: '空实体',
  idFieldName: 'id',
  nameFieldName: 'name',
});

var momentFormat = 'YYYYMMDDHHmmss';

function momentToStr(v) {
  return v.format(momentFormat);
}

function momentFromStr(v) {
  return moment(v, momentFormat);
}

var TypeParamsPrefixList = [
  {
    prefix: '_n_',
    test: function test(val) {
      return typeof val === 'number';
    },
    fromUrl: parseFloat,
  },
  {
    prefix: '_b_',
    test: function test(val) {
      return typeof val === 'boolean';
    },
    toUrl: function toUrl(v) {
      return v ? 1 : 0;
    },
    fromUrl: function fromUrl(v) {
      return v === '1';
    },
  },
  {
    prefix: '_m_',
    test: function test(val) {
      return val && moment.isMoment(val);
    },
    toUrl: function toUrl(v) {
      return momentToStr(v);
    },
    fromUrl: function fromUrl(v) {
      return momentFromStr(v);
    },
  },
  {
    prefix: '_mr_',
    test: function test(val) {
      return (
        Array.isArray(val) &&
        val.length > 0 &&
        !val.some(function(item) {
          return !moment.isMoment(item);
        })
      );
    },
    toUrl: function toUrl(v) {
      return v
        .map(function(item) {
          return momentToStr(item);
        })
        .join(',');
    },
    fromUrl: function fromUrl(v) {
      return v.split(',').map(function(item) {
        return momentFromStr(item);
      });
    },
  },
  {
    prefix: '_j_',
    test: function test(val) {
      return val && _typeof(val) === 'object';
    },
    toUrl: function toUrl(obj) {
      if (!obj || Object.keys(obj).length === 0) {
        return undefined;
      }

      return JSON.stringify(obj);
    },
    fromUrl: function fromUrl(v) {
      try {
        return JSON.parse(v);
      } catch (e) {
        return undefined;
      }
    },
  },
];

var identity = function identity(v) {
  return v;
};

var paramToUrl = function paramToUrl(key, val) {
  var matchTypeItem = TypeParamsPrefixList.find(function(item) {
    return item.test(val) === true;
  });

  if (!matchTypeItem) {
    return _defineProperty({}, key, val);
  }

  return _defineProperty(
    {},
    ''.concat(matchTypeItem.prefix).concat(key),
    (matchTypeItem.toUrl || identity)(val),
  );
};
var paramFromUrl = function paramFromUrl(key, val) {
  var matchTypeItem = TypeParamsPrefixList.find(function(item) {
    return key.indexOf(item.prefix) === 0;
  });

  if (!matchTypeItem) {
    return _defineProperty({}, key, val);
  }

  return _defineProperty(
    {},
    key.substr(matchTypeItem.prefix.length),
    (matchTypeItem.fromUrl || identity)(val),
  );
};

var converterList = [
  {
    encode: {
      test: function test(value) {
        return moment.isMoment(value);
      },
      filter: function filter(value) {
        return '_moment:'.concat(value.valueOf());
      },
    },
    decode: {
      test: function test(value) {
        return typeof value === 'string' && value.indexOf('_moment:') === 0;
      },
      filter: function filter(value) {
        var _value$split = value.split(':'),
          _value$split2 = _slicedToArray(_value$split, 2),
          timestamp = _value$split2[1];

        return moment(parseInt(timestamp, 10));
      },
    },
  },
];
function encodeFormValues(vals) {
  return cloneDeepWith(vals, function(value) {
    var matchItem = converterList.find(function(_ref) {
      var test = _ref.encode.test;
      return test(value);
    });

    if (matchItem) {
      return matchItem.encode.filter(value);
    }

    return undefined;
  });
}
function decodeFormValues(vals) {
  return cloneDeepWith(vals, function(value) {
    var matchItem = converterList.find(function(_ref2) {
      var test = _ref2.decode.test;
      return test(value);
    });

    if (matchItem) {
      return matchItem.decode.filter(value);
    }

    return undefined;
  });
}

function isQueryParamsEqual(paramsA, paramsB) {
  return isEqual(
    fromUrlQuery(toUrlQuery(paramsA)),
    fromUrlQuery(toUrlQuery(paramsB)),
  );
}
function toUrlQuery(origParams) {
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$ns = _ref.ns,
    ns = _ref$ns === void 0 ? false : _ref$ns;

  var result = {};
  var params = encodeFormValues(origParams);

  if (ns) {
    result[ns] = JSON.stringify(params);
  } else {
    Object.keys(params).forEach(function(k) {
      var val = params[k];

      if (val === null || val === undefined) {
        return;
      }

      Object.assign(result, paramToUrl(k, val));
    });
  }

  return stringify(result);
}
function fromUrlQuery(search) {
  var _ref2 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref2$ns = _ref2.ns,
    ns = _ref2$ns === void 0 ? false : _ref2$ns;

  var urlParams = parse(search);
  var result = {};

  if (ns) {
    if (urlParams[ns]) {
      try {
        Object.assign(result, JSON.parse(urlParams[ns]));
      } catch (e) {}
    }
  } else {
    Object.keys(urlParams).forEach(function(k) {
      if (k.indexOf(StateParamPrefix) === 0) {
        return;
      }

      Object.assign(result, paramFromUrl(k, urlParams[k]));
    });
  }

  return decodeFormValues(result);
}

function ActionCounterHoc() {
  return function(WrappedComponent) {
    var _a;

    return (
      (_a = /*#__PURE__*/ (function(_React$Component) {
        _inherits(ActionCounter, _React$Component);

        var _super = _createSuper(ActionCounter);

        function ActionCounter() {
          var _this;

          _classCallCheck(this, ActionCounter);

          _this = _super.apply(this, arguments);
          _this.state = {
            counterMap: {},
          };

          _this.increaseActionCount = function() {
            var action =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 'submit';
            var num =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 1;

            _this.setState(function(state) {
              return {
                counterMap: _objectSpread2(
                  _objectSpread2({}, state.counterMap),
                  {},
                  _defineProperty(
                    {},
                    action,
                    (state.counterMap[action] || 0) + num,
                  ),
                ),
              };
            });
          };

          _this.decreaseActionCount = function() {
            var action =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 'submit';
            var num =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 1;

            _this.setState(function(state) {
              return {
                counterMap: _objectSpread2(
                  _objectSpread2({}, state.counterMap),
                  {},
                  _defineProperty(
                    {},
                    action,
                    (state.counterMap[action] || 0) - num,
                  ),
                ),
              };
            });
          };

          _this.getActionCount = function(action) {
            var counterMap = _this.state.counterMap;
            var targetKeys = [];

            if (action) {
              if (Array.isArray(action)) {
                targetKeys.push.apply(targetKeys, _toConsumableArray(action));
              } else {
                targetKeys.push(action);
              }
            }

            return Object.keys(counterMap).reduce(function(accumulator, key) {
              return (
                accumulator +
                (!targetKeys.length || targetKeys.indexOf(key) >= 0
                  ? counterMap[key]
                  : 0)
              );
            }, 0);
          };

          return _this;
        }

        _createClass(ActionCounter, [
          {
            key: 'render',
            value: function render() {
              var increaseActionCount = this.increaseActionCount,
                decreaseActionCount = this.decreaseActionCount,
                getActionCount = this.getActionCount;
              var hocProps = {
                increaseActionCount: increaseActionCount,
                decreaseActionCount: decreaseActionCount,
                getActionCount: getActionCount,
              };
              return /*#__PURE__*/ React.createElement(
                WrappedComponent,
                Object.assign({}, this.props, hocProps),
              );
            },
          },
        ]);

        return ActionCounter;
      })(React.Component)),
      (_a.displayName = 'ActionCounter_'.concat(
        getDisplayName(WrappedComponent),
      )),
      _a
    );
  };
}

function BatchCheckHoc(opts) {
  return function(WrappedComponent) {
    var _a;

    return (
      (_a = /*#__PURE__*/ (function(_React$Component) {
        _inherits(BatchCheck, _React$Component);

        var _super = _createSuper(BatchCheck);

        function BatchCheck(props) {
          var _this;

          _classCallCheck(this, BatchCheck);

          _this = _super.call(this, props);
          _this.state = {
            checkedList: [],
          };

          _this.getNewCheckedState = function(origList) {
            var _this$props = _this.props,
              _this$props$maxChecke = _this$props.maxCheckedLength,
              maxCheckedLength =
                _this$props$maxChecke === void 0 ? -1 : _this$props$maxChecke,
              onChange = _this$props.onChange;
            var list = origList;

            if (maxCheckedLength > 0) {
              list = list.slice(-1 * maxCheckedLength);
            }

            if (onChange) {
              setTimeout(function() {
                onChange(list);
              }, 0);
            }

            return {
              checkedList: list,
            };
          };

          _this.isAllChecked = function(records) {
            return !records.some(function(r) {
              return !_this.isChecked(r);
            });
          };

          _this.isChecked = function(record) {
            var checkedList = _this.state.checkedList;
            return checkedList.some(function(item) {
              return _this.recordMatch(item, record);
            });
          };

          _this.recordMatch = function(a, b) {
            if (a === b) {
              return true;
            }

            return opts.recordMatch(a, b);
          };

          _this.findMatchRecord = function(target, list) {
            return list.find(function(item) {
              return _this.recordMatch(item, target);
            });
          };

          _this.checkAll = function(records) {
            _this.setState(function(state) {
              var newList = uniqWith(
                state.checkedList.concat(records),
                _this.recordMatch,
              );
              return _this.getNewCheckedState(newList);
            });
          };

          _this.uncheckAll = function(records) {
            _this.setState(function(state) {
              var newList = state.checkedList.filter(function(record) {
                return !_this.findMatchRecord(record, records);
              });
              return _this.getNewCheckedState(newList);
            });
          };

          _this.setChecked = function(records) {
            _this.setState(function() {
              return _this.getNewCheckedState(records);
            });
          };

          _this.clearChecked = function() {
            _this.setState(_this.getNewCheckedState([]));
          };

          _this.checkReverse = function(records) {
            _this.setState(function(state) {
              var unCheckedList = records.filter(function(r) {
                return !_this.isChecked(r);
              });
              var newList = pullAll(state.checkedList, records).concat(
                unCheckedList,
              );
              return _this.getNewCheckedState(newList);
            });
          };

          _this.batchToggleChecked = function(records, checked) {
            return _this.toggleChecked(records, checked);
          };

          _this.toggleChecked = function(record, checked) {
            var targets = Array.isArray(record) ? record : [record];

            if (checked) {
              return _this.checkAll(targets);
            } else {
              return _this.uncheckAll(targets);
            }
          };

          _this.getCheckedList = function() {
            return _this.state.checkedList;
          };

          _this.state = {
            checkedList:
              ('checkedList' in props
                ? props.checkedList
                : props.defaultCheckedList) || [],
          };
          return _this;
        }

        _createClass(
          BatchCheck,
          [
            {
              key: 'render',
              value: function render() {
                var _this$props2 = this.props,
                  propCheckedList = _this$props2.checkedList,
                  defaultCheckedList = _this$props2.defaultCheckedList,
                  restProps = _objectWithoutProperties(_this$props2, [
                    'checkedList',
                    'defaultCheckedList',
                  ]);

                var checkedList = this.state.checkedList;
                var isAllChecked = this.isAllChecked,
                  isChecked = this.isChecked,
                  setChecked = this.setChecked,
                  checkAll = this.checkAll,
                  uncheckAll = this.uncheckAll,
                  checkReverse = this.checkReverse,
                  clearChecked = this.clearChecked,
                  toggleChecked = this.toggleChecked,
                  getCheckedList = this.getCheckedList,
                  batchToggleChecked = this.batchToggleChecked;
                var hocProps = {
                  checkedList: checkedList,
                  setChecked: setChecked,
                  isAllChecked: isAllChecked,
                  isChecked: isChecked,
                  isRecordChecked: isChecked,
                  checkAll: checkAll,
                  uncheckAll: uncheckAll,
                  checkReverse: checkReverse,
                  clearChecked: clearChecked,
                  toggleChecked: toggleChecked,
                  batchToggleChecked: batchToggleChecked,
                  getCheckedList: getCheckedList,
                };
                return /*#__PURE__*/ React.createElement(
                  WrappedComponent,
                  Object.assign({}, restProps, hocProps),
                );
              },
            },
          ],
          [
            {
              key: 'getDerivedStateFromProps',
              value: function getDerivedStateFromProps(props, state) {
                if ('checkedList' in props) {
                  return _objectSpread2(
                    _objectSpread2({}, state),
                    {},
                    {
                      checkedList:
                        'checkedList' in props
                          ? props.checkedList || []
                          : state.checkedList,
                    },
                  );
                }

                return null;
              },
            },
          ],
        );

        return BatchCheck;
      })(React.Component)),
      (_a.displayName = 'BatchCheck_'.concat(getDisplayName(WrappedComponent))),
      (_a.defaultProps = {
        defaultCheckedList: [], //maxCheckedLength: -1,
      }),
      _a
    );
  };
}

var filterState = memoize(function(state) {
  return omit(state, [ConfigLoadingFld]);
});
var StandConnectHoc = function StandConnectHoc(hocParams) {
  var _getConfig = getConfig(),
    getConnect = _getConfig.getConnect;

  var configModel = hocParams.configModel,
    recordModel = hocParams.recordModel;

  var _ref = recordModel || {},
    StoreNs = _ref.StoreNs;

  var _ref2 = configModel || {},
    ConfigStoreNs = _ref2.StoreNs;

  return function(WrappedComponent) {
    return getConnect()(function(state) {
      var storeRefState = StoreNs
        ? state[StoreNs] || (recordModel && recordModel.default.state) || {}
        : {};
      var configStoreRefState = ConfigStoreNs
        ? state[ConfigStoreNs] ||
          (configModel && configModel.default.state) ||
          {}
        : {};
      var loading = state.loading;
      return {
        storeRef: storeRefState,
        configStoreRef: filterState(configStoreRefState),
        searchLoading: storeRefState.searchLoading,
        configLoading:
          !!configStoreRefState[ConfigLoadingFld] ||
          (loading &&
            loading.effects &&
            loading.effects[
              ''.concat(ConfigStoreNs, '/').concat(ConfigLoadMethod)
            ]),
      };
    })(WrappedComponent);
  };
};
/** @deprecated use StandConnectHoc instead */

var StandConfigLoadingHoc = StandConnectHoc;

// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
var tuple = function tuple() {
  for (
    var _len = arguments.length, args = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    args[_key] = arguments[_key];
  }

  return args;
};

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z =
  '/* stylelint-disable at-rule-empty-line-before,at-rule-name-space-after,at-rule-no-unknown */\n/* stylelint-disable no-duplicate-selectors */\n/* stylelint-disable */\n/* stylelint-disable declaration-bang-space-before,no-duplicate-selectors,string-no-newline */\n@-webkit-keyframes standAdminBlinkAnim {\n  0% {\n    background-color: #fafafa;\n  }\n  100% {\n    background-color: #c0d6e0;\n  }\n}\n@keyframes standAdminBlinkAnim {\n  0% {\n    background-color: #fafafa;\n  }\n  100% {\n    background-color: #c0d6e0;\n  }\n}\n.stand-admin-container {\n  position: relative;\n  overflow: visible;\n  transition: opacity 0.2s;\n}\n.stand-admin-pagination {\n  margin: 24px 0 !important;\n  text-align: center;\n}\n.stand-admin-loading {\n  opacity: 0.7;\n  pointer-events: none;\n}\n.stand-admin-table th {\n  white-space: nowrap;\n}\n.stand-admin-table tr {\n  transition: background-color 1s;\n}\n.stand-admin-table tr.stand-admin-blinkRecord td,\n.stand-admin-table tr.stand-admin-blinkRecord th {\n  -webkit-animation-name: standAdminBlinkAnim;\n          animation-name: standAdminBlinkAnim;\n  -webkit-animation-duration: 0.5s;\n          animation-duration: 0.5s;\n  -webkit-animation-iteration-count: 2;\n          animation-iteration-count: 2;\n  -webkit-animation-fill-mode: none;\n          animation-fill-mode: none;\n}\n.stand-admin-table .stand-admin-removingRecord {\n  font-style: italic;\n  background: #eee;\n  opacity: 0.5;\n}\n.stand-admin-table .stand-admin-removingRecord,\n.stand-admin-table .stand-admin-removingRecord * {\n  text-decoration: line-through;\n  pointer-events: none;\n}\n.stand-admin-table .stand-admin-activeRecord {\n  background: #fafafa;\n}\n.stand-admin-table .stand-admin-blinkRecord .ant-table-cell-fix-left,\n.stand-admin-table .stand-admin-removingRecord .ant-table-cell-fix-left,\n.stand-admin-table .stand-admin-activeRecord .ant-table-cell-fix-left,\n.stand-admin-table .stand-admin-blinkRecord .ant-table-cell-fix-right,\n.stand-admin-table .stand-admin-removingRecord .ant-table-cell-fix-right,\n.stand-admin-table .stand-admin-activeRecord .ant-table-cell-fix-right {\n  background-color: #fafafa;\n}\n.stand-admin-table .stand-admin-actionList {\n  margin: 0;\n  padding: 0;\n  white-space: nowrap;\n  list-style: none;\n}\n.stand-admin-table .stand-admin-actionList > li {\n  display: inline-block;\n  margin-right: 12px;\n}\n.stand-admin-table .stand-admin-actionList :last-child {\n  margin-right: 0 !important;\n}\n.stand-admin-tagList {\n  line-height: 32px;\n}\n.stand-admin-modalWrapper .ant-modal {\n  top: 40px;\n  min-width: 300px;\n}\n.stand-admin-modalWrapper .ant-modal-header {\n  padding: 12px 16px;\n}\n.stand-admin-modalWrapper .ant-modal-body {\n  min-height: 300px;\n  max-height: calc(100vh - 170px);\n  padding: 8px 16px;\n  overflow: auto;\n}\n.stand-admin-modalWrapper .stand-admin-block:not(:last-child) {\n  margin-right: 24px;\n}\n.stand-admin-modalWrapper .stand-admin-footer {\n  display: flex;\n  align-items: center;\n  line-height: 24px;\n}\n.stand-admin-modalWrapper .stand-admin-footer .stand-admin-right {\n  display: flex;\n  flex: 1 1 auto;\n  justify-content: flex-end;\n}\n.stand-admin-modalWrapper .stand-admin-footer .ant-btn-link {\n  padding: 0;\n}\n.stand-admin-modalWrapper .stand-admin-footer .ant-btn {\n  display: inline-block;\n}\n.stand-admin-readonly {\n  pointer-events: none;\n}\n.stand-admin-readonly .ant-picker,\n.stand-admin-readonly .ant-select-selector,\n.stand-admin-readonly .ant-input-affix-wrapper {\n  border: 1px dashed #efefef !important;\n}\n.stand-admin-readonly .ant-input-suffix,\n.stand-admin-readonly .ant-select-arrow,\n.stand-admin-readonly .ant-select-selection-item-remove {\n  visibility: hidden !important;\n}\n';
styleInject(css_248z);

var clsPrefix = 'stand-admin';
var clsNames = tuple(
  'container',
  'pagination',
  'loading',
  'searchLoading',
  'configLoading',
  'table',
  'record',
  'blinkRecord',
  'removingRecord',
  'activeRecord',
  'actionList',
  'tagList',
  'modalWrapper',
  'block',
  'footer',
  'right',
  'readonly',
);
var styles = clsNames.reduce(function(kvMap, clsName) {
  // eslint-disable-next-line no-param-reassign
  kvMap[clsName] = ''.concat(clsPrefix, '-').concat(clsName);
  return kvMap;
}, {});

var getNewMountId = getAutoIdGenerator();

var isUndefined = function isUndefined(v) {
  return v === undefined;
};

var defaultSearchParamsEqualFn = function defaultSearchParamsEqualFn(a, b) {
  return isEqual(omitBy(a, isUndefined), omitBy(b, isUndefined));
};

var defaultSuccessHandlerFn = function defaultSuccessHandlerFn(params) {
  var successMsg = params.successMsg,
    actionTitle = params.actionTitle;
  message.success(successMsg || ''.concat(actionTitle, '\u6210\u529F\uFF01'));
};

var pickProps = function pickProps(props, keys) {
  if (!keys) {
    return [];
  }

  if (keys === true) {
    return props;
  }

  return pick(props, keys);
};

function StandContextHoc(hocParams) {
  var makeRecordModelPkgDynamic = hocParams.makeRecordModelPkgDynamic,
    _hocParams$recordMode = hocParams.recordModel,
    origRecordModel =
      _hocParams$recordMode === void 0
        ? EmptyRecordModel
        : _hocParams$recordMode,
    _hocParams$configMode = hocParams.configModel,
    configModel =
      _hocParams$configMode === void 0
        ? EmptyConfigModel
        : _hocParams$configMode,
    restHocParams = _objectWithoutProperties(hocParams, [
      'makeRecordModelPkgDynamic',
      'recordModel',
      'configModel',
    ]);

  var recordModel =
    makeRecordModelPkgDynamic && origRecordModel && origRecordModel.modelOpts
      ? getDynamicModelPkg(origRecordModel, makeRecordModelPkgDynamic)
      : origRecordModel;

  var _ref = recordModel || {},
    _ref$idFieldName = _ref.idFieldName,
    idFieldName = _ref$idFieldName === void 0 ? 'id' : _ref$idFieldName,
    _ref$nameFieldName = _ref.nameFieldName,
    nameFieldName = _ref$nameFieldName === void 0 ? 'name' : _ref$nameFieldName,
    _ref$StoreNsTitle = _ref.StoreNsTitle,
    StoreNsTitle = _ref$StoreNsTitle === void 0 ? '' : _ref$StoreNsTitle,
    StoreNs = _ref.StoreNs;

  var defaultHocParams = {
    updateSearchParamsEvenError: false,
    passSearchWhenParamsEqual: false,
    passSearchUpdateIfStoreStale: false,
    syncParamsToUrl: 'auto',
    urlParamsNs: false,
    searchRecordsOnMount: true,
    searchRecordsOnParamsChange: true,
    searchRecordsOnRefresh: true,
    defaultSearchParams: undefined,
    specSearchParams: undefined,
    sorterSearchParams: undefined,
    filterSearchParams: undefined,
    reservedUrlParamNames: [],
    isSearchParamsEqual: defaultSearchParamsEqualFn,
    successHandler: defaultSuccessHandlerFn,
    resetStoreStateWhenUnmount: false,
    resetStoreStateWhenMount: false,
    placeholderIfConfigLoading: true,
    receiveContextAsProps: true,
    receiveHocParamsAsProps: [
      'defaultSearchParams',
      'specSearchParams',
      'listRowSelectionSupport',
    ],
    listRowSelectionSupport: false,
    formNamePrefix: 'Form',
  };

  var getRecordFld = function getRecordFld(record, fld) {
    if (record) {
      return record[fld];
    }

    return undefined;
  };

  var getRecordId = function getRecordId(record) {
    return getRecordFld(record, idFieldName);
  };

  var getRecordName = function getRecordName(record) {
    return getRecordFld(record, nameFieldName);
  };

  return function(WrappedComponent) {
    var Comp = /*#__PURE__*/ (function(_React$Component) {
      _inherits(Comp, _React$Component);

      var _super = _createSuper(Comp);

      function Comp(props) {
        var _this;

        _classCallCheck(this, Comp);

        _this = _super.call(this, props);
        _this.mountId = -1;
        _this.autoRegisteredStoreNsMap = {};

        _this.cancleDebouncedSearchRecords = function() {
          var cancel = _this.debouncedSearchRecords.cancel;

          if (cancel) {
            cancel();
          }
        };

        _this.resetRecordsState = function(mountId) {
          var dispatch = _this.props.dispatch;
          return dispatch({
            type: ''.concat(StoreNs, '/resetRecordsState'),
            mountId: mountId !== undefined ? mountId : _this.mountId,
          });
        };

        _this.getDvaApp = function() {
          var _getConfig = getConfig(),
            getDvaApp = _getConfig.getDvaApp;

          var app = getDvaApp();

          if (!app) {
            throw new Error('DvaApp still empty now!!');
          }

          return app;
        };

        _this.isModelNsExists = function(namespace) {
          var app = _this.getDvaApp(); // eslint-disable-next-line no-underscore-dangle

          var existModels = app._models;

          if (!existModels) {
            throw new Error('_models not exists on DvaApp');
          }

          return existModels.some(function(model) {
            return model.namespace === namespace;
          });
        };

        _this.getRecordModelPkg = function() {
          return recordModel;
        };

        _this.getConfigModelPkg = function() {
          return configModel;
        };

        _this.getRelModelPkgs = function() {
          return [_this.getRecordModelPkg(), _this.getConfigModelPkg()].filter(
            function(pkg) {
              return !!pkg;
            },
          );
        };

        _this.tryRegisterModels = function() {
          var app = _this.getDvaApp();

          _this.getRelModelPkgs().forEach(function(modelPkg) {
            if (_this.isModelNsExists(modelPkg.StoreNs)) {
              // logInfo(`Model alreay exists: ${modelPkg.StoreNs}`);
              return;
            }

            logInfo(
              ''
                .concat(StoreNsTitle, ': Load model: ')
                .concat(modelPkg.StoreNs),
            );
            app.model(modelPkg.default);

            if (modelPkg.isDynamic) {
              _this.autoRegisteredStoreNsMap[modelPkg.StoreNs] = true;
            }
          });
        };

        _this.tryUnregisterModels = function() {
          var app = _this.getDvaApp();

          _this.getRelModelPkgs().forEach(function(modelPkg) {
            if (_this.autoRegisteredStoreNsMap[modelPkg.StoreNs]) {
              logInfo(
                ''
                  .concat(StoreNsTitle, ': Unload model: ')
                  .concat(modelPkg.StoreNs),
              );
              app.unmodel(modelPkg.StoreNs);
              delete _this.autoRegisteredStoreNsMap[modelPkg.StoreNs];
            }
          });
        };

        _this.getFinalSearchParams = function(specProps, specParams) {
          var props = specProps || _this.props;

          var params = specParams || _this.getSearchParams(props);

          var finalParams = _objectSpread2(
            _objectSpread2(
              _objectSpread2({}, _this.getDefaultSearchParams(props)),
              params,
            ),
            _this.getSpecSearchParams(props),
          );

          var finalSearchParamsFilter = props.finalSearchParamsFilter;
          return finalSearchParamsFilter
            ? finalSearchParamsFilter(finalParams)
            : finalParams;
        };

        _this.calcParamsWithProp = function(propKey, specProps) {
          var props = specProps || _this.props;
          var defParams = props[propKey];

          for (
            var _len = arguments.length,
              rest = new Array(_len > 2 ? _len - 2 : 0),
              _key = 2;
            _key < _len;
            _key++
          ) {
            rest[_key - 2] = arguments[_key];
          }

          return typeof defParams === 'function'
            ? defParams.apply(void 0, rest.concat([props]))
            : defParams;
        };
        /*
         默认参数
         */

        _this.getDefaultSearchParams = function() {
          var _this2;

          for (
            var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
            _key2 < _len2;
            _key2++
          ) {
            args[_key2] = arguments[_key2];
          }

          return (_this2 = _this).calcParamsWithProp.apply(
            _this2,
            ['defaultSearchParams'].concat(args),
          );
        };
        /*
         指定参数
         */

        _this.getSpecSearchParams = function() {
          var _this3;

          for (
            var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
            _key3 < _len3;
            _key3++
          ) {
            args[_key3] = arguments[_key3];
          }

          return (_this3 = _this).calcParamsWithProp.apply(
            _this3,
            ['specSearchParams'].concat(args),
          );
        };

        _this.getSorterSearchParams = function() {
          var _this4;

          for (
            var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
            _key4 < _len4;
            _key4++
          ) {
            args[_key4] = arguments[_key4];
          }

          return (_this4 = _this).calcParamsWithProp.apply(
            _this4,
            ['sorterSearchParams'].concat(args),
          );
        };

        _this.getFilterSearchParams = function() {
          var _this5;

          for (
            var _len5 = arguments.length, args = new Array(_len5), _key5 = 0;
            _key5 < _len5;
            _key5++
          ) {
            args[_key5] = arguments[_key5];
          }

          return (_this5 = _this).calcParamsWithProp.apply(
            _this5,
            ['filterSearchParams'].concat(args),
          );
        };

        _this.searchRecords = function(specParams) {
          var _this$props = _this.props,
            dispatch = _this$props.dispatch,
            updateSearchParamsEvenError =
              _this$props.updateSearchParamsEvenError;
          _this.latestSearchParams = _this.getFinalSearchParams(
            _this.props,
            specParams,
          );
          return dispatch({
            type: ''.concat(StoreNs, '/search'),
            params: _this.latestSearchParams,
            opts: {
              updateSearchParamsEvenError: updateSearchParamsEvenError,
              mountId: _this.mountId,
            },
          });
        };

        _this.getLatestSearchParams = function() {
          return _this.latestSearchParams;
        };

        _this.getLocation = function(specProps) {
          var props = specProps || _this.props;

          if (props.location) {
            return props.location;
          }

          var _getConfig2 = getConfig(),
            getHistory = _getConfig2.getHistory;

          var history = getHistory();
          return history.location;
        };

        _this.getUrlParams = function(specProps) {
          var props = specProps || _this.props;
          return fromUrlQuery(_this.getLocation(specProps).search, {
            ns: props.urlParamsNs,
          });
        };

        _this.isSyncParamsToUrlEnabled = function(specProps) {
          var props = specProps || _this.props;
          var syncParamsToUrl = props.syncParamsToUrl;

          if (syncParamsToUrl === 'auto') {
            var _getConfig3 = getConfig(),
              getHistory = _getConfig3.getHistory;

            var history = getHistory();
            return !!(props.location && history.location === props.location);
          }

          return !!syncParamsToUrl;
        };

        _this.getSearchParams = function(specProps) {
          var props = specProps || _this.props;
          var params;

          if (_this.isSyncParamsToUrlEnabled(props)) {
            params = _this.getUrlParams(props);
          } else {
            var storeRef = props.storeRef;
            params = storeRef.searchParams;
          }

          return params;
        };

        _this.reloadSearch = function() {
          var storeRef = _this.props.storeRef;
          return _this.searchRecords(storeRef.searchParams);
        };

        _this.goSearch = /*#__PURE__*/ _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var params,
              _this$props2,
              reservedUrlParamNames,
              passSearchWhenParamsEqual,
              urlParamsNs,
              urlQueryOpts,
              reservedParams,
              searchInLocation,
              oldQueryParams,
              newQueryParams,
              searchQuery,
              restSearchQuery,
              _getConfig4,
              getHistory,
              history,
              _args = arguments;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    params =
                      _args.length > 0 && _args[0] !== undefined
                        ? _args[0]
                        : {};
                    (_this$props2 = _this.props),
                      (reservedUrlParamNames =
                        _this$props2.reservedUrlParamNames),
                      (passSearchWhenParamsEqual =
                        _this$props2.passSearchWhenParamsEqual),
                      (urlParamsNs = _this$props2.urlParamsNs);
                    urlQueryOpts = {
                      ns: urlParamsNs,
                    };

                    if (!_this.isSyncParamsToUrlEnabled()) {
                      _context.next = 19;
                      break;
                    }

                    reservedParams = {};
                    searchInLocation = _this.getLocation().search;
                    oldQueryParams = fromUrlQuery(
                      searchInLocation,
                      urlQueryOpts,
                    );

                    if (
                      reservedUrlParamNames &&
                      reservedUrlParamNames.length > 0
                    ) {
                      Object.assign(
                        reservedParams,
                        pick(oldQueryParams, reservedUrlParamNames),
                      );
                    }

                    newQueryParams = _objectSpread2(
                      _objectSpread2({}, reservedParams),
                      params,
                    );

                    if (!isQueryParamsEqual(oldQueryParams, newQueryParams)) {
                      _context.next = 13;
                      break;
                    }

                    if (!passSearchWhenParamsEqual) {
                      _context.next = 12;
                      break;
                    }

                    return _context.abrupt(
                      'return',
                      Promise.resolve('passSearchWhenParamsEqual'),
                    );

                  case 12:
                    return _context.abrupt(
                      'return',
                      _this.searchRecords(params),
                    );

                  case 13:
                    searchQuery = [toUrlQuery(newQueryParams, urlQueryOpts)];

                    if (urlParamsNs) {
                      // Keep "unrelated" params
                      restSearchQuery = toUrlQuery(
                        pickBy(fromUrlQuery(searchInLocation), function(
                          value,
                          key,
                        ) {
                          return key !== urlParamsNs;
                        }),
                      );

                      if (restSearchQuery) {
                        searchQuery.push(restSearchQuery);
                      }
                    }

                    (_getConfig4 = getConfig()),
                      (getHistory = _getConfig4.getHistory);
                    history = getHistory();
                    history.push({
                      pathname: history.location.pathname,
                      search: '?'.concat(searchQuery.join('&')),
                    });
                    return _context.abrupt(
                      'return',
                      _this.searchRecords(newQueryParams),
                    );

                  case 19:
                    return _context.abrupt(
                      'return',
                      _this.searchRecords(params),
                    );

                  case 20:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee);
          }),
        );

        _this.showEmptyRecordForm = function() {
          return _this.showRecordForm(null);
        };

        _this.hideRecordFormOnly = function() {
          var _this$props3 = _this.props,
            dispatch = _this$props3.dispatch,
            onRecordFormVisibleTagChange =
              _this$props3.onRecordFormVisibleTagChange;
          return dispatch({
            type: ''.concat(StoreNs, '/hideRecordFormOnly'),
          }).then(function() {
            if (onRecordFormVisibleTagChange) {
              onRecordFormVisibleTagChange(false);
            }
          });
        };

        _this.getRecord = function(paramsOrId) {
          var dispatch = _this.props.dispatch;
          return dispatch({
            type: ''.concat(StoreNs, '/getRecord'),
            params:
              _typeof(paramsOrId) === 'object'
                ? paramsOrId
                : _defineProperty({}, idFieldName, paramsOrId),
            opts: {
              searchOneAsBackup: true,
            },
          });
        };

        _this.getRecordMapByIdList = /*#__PURE__*/ (function() {
          var _ref4 = _asyncToGenerator(
            /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(idList) {
              var getRecordMapByIdList, recordList, dataMap;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      getRecordMapByIdList = _this.props.getRecordMapByIdList;

                      if (!getRecordMapByIdList) {
                        _context2.next = 3;
                        break;
                      }

                      return _context2.abrupt(
                        'return',
                        getRecordMapByIdList(idList),
                      );

                    case 3:
                      _context2.next = 5;
                      return Promise.all(
                        idList.map(function(id) {
                          return _this.getRecord(
                            _defineProperty({}, idFieldName, id),
                          );
                        }),
                      );

                    case 5:
                      recordList = _context2.sent;
                      dataMap = {};
                      recordList.forEach(function(record) {
                        dataMap[getRecordId(record)] = record;
                      });
                      return _context2.abrupt('return', dataMap);

                    case 9:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }),
          );

          return function(_x) {
            return _ref4.apply(this, arguments);
          };
        })();

        _this.loadAndShowRecordForm = function(paramsOrId) {
          var recordFormVisibleTag =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : true;
          var modal = Modal.info({
            content: /*#__PURE__*/ React.createElement(Spin, null),
            maskClosable: false,
            okButtonProps: {
              style: {
                display: 'none',
              },
            },
          });
          return _this
            .getRecord(paramsOrId)
            .then(function(activeRecord) {
              if (activeRecord) {
                return _this.showRecordForm(activeRecord, recordFormVisibleTag);
              }

              message.warn('没有找到相关记录！');
              return Promise.reject(activeRecord);
            })
            .finally(function() {
              modal.destroy();
            });
        };

        _this.showRecordForm = function(activeRecord) {
          var recordFormVisibleTag =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : true;
          var _this$props4 = _this.props,
            dispatch = _this$props4.dispatch,
            onRecordFormVisibleTagChange =
              _this$props4.onRecordFormVisibleTagChange;
          return dispatch({
            type: ''.concat(StoreNs, '/showRecordForm'),
            params: {
              activeRecord: activeRecord,
              recordFormVisibleTag: recordFormVisibleTag,
            },
          }).then(function() {
            if (onRecordFormVisibleTagChange) {
              onRecordFormVisibleTagChange(recordFormVisibleTag);
            }
          });
        };

        _this.clearActiveRecord = function() {
          var dispatch = _this.props.dispatch;
          return dispatch({
            type: ''.concat(StoreNs, '/clearActiveRecord'),
          });
        };

        _this.handleActionResponse = function(resp, _ref5) {
          var action = _ref5.action,
            actionTitle = _ref5.actionTitle,
            payload = _ref5.payload,
            _ref5$shouldRefresh = _ref5.shouldRefresh,
            shouldRefresh =
              _ref5$shouldRefresh === void 0 ? true : _ref5$shouldRefresh,
            successMsg = _ref5.successMsg,
            _ref5$blinkRecord = _ref5.blinkRecord,
            blinkRecord =
              _ref5$blinkRecord === void 0 ? true : _ref5$blinkRecord,
            specStoreNs = _ref5.StoreNs;

          if (resp && resp.success) {
            var _this$props5 = _this.props,
              searchRecordsOnRefresh = _this$props5.searchRecordsOnRefresh,
              onRefresh = _this$props5.onRefresh,
              successHandler = _this$props5.successHandler;

            if (successMsg !== false && successHandler) {
              successHandler({
                StoreNs: specStoreNs || StoreNs,
                successMsg: successMsg,
                action: action,
                actionTitle: actionTitle,
                payload: payload,
                shouldRefresh: shouldRefresh,
              });
            }

            var isUpdateRecord = ['updateRecord'].indexOf(action) >= 0;
            var isAddRecord = ['addRecord'].indexOf(action) >= 0;
            var isUpsert = isUpdateRecord || isAddRecord;

            if (shouldRefresh) {
              if (searchRecordsOnRefresh) {
                var _this$props$storeRef = _this.props.storeRef;
                _this$props$storeRef =
                  _this$props$storeRef === void 0 ? {} : _this$props$storeRef;
                var _this$props$storeRef$ = _this$props$storeRef.searchParams,
                  searchParams =
                    _this$props$storeRef$ === void 0
                      ? {}
                      : _this$props$storeRef$;

                _this
                  .searchRecords(
                    isAddRecord
                      ? omit(searchParams, ['pageNum'])
                      : searchParams,
                  )
                  .then(function() {
                    if (blinkRecord && isUpsert) {
                      var matchRecord = resp.data || payload.record;

                      if (matchRecord) {
                        _this.blinkRecordById(getRecordId(matchRecord));
                      }
                    }
                  });
              }

              if (onRefresh) {
                onRefresh();
              }
            }

            if (isUpsert) {
              _this.hideRecordFormOnly();
            }
          }
        };

        _this.blinkRecordById = function(id) {
          var dispatch = _this.props.dispatch;
          return dispatch({
            type: ''.concat(StoreNs, '/blinkRecordById'),
            id: id,
          });
        };

        _this.callStoreAction = function(args) {
          var action = args.action,
            origActionForCount = args.actionForCount,
            origPayload = args.payload,
            specStoreNs = args.StoreNs,
            _args$handleActionRes = args.handleActionResponse,
            handleActionResponse =
              _args$handleActionRes === void 0
                ? _this.handleActionResponse
                : _args$handleActionRes;
          var actionForCount = origActionForCount || action;

          _this.props.increaseActionCount(actionForCount);

          var dispatch = _this.props.dispatch;
          var callStoreActionPayloadFilter =
            _this.props.callStoreActionPayloadFilter;
          var payload;

          if (callStoreActionPayloadFilter) {
            payload = callStoreActionPayloadFilter(action, origPayload);
          } else {
            payload = origPayload;
          }

          if (payload && payload.type) {
            throw new Error('type field is not allowed in  payload!');
          }

          return dispatch(
            _objectSpread2(
              {
                type: ''.concat(specStoreNs || StoreNs, '/').concat(action),
              },
              payload,
            ),
          )
            .then(function(resp) {
              if (handleActionResponse) {
                handleActionResponse(resp, args);
              }

              return resp;
            })
            .finally(function() {
              _this.props.decreaseActionCount(actionForCount);
            });
        };
        /** @deprecated use callStoreAction instead */

        _this.callAction = function(action, actionTitle, payload) {
          var shouldRefresh =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : true;
          // eslint-disable-next-line no-console
          console.warn('callAction is deprecated, use callStoreAction instead');
          return _this.callStoreAction({
            action: action,
            actionTitle: actionTitle,
            payload: payload,
            shouldRefresh: shouldRefresh,
          });
        };

        _this.callService = function(_ref6) {
          var serviceTitle = _ref6.serviceTitle,
            serviceFunction = _ref6.serviceFunction,
            serviceParams = _ref6.serviceParams,
            rest = _objectWithoutProperties(_ref6, [
              'serviceTitle',
              'serviceFunction',
              'serviceParams',
            ]);

          return _this.callStoreAction(
            _objectSpread2(
              {
                action: 'callService',
                actionTitle: serviceTitle,
                payload: {
                  serviceTitle: serviceTitle,
                  serviceFunction: serviceFunction,
                  serviceParams: serviceParams,
                },
              },
              rest,
            ),
          );
        };

        _this.addRecord = function(record, opts) {
          var _ref7 = typeof opts === 'function' ? [opts] : [, opts],
            _ref8 = _slicedToArray(_ref7, 2),
            callback = _ref8[0],
            actionArgs = _ref8[1];

          return _this.callStoreAction(
            _objectSpread2(
              {
                action: 'addRecord',
                actionForCount: 'upsertRecord',
                actionTitle: '\u521B\u5EFA'.concat(StoreNsTitle),
                payload: {
                  record: record,
                  callback: callback,
                },
              },
              actionArgs,
            ),
          );
        };

        _this.updateRecord = function(record, opts) {
          var _ref9 = typeof opts === 'function' ? [opts] : [, opts],
            _ref10 = _slicedToArray(_ref9, 2),
            callback = _ref10[0],
            actionArgs = _ref10[1];

          return _this.callStoreAction(
            _objectSpread2(
              {
                action: 'updateRecord',
                actionForCount: 'upsertRecord',
                actionTitle: '\u7F16\u8F91'.concat(StoreNsTitle, ' [').concat(
                  [getRecordId(record), getRecordName(record)]
                    .filter(function(item) {
                      return !!item;
                    })
                    .join(': '),
                  '] ',
                ),
                payload: {
                  record: record,
                  callback: callback,
                },
              },
              actionArgs,
            ),
          );
        };

        _this.deleteRecord = function(params, opts) {
          var _ref11 = typeof opts === 'function' ? [opts] : [, opts],
            _ref12 = _slicedToArray(_ref11, 2),
            callback = _ref12[0],
            actionArgs = _ref12[1];

          var recordId = getRecordId(params);
          return _this.callStoreAction(
            _objectSpread2(
              {
                action: 'deleteRecord',
                actionTitle: '\u5220\u9664'
                  .concat(StoreNsTitle)
                  .concat(recordId ? ' ['.concat(recordId, '] ') : ''),
                payload: {
                  params: params,
                  callback: callback,
                },
              },
              actionArgs,
            ),
          );
        };

        _this.onShowSizeChange = function(current, pageSize) {
          var storeRef = _this.props.storeRef;
          var pagination = storeRef.pagination;
          return _this.handleTableChange(
            _objectSpread2(
              _objectSpread2({}, pagination),
              {},
              {
                current: 1,
                pageSize: pageSize,
              },
            ),
          );
        };

        _this.showTotal = function(total) {
          return '\u5171 '.concat(total.toLocaleString('en'), ' \u6761');
        };

        _this.handlePageNumChange = function(current, pageSize) {
          return _this.handleTableChange({
            current: current,
            pageSize: pageSize,
          });
        };

        _this.handleTableChange = function(_ref13, filters, sorter) {
          var current = _ref13.current,
            pageSize = _ref13.pageSize;
          var _this$props$storeRef2 = _this.props.storeRef,
            _this$props$storeRef3 = _this$props$storeRef2.searchParams,
            searchParams =
              _this$props$storeRef3 === void 0 ? {} : _this$props$storeRef3,
            _this$props$storeRef4 = _this$props$storeRef2.pagination,
            origCurrent = _this$props$storeRef4.current,
            origPageSize = _this$props$storeRef4.pageSize;
          var sorterParams = sorter
            ? _this.getSorterSearchParams(_this.props, sorter)
            : undefined;
          var filterParams = filters
            ? _this.getFilterSearchParams(_this.props, filters) || filters
            : undefined;

          var newSearchParams = _objectSpread2(
            _objectSpread2(
              _objectSpread2(_objectSpread2({}, searchParams), sorterParams),
              filterParams,
            ),
            {},
            {
              pageNum: current || origCurrent,
              pageSize: pageSize || origPageSize,
            },
          );

          var withUpdates = !_this.props.isSearchParamsEqual(
            newSearchParams,
            searchParams,
          );

          if (withUpdates) {
            _this.goSearch(
              _objectSpread2(_objectSpread2({}, searchParams), newSearchParams),
            );
          }
        };

        _this.renderEmpty = function() {
          var searchLoading = _this.props.searchLoading;
          return /*#__PURE__*/ React.createElement(Empty, {
            style: {
              marginTop: 36,
            },
            description: searchLoading
              ? /*#__PURE__*/ React.createElement(
                  'span',
                  null,
                  /*#__PURE__*/ React.createElement(LoadingOutlined, {
                    style: {
                      marginRight: 4,
                    },
                  }),
                  '\u52A0\u8F7D\u4E2D',
                )
              : undefined,
          });
        };

        _this.renderPagination = function() {
          var _ref14 =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : {},
            className = _ref14.className,
            restProps = _objectWithoutProperties(_ref14, ['className']);

          var storeRef = _this.props.storeRef;
          var pagination = storeRef.pagination;
          var total = pagination.total;

          if (total === undefined || total <= 0) {
            return null;
          }

          return /*#__PURE__*/ React.createElement(
            Pagination, // size="small"
            Object.assign(
              {
                // size="small"
                className: classNames(styles.pagination, className),
              },
              _objectSpread2(
                _objectSpread2({}, pagination),
                {},
                {
                  onChange: _this.handlePageNumChange,
                  onShowSizeChange: _this.onShowSizeChange,
                  showTotal: _this.showTotal,
                  pageSizeOptions: [10, 20, 30, 50, 100].map(function(s) {
                    return String(s);
                  }),
                  showSizeChanger: true, // showQuickJumper: true,
                },
              ),
              restProps,
            ),
          );
        };

        _this.updateConfig = function(getConfig) {
          var updateConfigLoading =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false;
          var dispatch = _this.props.dispatch;
          return dispatch({
            type: ''
              .concat(_this.getConfigModelPkg().StoreNs, '/')
              .concat(ConfigUpdateMethod),
            getConfig: getConfig,
            updateConfigLoading: updateConfigLoading,
          });
        };

        _this.getInsMethods = function() {
          var _assertThisInitialize = _assertThisInitialized(_this),
            clearActiveRecord = _assertThisInitialize.clearActiveRecord,
            hideRecordFormOnly = _assertThisInitialize.hideRecordFormOnly,
            updateRecord = _assertThisInitialize.updateRecord,
            addRecord = _assertThisInitialize.addRecord,
            showRecordForm = _assertThisInitialize.showRecordForm,
            deleteRecord = _assertThisInitialize.deleteRecord,
            goSearch = _assertThisInitialize.goSearch,
            getSearchParams = _assertThisInitialize.getSearchParams,
            reloadSearch = _assertThisInitialize.reloadSearch,
            searchRecords = _assertThisInitialize.searchRecords,
            getRecordMapByIdList = _assertThisInitialize.getRecordMapByIdList,
            getRecord = _assertThisInitialize.getRecord,
            loadAndShowRecordForm = _assertThisInitialize.loadAndShowRecordForm,
            getUrlParams = _assertThisInitialize.getUrlParams,
            showEmptyRecordForm = _assertThisInitialize.showEmptyRecordForm,
            callAction = _assertThisInitialize.callAction,
            renderPagination = _assertThisInitialize.renderPagination,
            renderEmpty = _assertThisInitialize.renderEmpty,
            handleTableChange = _assertThisInitialize.handleTableChange,
            getDefaultSearchParams =
              _assertThisInitialize.getDefaultSearchParams,
            getSpecSearchParams = _assertThisInitialize.getSpecSearchParams,
            callStoreAction = _assertThisInitialize.callStoreAction,
            callService = _assertThisInitialize.callService,
            getLatestSearchParams = _assertThisInitialize.getLatestSearchParams,
            debouncedSearchRecords =
              _assertThisInitialize.debouncedSearchRecords,
            getRecordModelPkg = _assertThisInitialize.getRecordModelPkg,
            getConfigModelPkg = _assertThisInitialize.getConfigModelPkg,
            blinkRecordById = _assertThisInitialize.blinkRecordById,
            updateConfig = _assertThisInitialize.updateConfig;

          return {
            getRecordName: getRecordName,
            getRecordId: getRecordId,
            clearActiveRecord: clearActiveRecord,
            hideRecordFormOnly: hideRecordFormOnly,
            hideRecordForm: hideRecordFormOnly,
            updateRecord: updateRecord,
            addRecord: addRecord,
            showRecordForm: showRecordForm,
            deleteRecord: deleteRecord,
            goSearch: goSearch,
            getSearchParams: getSearchParams,
            reloadSearch: reloadSearch,
            searchRecords: searchRecords,
            getRecordMapByIdList: getRecordMapByIdList,
            getRecord: getRecord,
            loadAndShowRecordForm: loadAndShowRecordForm,
            getUrlParams: getUrlParams,
            showEmptyRecordForm: showEmptyRecordForm,
            callAction: callAction,
            renderPagination: renderPagination,
            renderEmpty: renderEmpty,
            handleTableChange: handleTableChange,
            getDefaultSearchParams: getDefaultSearchParams,
            getSpecSearchParams: getSpecSearchParams,
            callStoreAction: callStoreAction,
            callService: callService,
            getLatestSearchParams: getLatestSearchParams,
            debouncedSearchRecords: debouncedSearchRecords,
            getRecordModelPkg: getRecordModelPkg,
            getConfigModelPkg: getConfigModelPkg,
            blinkRecordById: blinkRecordById,
            updateConfig: updateConfig,
          };
        };

        _this.isStoreDataStale = function() {
          var storeRef = _this.props.storeRef;
          return !!(
            storeRef &&
            storeRef.mountId &&
            _this.mountId !== storeRef.mountId
          );
        };

        _this.getBatchCheckHocInject = function() {
          var _this$props6 = _this.props,
            checkedList = _this$props6.checkedList,
            isAllChecked = _this$props6.isAllChecked,
            isRecordChecked = _this$props6.isRecordChecked,
            isChecked = _this$props6.isChecked,
            setChecked = _this$props6.setChecked,
            checkAll = _this$props6.checkAll,
            uncheckAll = _this$props6.uncheckAll,
            checkReverse = _this$props6.checkReverse,
            clearChecked = _this$props6.clearChecked,
            toggleChecked = _this$props6.toggleChecked,
            batchToggleChecked = _this$props6.batchToggleChecked,
            getCheckedList = _this$props6.getCheckedList;
          return {
            isChecked: isChecked,
            checkedList: checkedList,
            isAllChecked: isAllChecked,
            isRecordChecked: isRecordChecked,
            setChecked: setChecked,
            checkAll: checkAll,
            uncheckAll: uncheckAll,
            checkReverse: checkReverse,
            clearChecked: clearChecked,
            toggleChecked: toggleChecked,
            batchToggleChecked: batchToggleChecked,
            getCheckedList: getCheckedList,
          };
        };

        _this.getActionCounterHocInject = function() {
          var _this$props7 = _this.props,
            increaseActionCount = _this$props7.increaseActionCount,
            decreaseActionCount = _this$props7.decreaseActionCount,
            getActionCount = _this$props7.getActionCount;
          return {
            increaseActionCount: increaseActionCount,
            decreaseActionCount: decreaseActionCount,
            getActionCount: getActionCount,
          };
        };

        _this.getStandContext = function() {
          var _this$props8 = _this.props,
            configLoading = _this$props8.configLoading,
            storeRef = _this$props8.storeRef,
            configStoreRef = _this$props8.configStoreRef,
            searchLoading = _this$props8.searchLoading,
            formNamePrefix = _this$props8.formNamePrefix;
          return _objectSpread2(
            _objectSpread2(
              _objectSpread2(
                {
                  StoreNs: StoreNs,
                  storeRef: storeRef,
                  configStoreRef: configStoreRef,
                  config: configStoreRef,
                  searchLoading: searchLoading,
                  configLoading: configLoading,
                  recordNsTitle: StoreNsTitle,
                  StoreNsTitle: StoreNsTitle,
                  idFieldName: idFieldName,
                  nameFieldName: nameFieldName,
                  formNamePrefix: formNamePrefix,
                  isStoreDataStale: _this.isStoreDataStale(),
                  mountId: _this.mountId,
                  dispatch: _this.props.dispatch,
                },
                _this.getActionCounterHocInject(),
              ),
              _this.getBatchCheckHocInject(),
            ),
            _this.getInsMethods(),
          );
        };

        _this.debouncedSearchRecords = debounce(_this.searchRecords, 10);
        _this.mountId = getNewMountId();
        return _this;
      }

      _createClass(Comp, [
        {
          key: 'componentDidMount',
          value: (function() {
            var _componentDidMount = _asyncToGenerator(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee3() {
                var _this$props9, takeOverMount, searchRecordsOnMount;

                return regeneratorRuntime.wrap(
                  function _callee3$(_context3) {
                    while (1) {
                      switch ((_context3.prev = _context3.next)) {
                        case 0:
                          _context3.next = 2;
                          return this.tryRegisterModels();

                        case 2:
                          if (!this.props.resetStoreStateWhenMount) {
                            _context3.next = 5;
                            break;
                          }

                          _context3.next = 5;
                          return this.resetRecordsState(this.mountId);

                        case 5:
                          (_this$props9 = this.props),
                            (takeOverMount = _this$props9.takeOverMount),
                            (searchRecordsOnMount =
                              _this$props9.searchRecordsOnMount);

                          if (!takeOverMount) {
                            if (searchRecordsOnMount) {
                              this.searchRecords();
                            }
                          }

                        case 7:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  },
                  _callee3,
                  this,
                );
              }),
            );

            function componentDidMount() {
              return _componentDidMount.apply(this, arguments);
            }

            return componentDidMount;
          })(),
        },
        {
          key: 'componentDidUpdate',
          value: function componentDidUpdate(prevProps) {
            // whyDidYouUpdate(StoreNsTitle, prevProps, this.props);
            var _this$props10 = this.props,
              searchRecordsOnParamsChange =
                _this$props10.searchRecordsOnParamsChange,
              isSearchParamsEqual = _this$props10.isSearchParamsEqual,
              passSearchUpdateIfStoreStale =
                _this$props10.passSearchUpdateIfStoreStale;

            if (searchRecordsOnParamsChange) {
              var prevSearchParams = this.getFinalSearchParams(prevProps);
              var currentSearchParams = this.getFinalSearchParams(this.props);
              var searchParamsChanged =
                !isSearchParamsEqual(prevSearchParams, currentSearchParams) &&
                !isSearchParamsEqual(
                  currentSearchParams,
                  this.latestSearchParams || {},
                );

              if (
                searchParamsChanged &&
                !(passSearchUpdateIfStoreStale && this.isStoreDataStale())
              ) {
                this.debouncedSearchRecords();
              }
            }
          },
        },
        {
          key: 'componentWillUnmount',
          value: (function() {
            var _componentWillUnmount = _asyncToGenerator(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(
                  function _callee4$(_context4) {
                    while (1) {
                      switch ((_context4.prev = _context4.next)) {
                        case 0:
                          this.cancleDebouncedSearchRecords();
                          _context4.next = 3;
                          return this.tryUnregisterModels();

                        case 3:
                          if (!this.props.resetStoreStateWhenUnmount) {
                            _context4.next = 6;
                            break;
                          }

                          _context4.next = 6;
                          return this.resetRecordsState(null);

                        case 6:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  },
                  _callee4,
                  this,
                );
              }),
            );

            function componentWillUnmount() {
              return _componentWillUnmount.apply(this, arguments);
            }

            return componentWillUnmount;
          })(),
        },
        {
          key: 'render',
          value: function render() {
            var _classNames;

            var _this$props11 = this.props,
              configLoading = _this$props11.configLoading,
              placeholderIfConfigLoading =
                _this$props11.placeholderIfConfigLoading,
              wrapperClassName = _this$props11.wrapperClassName,
              wrapperStyle = _this$props11.wrapperStyle,
              searchLoading = _this$props11.searchLoading,
              receiveContextAsProps = _this$props11.receiveContextAsProps,
              receiveHocParamsAsProps = _this$props11.receiveHocParamsAsProps,
              restProps = _objectWithoutProperties(_this$props11, [
                'configLoading',
                'placeholderIfConfigLoading',
                'wrapperClassName',
                'wrapperStyle',
                'searchLoading',
                'receiveContextAsProps',
                'receiveHocParamsAsProps',
              ]);

            if (configLoading && placeholderIfConfigLoading) {
              return placeholderIfConfigLoading === true
                ? /*#__PURE__*/ React.createElement(Spin, null)
                : placeholderIfConfigLoading;
            }

            var contextVal = this.getStandContext();
            var hocParamsKeys = Object.keys(defaultHocParams);

            var finalProps = _objectSpread2(
              _objectSpread2(
                _objectSpread2(
                  {
                    // inject props
                    isStandAdminHoc: true,
                    getStandContext: this.getStandContext,
                  },
                  pickProps(contextVal, receiveContextAsProps),
                ),
                pickProps(
                  pick(restProps, hocParamsKeys),
                  receiveHocParamsAsProps,
                ),
              ),
              omit(
                restProps,
                [].concat(
                  _toConsumableArray(Object.keys(contextVal)),
                  _toConsumableArray(hocParamsKeys),
                ),
              ),
            );

            return /*#__PURE__*/ React.createElement(
              'div',
              {
                style: wrapperStyle,
                className: classNames(
                  styles.container,
                  ((_classNames = {}),
                  _defineProperty(
                    _classNames,
                    styles.searchLoading,
                    searchLoading,
                  ),
                  _defineProperty(
                    _classNames,
                    styles.configLoading,
                    configLoading,
                  ),
                  _defineProperty(
                    _classNames,
                    styles.loading,
                    searchLoading ||
                      configLoading ||
                      contextVal.getActionCount() > 0,
                  ),
                  _classNames),
                  wrapperClassName,
                ),
              },
              /*#__PURE__*/ React.createElement(
                StandContext.Provider,
                {
                  value: contextVal,
                },
                /*#__PURE__*/ React.createElement(
                  WrappedComponent,
                  Object.assign({}, finalProps),
                ),
              ),
            );
          },
        },
      ]);

      return Comp;
    })(React.Component);

    Comp.displayName = 'Records_'.concat(getDisplayName(WrappedComponent));
    Comp.defaultProps = _objectSpread2(
      _objectSpread2({}, defaultHocParams),
      restHocParams,
    );
    return StandConnectHoc({
      configModel: configModel,
      recordModel: recordModel,
    })(
      ActionCounterHoc()(
        BatchCheckHoc({
          recordMatch: function recordMatch(a, b) {
            if (a === b) {
              return true;
            }

            var aId = getRecordId(a);
            var bId = getRecordId(b);

            if (aId) {
              return aId === bId;
            }

            return isEqual(a, b);
          },
        })(Comp),
      ),
    );
  };
}

function usePersistFn(fn) {
  var ref = useRef(function() {
    throw new Error('Cannot call function while rendering.');
  });
  ref.current = fn;
  var persistFn = useCallback(
    function() {
      return ref.current.apply(ref, arguments);
    },
    [ref],
  );
  return persistFn;
}

function isFunction$1(obj) {
  return typeof obj === 'function';
}

var useUnmount = function useUnmount(fn) {
  var fnPersist = usePersistFn(fn);
  useEffect(
    function() {
      return function() {
        if (isFunction$1(fnPersist)) {
          fnPersist();
        }
      };
    },
    [fnPersist],
  );
};

function useStandContext() {
  var context = useContext(StandContext);
  return context;
}

var TagProp = '_cus_tag_';
function IdSelectCtrlHoc() {
  var globalRecordCache = {};
  return function(WrappedComponent) {
    var Comp = function Comp(props) {
      var _Object$assign;

      var _useStandContext = useStandContext(),
        getRecordId = _useStandContext.getRecordId,
        idFieldName = _useStandContext.idFieldName,
        nameFieldName = _useStandContext.nameFieldName,
        defaultGetRecordMapByIdList = _useStandContext.getRecordMapByIdList;

      var defaultCheckedIdList = props.defaultCheckedIdList,
        origCheckedIdList = props.checkedIdList,
        _props$getRecordMapBy = props.getRecordMapByIdList,
        getRecordMapByIdList =
          _props$getRecordMapBy === void 0
            ? defaultGetRecordMapByIdList
            : _props$getRecordMapBy,
        origOnChange = props.onChange,
        onChangeWithData = props.onChangeWithData,
        rest = _objectWithoutProperties(props, [
          'defaultCheckedIdList',
          'checkedIdList',
          'getRecordMapByIdList',
          'onChange',
          'onChangeWithData',
        ]);

      var isControlledMode = 'checkedIdList' in props;
      var checkedIdList = useMemo(
        function() {
          return (
            (isControlledMode ? origCheckedIdList : defaultCheckedIdList) || []
          );
        },
        [isControlledMode, origCheckedIdList, defaultCheckedIdList],
      );

      var _useState = useState(globalRecordCache),
        _useState2 = _slicedToArray(_useState, 2),
        recordCache = _useState2[0],
        setRecordCache = _useState2[1];

      var hasUnMount = false;
      useUnmount(function() {
        hasUnMount = true;
      });
      var updateRecordCache = usePersistFn(function(newRecordMap) {
        Object.assign(recordCache, newRecordMap);
        Object.assign(globalRecordCache, recordCache);

        if (!hasUnMount) {
          setRecordCache(_objectSpread2({}, recordCache));
        }
      });
      var tagRecordByIdList = usePersistFn(function(ids, tag) {
        updateRecordCache(
          ids.reduce(function(map, id) {
            // eslint-disable-next-line no-param-reassign
            map[id] = tag ? _defineProperty({}, TagProp, tag) : undefined;
            return map;
          }, {}),
        );
      });
      var onChange = usePersistFn(function(itemList) {
        updateRecordCache(
          itemList.reduce(function(map, item) {
            // eslint-disable-next-line no-param-reassign
            map[getRecordId(item)] = item;
            return map;
          }, {}),
        );

        if (onChangeWithData) {
          onChangeWithData(itemList);
        }

        return (
          origOnChange &&
          origOnChange(
            itemList.map(function(item) {
              return getRecordId(item);
            }),
          )
        );
      });
      useEffect(
        function() {
          var update = /*#__PURE__*/ (function() {
            var _ref2 = _asyncToGenerator(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
                var missingIds, newRecordMap;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        missingIds = checkedIdList.filter(function(id) {
                          return !recordCache[id];
                        });

                        if (!missingIds.length) {
                          _context.next = 8;
                          break;
                        }

                        tagRecordByIdList(missingIds, 'loading');
                        _context.next = 5;
                        return getRecordMapByIdList(missingIds);

                      case 5:
                        newRecordMap = _context.sent;
                        tagRecordByIdList(missingIds, false);
                        updateRecordCache(newRecordMap);

                      case 8:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee);
              }),
            );

            return function update() {
              return _ref2.apply(this, arguments);
            };
          })();

          update();
        },
        [checkedIdList],
      );
      var checkedList = useMemo(
        function() {
          var getFullRecord = function getFullRecord(id) {
            var _ref3;

            var record = recordCache[id];

            if (record && !record[TagProp]) {
              return record;
            }

            return (
              (_ref3 = {}),
              _defineProperty(_ref3, idFieldName, id),
              _defineProperty(_ref3, nameFieldName, '...'),
              _ref3
            );
          };

          return checkedIdList.map(function(id) {
            return getFullRecord(id);
          });
        },
        [checkedIdList, recordCache],
      );
      return /*#__PURE__*/ React.createElement(
        WrappedComponent,
        Object.assign(
          {},
          ((_Object$assign = {}),
          _defineProperty(
            _Object$assign,
            isControlledMode ? 'checkedList' : 'defaultCheckedList',
            checkedList,
          ),
          _defineProperty(_Object$assign, 'onChange', onChange),
          _Object$assign),
          rest,
        ),
      );
    };

    return Comp;
  };
}

function defaultModalTriggerButtonRender(opts) {
  var props = opts.props,
    showModal = opts.showModal,
    context = opts.context;
  var recordNsTitle = context.recordNsTitle,
    checkedList = context.checkedList;
  var modalTriggerDisabled = props.modalTriggerDisabled,
    modalTriggerTitle = props.modalTriggerTitle;
  return /*#__PURE__*/ React.createElement(
    Button,
    {
      icon: /*#__PURE__*/ React.createElement(PlusCircleOutlined, null),
      disabled: modalTriggerDisabled,
      onClick: showModal,
    },
    modalTriggerTitle || '\u9009\u62E9'.concat(recordNsTitle),
    ' (\u5DF2\u9009 ',
    checkedList.length,
    ')',
  );
}

function defaultModalTriggerCheckedListRender(opts) {
  var context = opts.context;
  var toggleChecked = context.toggleChecked,
    checkedList = context.checkedList,
    getRecordId = context.getRecordId,
    getRecordName = context.getRecordName;
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: styles.tagList,
    },
    checkedList.map(function(record) {
      return /*#__PURE__*/ React.createElement(
        Tag,
        {
          key: getRecordId(record),
          closable: true,
          onClose: function onClose() {
            toggleChecked(record, false);
          },
        },
        getRecordId(record),
        record ? ': '.concat(getRecordName(record)) : '',
      );
    }),
  );
}

function defaultModalTriggerRender(opts) {
  var props = opts.props;
  var modalTriggerClassName = props.modalTriggerClassName;
  var _props$modalTriggerBu = props.modalTriggerButtonRender,
    modalTriggerButtonRender =
      _props$modalTriggerBu === void 0
        ? defaultModalTriggerButtonRender
        : _props$modalTriggerBu,
    _props$modalTriggerCh = props.modalTriggerCheckedListRender,
    modalTriggerCheckedListRender =
      _props$modalTriggerCh === void 0
        ? defaultModalTriggerCheckedListRender
        : _props$modalTriggerCh;
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: modalTriggerClassName,
    },
    modalTriggerButtonRender(opts),
    modalTriggerCheckedListRender(opts),
  );
}

function StandSelectCtrlHoc(hocParams) {
  var restHocParams = _extends({}, hocParams);

  var defaultHocParams = {
    isModalMode: true,
    isStandListCtrl: true,
    listRowSelectionSupport: true,
    defaultModalVisible: false,
    searchRecordsOnMount: false,
    clearCheckedAfterClose: false,
    resetSearchParamsOnModalShow: false,
    resetCheckedOnModalShow: false,
    passSearchUpdateIfStoreStale: true,
    syncParamsToUrl: false,
  };

  if ('isModalMode' in restHocParams && !('syncParamsToUrl' in restHocParams)) {
    defaultHocParams.syncParamsToUrl = !restHocParams.isModalMode;
  }

  return function(WrappedComponent) {
    var Comp = /*#__PURE__*/ (function(_React$Component) {
      _inherits(Comp, _React$Component);

      var _super = _createSuper(Comp);

      function Comp(props) {
        var _this;

        _classCallCheck(this, Comp);

        _this = _super.call(this, props);

        _this.isModalVisible = function(specProps, specState) {
          var _ref = specState || _this.state,
            modalVisible = _ref.modalVisible;

          return modalVisible;
        };

        _this.showModal = function() {
          _this.toggleVisible(true);
        };

        _this.hideModal = function() {
          _this.toggleVisible(false);
        };

        _this.toggleVisible = function(v) {
          _this.setState({
            modalVisible: v,
          });

          var _this$props = _this.props,
            onModalShow = _this$props.onModalShow,
            onModalHide = _this$props.onModalHide,
            onModalVisibleChange = _this$props.onModalVisibleChange,
            resetCheckedOnModalShow = _this$props.resetCheckedOnModalShow,
            defaultCheckedList = _this$props.defaultCheckedList;
          var setChecked = _this.context.setChecked;

          if (v) {
            if (resetCheckedOnModalShow) {
              setChecked(defaultCheckedList || []);
            }

            if (onModalShow) {
              onModalShow();
            }
          } else if (onModalHide) {
            onModalHide();
          }

          if (onModalVisibleChange) {
            onModalVisibleChange(v);
          }
        };

        _this.toggleModalVisible = function(v) {
          return _this.toggleVisible(v);
        };

        _this.handleOK = function() {
          var checkedList = _this.context.checkedList;

          _this.hideModal();

          var onModalOk = _this.props.onModalOk;

          if (onModalOk) {
            onModalOk({
              checkedList: checkedList,
            });
          }
        };

        _this.clearChecked = function() {
          _this.context.clearChecked();
        };

        _this.renderFooter = function() {
          var _this$props2 = _this.props,
            listRowSelectionSupport = _this$props2.listRowSelectionSupport,
            maxCheckedLength = _this$props2.maxCheckedLength;
          var _this$context = _this.context,
            storeRef = _this$context.storeRef,
            checkedList = _this$context.checkedList,
            checkAll = _this$context.checkAll,
            isAllChecked = _this$context.isAllChecked;

          var _ref2 = storeRef || {},
            _ref2$records = _ref2.records,
            records = _ref2$records === void 0 ? [] : _ref2$records;

          return /*#__PURE__*/ React.createElement(
            'div',
            {
              className: styles.footer,
            },
            listRowSelectionSupport &&
              /*#__PURE__*/ React.createElement(
                React.Fragment,
                null,
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: styles.block,
                  },
                  maxCheckedLength > 0
                    ? '\u9650\u9009 '.concat(maxCheckedLength, '\uFF0C')
                    : '',
                  '\u5DF2\u9009',
                  ' ',
                  checkedList.length,
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: styles.block,
                  },
                  /*#__PURE__*/ React.createElement(
                    Button,
                    {
                      type: 'link',
                      disabled: isAllChecked(records),
                      onClick: function onClick() {
                        return checkAll(records);
                      },
                    },
                    '\u5168\u9009',
                  ),
                  /*#__PURE__*/ React.createElement(
                    Button,
                    {
                      type: 'link',
                      disabled: checkedList.length === 0,
                      onClick: _this.clearChecked,
                    },
                    '\u6E05\u7A7A',
                  ),
                ),
              ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: classNames(styles.block, styles.right),
              },
              /*#__PURE__*/ React.createElement(
                Button,
                {
                  style: {
                    width: 80,
                  },
                  type: 'primary',
                  onClick: _this.handleOK,
                },
                '\u786E\u5B9A',
              ),
            ),
          );
        };

        _this.renderModalTrigger = function() {
          var _this$props$modalTrig = _this.props.modalTrigger,
            modalTrigger =
              _this$props$modalTrig === void 0
                ? defaultModalTriggerRender
                : _this$props$modalTrig;

          if (typeof modalTrigger === 'function') {
            return modalTrigger(_assertThisInitialized(_this));
          }

          return modalTrigger;
        };

        _this.onCheckChange = function(checked, record) {
          _this.context.toggleChecked(record, checked);
        };

        _this.onModalAfterClose = function() {
          var _this$props3 = _this.props,
            _this$props3$modalPro = _this$props3.modalProps,
            modalProps =
              _this$props3$modalPro === void 0 ? {} : _this$props3$modalPro,
            clearCheckedAfterClose = _this$props3.clearCheckedAfterClose;

          var _ref3 = modalProps || {},
            origAfterClose = _ref3.afterClose;

          if (clearCheckedAfterClose) {
            _this.clearChecked();
          }

          if (origAfterClose) {
            origAfterClose();
          }
        };

        _this.renderModal = function(mainContent) {
          var recordNsTitle = _this.context.recordNsTitle;
          var _this$props4 = _this.props,
            modalProps = _this$props4.modalProps,
            modalWrapperClassName = _this$props4.modalWrapperClassName;

          var modalVisible = _this.isModalVisible();

          return /*#__PURE__*/ React.createElement(
            Modal,
            Object.assign(
              {
                wrapClassName: classNames(
                  styles.modalWrapper,
                  modalWrapperClassName,
                ),
                title: '\u9009\u62E9'.concat(recordNsTitle),
                // onOk={this.handleOk}
                onCancel: _this.hideModal,
                // afterClose={this.onAfterClose}
                width: '80%',
                footer: _this.renderFooter(),
                destroyOnClose: true,
              },
              modalProps,
              {
                afterClose: _this.onModalAfterClose,
                visible: modalVisible,
              },
            ),
            /*#__PURE__*/ React.cloneElement(mainContent, {
              toggleModalVisible: _this.toggleVisible,
            }),
          );
        };

        _this.state = {
          modalVisible:
            'modalVisible' in props
              ? props.modalVisible
              : props.defaultModalVisible,
        };
        return _this;
      }

      _createClass(
        Comp,
        [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var _this$props5 = this.props,
                searchRecordsOnMount = _this$props5.searchRecordsOnMount,
                isModalMode = _this$props5.isModalMode;

              if (
                !isModalMode ||
                this.isModalVisible() ||
                searchRecordsOnMount
              ) {
                this.context.debouncedSearchRecords();
              }
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps, prevState) {
              var prevModalVisible = this.isModalVisible(prevProps, prevState);
              var currModalVisible = this.isModalVisible();

              if (!prevModalVisible && currModalVisible) {
                var resetSearchParamsOnModalShow = this.props
                  .resetSearchParamsOnModalShow;
                this.context.debouncedSearchRecords(
                  resetSearchParamsOnModalShow ? {} : undefined,
                );
              }
            },
          },
          {
            key: 'render',
            value: function render() {
              var _this$props6 = this.props,
                modalProps = _this$props6.modalProps,
                modalTrigger = _this$props6.modalTrigger,
                modalTriggerTitle = _this$props6.modalTriggerTitle,
                modalWrapperClassName = _this$props6.modalWrapperClassName,
                modalTriggerClassName = _this$props6.modalTriggerClassName,
                isModalMode = _this$props6.isModalMode,
                restProps = _objectWithoutProperties(_this$props6, [
                  'modalProps',
                  'modalTrigger',
                  'modalTriggerTitle',
                  'modalWrapperClassName',
                  'modalTriggerClassName',
                  'isModalMode',
                ]);

              var mainContent = /*#__PURE__*/ React.createElement(
                WrappedComponent,
                Object.assign({}, restProps, {
                  isModalMode: isModalMode,
                }),
              );
              return isModalMode
                ? /*#__PURE__*/ React.createElement(
                    Fragment,
                    null,
                    this.renderModalTrigger(),
                    this.renderModal(mainContent),
                  )
                : mainContent;
            },
          },
        ],
        [
          {
            key: 'getDerivedStateFromProps',
            value: function getDerivedStateFromProps(props, state) {
              if ('modalVisible' in props) {
                return _objectSpread2(
                  _objectSpread2({}, state),
                  {},
                  {
                    modalVisible: props.modalVisible,
                  },
                );
              }

              return null;
            },
          },
        ],
      );

      return Comp;
    })(React.Component);

    Comp.defaultProps = _objectSpread2(
      _objectSpread2({}, defaultHocParams),
      restHocParams,
    );
    Comp.contextType = StandContext;

    var standHocParams = _objectSpread2(
      _objectSpread2(_objectSpread2({}, defaultHocParams), restHocParams),
      {},
      {
        takeOverMount: true,
      },
    );

    var FinalComp = StandContextHoc(
      _objectSpread2(
        {
          makeRecordModelPkgDynamic: standHocParams.isModalMode
            ? 'ListCtrl'
            : undefined,
        },
        standHocParams,
      ),
    )(Comp);

    var IdSelectHocParams = _objectSpread2(
      {
        makeRecordModelPkgDynamic: 'IdSelectCtrl',
      },
      standHocParams,
    );

    FinalComp.IdSelectCtrl = StandContextHoc(
      _objectSpread2(
        _objectSpread2({}, IdSelectHocParams),
        {},
        {
          makeRecordModelPkgDynamic: 'IdSelectCtrlOuterWrapper',
          searchRecordsOnParamsChange: false,
          searchRecordsOnMount: false,
          receiveHocParamsAsProps: false,
          receiveContextAsProps: false,
        },
      ),
    )(
      // First StandContextHoc hoc, just provide the context IdSelectCtrlHoc needs
      IdSelectCtrlHoc()(
        // Second level, the real core ListHocComp
        StandContextHoc(IdSelectHocParams)(Comp),
      ),
    );
    return FinalComp;
  };
}

function index(hocParams) {
  var _hocParams$recordMode = hocParams.recordModel,
    recordModel =
      _hocParams$recordMode === void 0
        ? EmptyRecordModel
        : _hocParams$recordMode;
  return function(WrappedComponent) {
    var Comp = function Comp(props) {
      var _useStandContext = useStandContext(),
        searchLoading = _useStandContext.searchLoading,
        records = _useStandContext.storeRef.records;

      return /*#__PURE__*/ React.createElement(
        WrappedComponent,
        Object.assign({}, props, {
          recordInfoLoading: searchLoading,
          recordInfo: records && records[0],
        }),
      );
    };

    return StandContextHoc(
      _objectSpread2(
        _objectSpread2({}, hocParams),
        {},
        {
          recordModel: buildStandRecordModelPkg(
            _objectSpread2(
              _objectSpread2({}, recordModel.modelOpts),
              {},
              {
                StoreNs: getAutoStoreNs('Info_'.concat(recordModel.StoreNs)),
                searchRecords: function searchRecords(params) {
                  var _ref = recordModel.modelOpts || {},
                    getRecord = _ref.getRecord,
                    searchRecords = _ref.searchRecords,
                    _ref$fldsPathInResp = _ref.fldsPathInResp,
                    fldsPathInResp =
                      _ref$fldsPathInResp === void 0 ? {} : _ref$fldsPathInResp,
                    _ref$searchParamsMap = _ref.searchParamsMap,
                    searchParamsMap =
                      _ref$searchParamsMap === void 0
                        ? {}
                        : _ref$searchParamsMap;

                  if (getRecord) {
                    return getRecord(
                      omit(params, [
                        searchParamsMap['pageSize'],
                        searchParamsMap['pageNum'],
                      ]),
                    ).then(function(resp) {
                      if (!resp.success) {
                        return resp;
                      }

                      var listPath =
                        (fldsPathInResp && fldsPathInResp.list) || 'data.list';
                      var finalResp = {
                        success: true,
                      };
                      var targetListPathItem = Array.isArray(listPath)
                        ? listPath[0]
                        : listPath;

                      if (typeof targetListPathItem !== 'string') {
                        throw new Error(
                          'fldsPathInResp.list is supposed to be a string for RecordInfoHoc!',
                        );
                      }

                      set(
                        finalResp,
                        targetListPathItem.split('.'),
                        resp.data ? [resp.data] : [],
                      );
                      return finalResp;
                    });
                  } else {
                    return searchRecords(params);
                  }
                },
              },
            ),
          ),
        },
      ),
    )(Comp);
  };
}

var defaultHocParamsInDefineFn = {
  receiveContextAsProps: false,
};
function defineContextHocParams(params) {
  return _objectSpread2(_objectSpread2({}, defaultHocParamsInDefineFn), params);
}
function defineFullContextHocParams(params) {
  return _objectSpread2(_objectSpread2({}, defaultHocParamsInDefineFn), params);
}
function defineSelectCtrlHocParams(params) {
  return _objectSpread2(_objectSpread2({}, defaultHocParamsInDefineFn), params);
}
/** @deprecated use StandContextHoc instead */

var StandRecordsHoc = StandContextHoc;
/** @deprecated use StandSelectCtrlHoc instead */

var StandListCtrlHoc = StandSelectCtrlHoc;
/** @deprecated use defineSelectCtrlHocParams instead */

var defineListCtrlHocParams = defineSelectCtrlHocParams;
/** @deprecated use defineFullContextHocParams instead */

var defineFullHocParams = defineFullContextHocParams;
/** @deprecated use defineContextHocParams instead */

var defineCommonHocParams = defineContextHocParams;

function calColWidth(columns, defaultColWidth) {
  var total = 0;
  columns.forEach(function(col) {
    if (col.width) {
      if (typeof col.width === 'number') {
        total += col.width;
      }
    } else if ('children' in col) {
      if (col.children) {
        total += calColWidth(col.children, defaultColWidth);
      }
    } else {
      total += defaultColWidth;
    }
  });
  return total;
}
function getOptsForStandTableList(props) {
  var _props$listRowSelecti = props.listRowSelectionSupport,
    listRowSelectionSupport =
      _props$listRowSelecti === void 0 ? false : _props$listRowSelecti,
    maxCheckedLength = props.maxCheckedLength,
    _props$isModalMode = props.isModalMode,
    isModalMode = _props$isModalMode === void 0 ? false : _props$isModalMode,
    specSearchParams = props.specSearchParams;
  var opts = {
    listRowSelectionSupport: listRowSelectionSupport,
    maxCheckedLength: maxCheckedLength,
    isModalMode: isModalMode,
  };

  if (specSearchParams) {
    var specParamsMap =
      typeof specSearchParams === 'function'
        ? specSearchParams(props)
        : specSearchParams;
    Object.assign(opts, {
      disabledSearchParams: Object.keys(specParamsMap).filter(function(k) {
        return specParamsMap[k] !== undefined;
      }),
    });
  }

  return opts;
}
function useStandTableList(opts) {
  var stOpts = useMemo(
    function() {
      return (
        (opts && 'isStandAdminHoc' in opts
          ? getOptsForStandTableList(opts)
          : opts) || {}
      );
    },
    [opts],
  );
  var _stOpts$listRowSelect = stOpts.listRowSelectionSupport,
    listRowSelectionSupport =
      _stOpts$listRowSelect === void 0 ? false : _stOpts$listRowSelect,
    maxCheckedLength = stOpts.maxCheckedLength,
    _stOpts$isModalMode = stOpts.isModalMode,
    isModalMode = _stOpts$isModalMode === void 0 ? false : _stOpts$isModalMode;
  var context = useStandContext();
  var _context$checkedList = context.checkedList,
    checkedList = _context$checkedList === void 0 ? [] : _context$checkedList,
    setChecked = context.setChecked;
  var renderPagination = context.renderPagination,
    showRecordForm = context.showRecordForm,
    loadAndShowRecordForm = context.loadAndShowRecordForm,
    storeRef = context.storeRef,
    getRecordId = context.getRecordId,
    idFieldName = context.idFieldName,
    searchLoading = context.searchLoading,
    handleTableChange = context.handleTableChange;
  var records = storeRef.records,
    activeRecord = storeRef.activeRecord,
    blinkRecord = storeRef.blinkRecord,
    removingRecord = storeRef.removingRecord;

  var onSelectChange = function onSelectChange(selectedRowKeys, selectedRows) {
    var recordsIdMap = records.reduce(function(map, item) {
      // eslint-disable-next-line no-param-reassign
      map[getRecordId(item)] = item;
      return map;
    }, {});
    var rowsNotInRecords = checkedList.filter(function(item) {
      return !recordsIdMap[getRecordId(item)];
    });

    if (setChecked) {
      // records.filter((item) => selectedRowKeys.indexOf(getRecordId(item)) >= 0)
      setChecked(
        [].concat(
          _toConsumableArray(rowsNotInRecords),
          _toConsumableArray(selectedRows),
        ),
      );
    }
  };

  var tableListProps = {
    dataSource: records,
    bordered: false,
    size: isModalMode && listRowSelectionSupport ? 'small' : undefined,
    rowSelection: listRowSelectionSupport
      ? {
          selectedRowKeys: checkedList.map(function(item) {
            return getRecordId(item);
          }),
          onChange: onSelectChange,
          type: maxCheckedLength === 1 ? 'radio' : 'checkbox',
        }
      : undefined,
    className: styles.table,
    onRow: function onRow(record) {
      var _classNames;

      return {
        className: classNames(
          styles.record,
          ((_classNames = {}),
          _defineProperty(
            _classNames,
            styles.activeRecord,
            record === activeRecord,
          ),
          _defineProperty(
            _classNames,
            styles.blinkRecord,
            record === blinkRecord,
          ),
          _defineProperty(
            _classNames,
            styles.removingRecord,
            record === removingRecord,
          ),
          _classNames),
        ),
      };
    },
    rowKey: idFieldName,
    loading: searchLoading,
    pagination: false,
    onChange: handleTableChange,
  };
  return {
    context: context,
    config: context.config,
    records: records,
    showRecordForm: showRecordForm,
    loadAndShowRecordForm: loadAndShowRecordForm,
    tableListStyles: styles,
    tableListProps: tableListProps,
    searchLoading: searchLoading,
    standRender: function standRender(params) {
      var _params$hasPagination = params.hasPagination,
        hasPagination =
          _params$hasPagination === void 0 ? true : _params$hasPagination,
        _params$noFiltersForD = params.noFiltersForDisabledSearchParams,
        noFiltersForDisabledSearchParams =
          _params$noFiltersForD === void 0 ? true : _params$noFiltersForD,
        _params$autoScrollX = params.autoScrollX,
        autoScrollX =
          _params$autoScrollX === void 0 ? false : _params$autoScrollX,
        _params$scroll = params.scroll,
        scroll = _params$scroll === void 0 ? {} : _params$scroll,
        columns = params.columns,
        restProps = _objectWithoutProperties(params, [
          'hasPagination',
          'noFiltersForDisabledSearchParams',
          'autoScrollX',
          'scroll',
          'columns',
        ]); // 禁用的搜索项禁用过滤

      if (noFiltersForDisabledSearchParams && stOpts.disabledSearchParams) {
        stOpts.disabledSearchParams.forEach(function(paramKey) {
          if (columns) {
            var colItem = columns.find(function(item) {
              return item.dataIndex === paramKey;
            });

            if (colItem) {
              if (colItem.filters) {
                delete colItem.filters;
              }
            }
          }
        });
      }

      if (autoScrollX) {
        var _ref = _typeof(autoScrollX) === 'object' ? autoScrollX : {},
          _ref$defaultWidth = _ref.defaultWidth,
          defaultWidth = _ref$defaultWidth === void 0 ? 200 : _ref$defaultWidth,
          _ref$extraWidth = _ref.extraWidth,
          extraWidth = _ref$extraWidth === void 0 ? 0 : _ref$extraWidth;

        if (columns) {
          Object.assign(scroll, {
            x: calColWidth(columns, defaultWidth) + extraWidth,
          });
        }
      }

      var size = restProps.size;

      var paginationProps = _objectSpread2(
        {
          size: size === 'small' ? 'small' : undefined,
        },
        typeof hasPagination === 'boolean' ? undefined : hasPagination,
      );

      return /*#__PURE__*/ React.createElement(
        Fragment,
        null,
        /*#__PURE__*/ React.createElement(
          Table,
          Object.assign({}, tableListProps, restProps, {
            columns: columns,
            scroll: scroll,
          }),
        ),
        hasPagination && renderPagination(paginationProps),
      );
    },
  };
}

var List = function(props) {
  var targetFormInfo = props.targetFormInfo,
    formValuesEncoder = props.formValuesEncoder,
    formValuesFilter = props.formValuesFilter,
    toggleModalVisible = props.toggleModalVisible,
    actionHooks = props.actionHooks;
  var targetForm = targetFormInfo.form;

  var _useStandTableList = useStandTableList(
      _objectSpread2({}, getOptsForStandTableList(props)),
    ),
    context = _useStandTableList.context,
    showRecordForm = _useStandTableList.showRecordForm,
    tableListStyles = _useStandTableList.tableListStyles,
    standRender = _useStandTableList.standRender;

  var deleteRecord = context.deleteRecord,
    idFieldName = context.idFieldName,
    getRecordId = context.getRecordId,
    getRecordName = context.getRecordName;

  var recoverRecord = function recoverRecord(record) {
    var _ref = formValuesEncoder || {},
      _ref$decode = _ref.decode,
      decode = _ref$decode === void 0 ? decodeFormValues : _ref$decode;

    var _ref2 = formValuesFilter || {},
      _ref2$beforeRestore = _ref2.beforeRestore,
      beforeRestore =
        _ref2$beforeRestore === void 0 ? identity$1 : _ref2$beforeRestore;

    var formValues = beforeRestore(decode(record.formVals));
    targetForm.setFieldsValue(formValues);

    var _ref3 = actionHooks || {},
      afterRestore = _ref3.afterRestore;

    if (afterRestore) {
      afterRestore({
        formValues: formValues,
      });
    }

    if (toggleModalVisible) {
      toggleModalVisible(false);
    }
  };

  var columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   fixed: 'left',
    //   width: 80,
    // },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '修改时间',
      dataIndex: 'updateAt',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 170,
      render: function render(_, record) {
        return /*#__PURE__*/ React.createElement(
          'ul',
          {
            className: tableListStyles.actionList,
          },
          /*#__PURE__*/ React.createElement(
            'li',
            {
              style: {
                marginRight: 24,
              },
            },
            /*#__PURE__*/ React.createElement(
              'a',
              {
                onClick: function onClick() {
                  recoverRecord(record);
                },
              },
              '\u4F7F\u7528',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'li',
            null,
            /*#__PURE__*/ React.createElement(
              'a',
              {
                onClick: function onClick() {
                  showRecordForm(record);
                },
              },
              '\u7F16\u8F91',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'li',
            null,
            /*#__PURE__*/ React.createElement(
              Popconfirm, // tipTitle="删除"
              {
                // tipTitle="删除"
                placement: 'topRight',
                title: '\u786E\u8BA4\u8981\u5220\u9664 ['.concat(
                  getRecordName(record),
                  '] \uFF1F',
                ),
                onConfirm: function onConfirm() {
                  deleteRecord(
                    _defineProperty({}, idFieldName, getRecordId(record)),
                  );
                },
                // onCancel={cancel}
                okText: '\u5220\u9664',
                okType: 'danger',
                cancelText: '\u53D6\u6D88',
              },
              /*#__PURE__*/ React.createElement('a', null, '\u5220\u9664'),
            ),
          ),
        );
      },
    },
  ];
  return standRender({
    autoScrollX: {
      defaultWidth: 150,
    },
    columns: columns,
    size: 'small',
  });
};

function defaultSubmitValues(values, options) {
  var isUpdate = options.isUpdate,
    addRecord = options.addRecord,
    updateRecord = options.updateRecord,
    activeRecord = options.activeRecord,
    context = options.context;
  var idFieldName = context.idFieldName,
    getRecordId = context.getRecordId;

  if (isUpdate) {
    return updateRecord(
      _objectSpread2(
        _defineProperty({}, idFieldName, getRecordId(activeRecord)),
        values,
      ),
    );
  }

  return addRecord(values);
}

function stringifyRecordFormVisibleTag(tag) {
  if (_typeof(tag) === 'object') {
    return encodeFormValues(tag);
  }

  return String(tag);
}

function getOptsForStandUpsertForm(props) {
  var extraOpts =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref = extraOpts || {},
    _ref$defaultValues = _ref.defaultValues,
    defaultValues = _ref$defaultValues === void 0 ? {} : _ref$defaultValues;

  var finalDefaultValues = {};
  var specSearchParams = props.specSearchParams,
    specParamsAsRecordInitialValues = props.specParamsAsRecordInitialValues,
    recordInitialValues = props.recordInitialValues;

  if (defaultValues) {
    Object.assign(
      finalDefaultValues,
      typeof defaultValues === 'function'
        ? defaultValues(props)
        : defaultValues,
    );
  }

  if (specParamsAsRecordInitialValues && specSearchParams) {
    Object.assign(
      finalDefaultValues,
      typeof specSearchParams === 'function'
        ? specSearchParams(props)
        : specSearchParams,
    );
  }

  return {
    defaultValues: _objectSpread2(
      _objectSpread2({}, finalDefaultValues),
      recordInitialValues,
    ),
  };
}

var isWeakTrue = function isWeakTrue(v) {
  return !!v;
};

function useStandUpsertForm(opts) {
  var stOpts = useMemo(
    function() {
      return (
        (opts && 'isStandAdminHoc' in opts
          ? getOptsForStandUpsertForm(opts)
          : opts) || {}
      );
    },
    [opts],
  );
  var defaultValues = stOpts.defaultValues,
    _stOpts$recordToValue = stOpts.recordToValues,
    recordToValues =
      _stOpts$recordToValue === void 0 ? identity$1 : _stOpts$recordToValue,
    _stOpts$recordFromVal = stOpts.recordFromValues,
    recordFromValues =
      _stOpts$recordFromVal === void 0 ? identity$1 : _stOpts$recordFromVal,
    _stOpts$submitValues = stOpts.submitValues,
    submitValues =
      _stOpts$submitValues === void 0
        ? defaultSubmitValues
        : _stOpts$submitValues,
    onSuccess = stOpts.onSuccess,
    _stOpts$isModalVisibl = stOpts.isModalVisible,
    origIsModalVisible =
      _stOpts$isModalVisibl === void 0 ? isWeakTrue : _stOpts$isModalVisibl,
    _stOpts$formIdTag = stOpts.formIdTag,
    formIdTag = _stOpts$formIdTag === void 0 ? 'Upsert' : _stOpts$formIdTag;
  var context = useStandContext();
  var StoreNsTitle = context.StoreNsTitle,
    getRecordId = context.getRecordId,
    getRecordName = context.getRecordName,
    nameFieldName = context.nameFieldName,
    formNamePrefix = context.formNamePrefix,
    storeRef = context.storeRef,
    StoreNs = context.StoreNs,
    addRecord = context.addRecord,
    updateRecord = context.updateRecord,
    mountId = context.mountId,
    config = context.config;

  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0]; // if (!form) {
  //   [form] = Form.useForm();
  // }

  var activeRecord = storeRef.activeRecord,
    recordFormVisibleTag = storeRef.recordFormVisibleTag;
  var refPrevInitValues = useRef(null);
  var getInitValuesByRecord = usePersistFn(function(specRecord) {
    var finalDefaultValues =
      typeof defaultValues === 'function'
        ? defaultValues({
            config: config,
          })
        : defaultValues;
    return _objectSpread2(
      _objectSpread2({}, finalDefaultValues),
      specRecord
        ? (recordToValues &&
            recordToValues(specRecord, {
              config: config,
              defaultValues: defaultValues,
            })) ||
            specRecord
        : undefined,
    );
  });
  var getInitValues = usePersistFn(function(specRecord) {
    var initValues = getInitValuesByRecord(specRecord || activeRecord);

    if (isEqual(initValues, refPrevInitValues.current)) {
      return refPrevInitValues.current;
    }

    refPrevInitValues.current = initValues;
    return initValues;
  });
  var isModalVisible = usePersistFn(origIsModalVisible);
  useEffect(
    function() {
      // form 在modal中时 render会有延迟
      var timeId = setTimeout(function() {
        if (isModalVisible(recordFormVisibleTag)) {
          var values = form.getFieldsValue();
          var emptyValues = {};
          Object.keys(values).forEach(function(k) {
            emptyValues[k] = undefined;
          });
          form.setFieldsValue(
            _objectSpread2(
              _objectSpread2({}, emptyValues),
              getInitValues(activeRecord),
            ),
          );
        }
      }, 20);
      return function() {
        clearTimeout(timeId);
      };
    },
    [isModalVisible, recordFormVisibleTag, activeRecord, form, getInitValues],
  );
  var activeRecordId = getRecordId(activeRecord);
  var isUpdate = activeRecordId !== undefined && activeRecordId !== null;
  var resetForm = usePersistFn(function() {
    return form.resetFields();
  });
  var onFinish = usePersistFn(function(values) {
    return submitValues(recordFromValues(values, activeRecord), {
      config: config,
      context: context,
      activeRecord: activeRecord,
      isUpdate: isUpdate,
      addRecord: addRecord,
      updateRecord: updateRecord,
      recordFormVisibleTag: recordFormVisibleTag,
    }).then(function(resp) {
      if (resp && resp.success) {
        if (!isUpdate) {
          resetForm();
        }

        if (onSuccess) {
          onSuccess(resp);
        }
      }
    });
  });
  var submitForm = usePersistFn(function() {
    return form.validateFields().then(function(values) {
      onFinish(values);
    });
  });
  var handleCancel = usePersistFn(function() {
    context.hideRecordForm();
  });
  var clearActiveRecord = usePersistFn(function() {
    if (activeRecord) {
      context.clearActiveRecord();
    }
  });
  var activeRecordName = getRecordName(activeRecord);
  var formId = ''
    .concat(formNamePrefix, '_')
    .concat(StoreNs, '_')
    .concat(formIdTag)
    .concat(
      typeof recordFormVisibleTag !== 'boolean'
        ? '_' + stringifyRecordFormVisibleTag(recordFormVisibleTag)
        : '',
    );
  var renderFormHistroyTrigger = usePersistFn(function(renderOpts) {
    var formHistroyTriggerProps = {
      targetFormInfo: {
        formId: formId,
        form: form,
        title: ''.concat(StoreNsTitle),
      },
      historyRecordInfo: {
        nameFieldName: nameFieldName,
      },
      formValuesEncoder: {
        encode: encodeFormValues,
        decode: decodeFormValues,
      },
    };
    return /*#__PURE__*/ React.createElement(
      FormHistroyTrigger,
      Object.assign(
        {},
        formHistroyTriggerProps,
        typeof renderOpts === 'function'
          ? renderOpts(formHistroyTriggerProps)
          : renderOpts,
      ),
    );
  });
  return {
    formId: formId,
    renderFormHistroyTrigger: renderFormHistroyTrigger,
    formProps: {
      name: ''.concat(formId, '_').concat(mountId),
      form: form,
      initialValues: getInitValues(activeRecord),
      onFinish: onFinish,
    },
    modalProps: {
      title: !isUpdate
        ? '\u521B\u5EFA'.concat(StoreNsTitle)
        : '\u4FEE\u6539'
            .concat(StoreNsTitle)
            .concat(activeRecordName ? ' - '.concat(activeRecordName) : ''),
      visible: isModalVisible(recordFormVisibleTag),
      onOk: submitForm,
      onCancel: handleCancel,
      afterClose: clearActiveRecord,
    },

    /**
     * Normally passed by showRecordForm, and used as match condition in isModalVisible
     */
    recordFormVisibleTag: recordFormVisibleTag,
    getInitValues: getInitValues,
    getInitValuesByRecord: getInitValuesByRecord,

    /**
     *  Update or Create
     *  isUpdate =  activeRecord && activeRecord[idFieldName]
     */
    isUpdate: isUpdate,
    activeRecord: activeRecord,
    activeRecordId: activeRecordId,
    context: context,
    config: config,
    form: form,
    onFinish: onFinish,
    submitForm: submitForm,
    resetForm: resetForm,
    handleCancel: handleCancel,
    clearActiveRecord: clearActiveRecord,
  };
}

var FormItem = Form.Item;
var formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

function strLen(str) {
  var count = 0;

  for (var i = 0, len = str.length; i < len; i++) {
    count += str.charCodeAt(i) < 256 ? 1 : 2;
  }

  return count;
}

var getStrValPrioriy = function getStrValPrioriy(a) {
  switch (_typeof(a)) {
    case 'string':
      return strLen(a);

    case 'number':
      return 1;

    default:
      return 0;
  }
};

var findValidName = function findValidName(targetVals) {
  var strVals = []; // 深度遍历

  cloneDeepWith(targetVals, function(val) {
    if (typeof val === 'string' || typeof val === 'number') {
      strVals.push(val);
    }
  });

  if (strVals.length) {
    strVals.sort(function(a, b) {
      return getStrValPrioriy(b) - getStrValPrioriy(a);
    });
    return strVals[0];
  }

  return null;
};

var RecordForm = function(props) {
  var targetFormInfo = props.targetFormInfo,
    historyRecordInfo = props.historyRecordInfo,
    formValuesEncoder = props.formValuesEncoder,
    formValuesFilter = props.formValuesFilter;
  var formId = targetFormInfo.formId,
    targetForm = targetFormInfo.form;
  var nameFieldName = historyRecordInfo.nameFieldName;

  var getTargetFormVals = function getTargetFormVals() {
    return targetForm.getFieldsValue();
  };

  var getDefaultName = function getDefaultName() {
    var targetFormVals = getTargetFormVals();
    var name = targetFormVals[nameFieldName];

    if (!name) {
      name = findValidName(targetFormVals);
    }

    return name || '';
  };

  var _useStandUpsertForm = useStandUpsertForm(
      _objectSpread2(
        _objectSpread2(
          {},
          getOptsForStandUpsertForm(props, {
            // 默认值
            defaultValues: {
              name: getDefaultName(),
            },
          }),
        ),
        {},
        {
          // 接口数据（通常来自于列表接口）转换为表单数据
          recordToValues: function recordToValues(record) {
            return _objectSpread2({}, record);
          },
          // 表单数据转为接口数据（后续会传递给 addRecord/updateRecord）
          recordFromValues: function recordFromValues(values) {
            var name = values.name;

            var _ref = formValuesEncoder || {},
              _ref$encode = _ref.encode,
              encode = _ref$encode === void 0 ? encodeFormValues : _ref$encode;

            var _ref2 = formValuesFilter || {},
              _ref2$beforeSave = _ref2.beforeSave,
              beforeSave =
                _ref2$beforeSave === void 0 ? identity$1 : _ref2$beforeSave;

            return {
              name: name,
              formId: formId,
              formVals: encode(beforeSave(getTargetFormVals())),
            };
          },
        },
      ),
    ),
    context = _useStandUpsertForm.context,
    formProps = _useStandUpsertForm.formProps,
    modalProps = _useStandUpsertForm.modalProps;

  var getActionCount = context.getActionCount;
  var isSubmitting = getActionCount() > 0;
  return /*#__PURE__*/ React.createElement(
    Modal, // forceRender
    Object.assign({}, modalProps, {
      // title={`${modalProps.title} - ${title}`}
      width: 580,
      footer: null,
    }),
    /*#__PURE__*/ React.createElement(
      Form,
      Object.assign({}, formProps, formItemLayout),
      /*#__PURE__*/ React.createElement(
        FormItem,
        {
          name: 'name',
          label: '\u8349\u7A3F\u540D\u79F0',
          rules: [
            {
              required: true,
            },
          ],
        },
        /*#__PURE__*/ React.createElement(Input, {
          allowClear: true,
        }),
      ),
      /*#__PURE__*/ React.createElement(
        FormItem,
        {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 6,
            },
          },
        },
        /*#__PURE__*/ React.createElement(
          Button,
          {
            style: {
              width: 150,
              display: 'block',
            },
            type: 'primary',
            htmlType: 'submit',
            loading: isSubmitting,
          },
          '\u4FDD\u5B58',
        ),
      ),
    ),
  );
};

var datetimeFormat = 'YYYY-MM-DD HH:mm:ss';
var localforage = Localforage.createInstance({
  name: 'StandAdminFormHistory',
});

var recordMatch = function recordMatch(value, params) {
  return isMatch(value, params);
};

function searchRecords(_x) {
  return _searchRecords.apply(this, arguments);
}

function _searchRecords() {
  _searchRecords = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee(params) {
      var list, matchParams;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              list = [];
              matchParams = pick(params, ['id', 'formId', 'name']);
              return _context.abrupt(
                'return',
                localforage
                  .iterate(function(value) {
                    if (recordMatch(value, matchParams)) {
                      list.push(_objectSpread2({}, value));
                    }
                  })
                  .then(function() {
                    list.reverse();
                    return {
                      success: true,
                      data: {
                        total: list.length,
                        list: list,
                        pageNum: 1,
                        pageSize: list.length,
                      },
                    };
                  })
                  .catch(function(err) {
                    return {
                      success: false,
                      message: err,
                      data: null,
                    };
                  }),
              );

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    }),
  );
  return _searchRecords.apply(this, arguments);
}

function addRecord(_x2) {
  return _addRecord.apply(this, arguments);
}

function _addRecord() {
  _addRecord = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(record) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              return _context2.abrupt(
                'return',
                localforage
                  .keys()
                  .then(function(keys) {
                    keys.sort(function(a, b) {
                      return parseInt(b, 10) - parseInt(a, 10);
                    });
                    return keys[0];
                  })
                  .then(function(maxKey) {
                    var autoKey = String(parseInt(maxKey || '10000', 10) + 1);
                    return localforage
                      .setItem(
                        autoKey,
                        _objectSpread2(
                          _objectSpread2({}, record),
                          {},
                          {
                            id: autoKey,
                            updateAt: moment().format(datetimeFormat),
                          },
                        ),
                      )
                      .then(function() {
                        return {
                          success: true,
                          data: record,
                        };
                      });
                  })
                  .catch(function(err) {
                    return {
                      success: false,
                      message: err,
                      data: record,
                    };
                  }),
              );

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2);
    }),
  );
  return _addRecord.apply(this, arguments);
}

function updateRecord(_x3) {
  return _updateRecord.apply(this, arguments);
}

function _updateRecord() {
  _updateRecord = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee3(record) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch ((_context3.prev = _context3.next)) {
            case 0:
              if (record.id) {
                _context3.next = 2;
                break;
              }

              throw new Error('id is missing!');

            case 2:
              return _context3.abrupt(
                'return',
                localforage
                  .setItem(
                    record.id,
                    _objectSpread2(
                      _objectSpread2({}, record),
                      {},
                      {
                        updateAt: moment().format(datetimeFormat),
                      },
                    ),
                  )
                  .then(function() {
                    return {
                      success: true,
                      data: record,
                    };
                  })
                  .catch(function(err) {
                    return {
                      success: false,
                      message: err,
                      data: record,
                    };
                  }),
              );

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3);
    }),
  );
  return _updateRecord.apply(this, arguments);
}

function deleteRecord(_x4) {
  return _deleteRecord.apply(this, arguments);
}

function _deleteRecord() {
  _deleteRecord = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee4(_ref) {
      var id;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch ((_context4.prev = _context4.next)) {
            case 0:
              id = _ref.id;
              return _context4.abrupt(
                'return',
                localforage
                  .removeItem(id)
                  .then(function() {
                    return {
                      success: true,
                    };
                  })
                  .catch(function(err) {
                    return {
                      success: false,
                      message: err,
                    };
                  }),
              );

            case 2:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4);
    }),
  );
  return _deleteRecord.apply(this, arguments);
}

var configModel = buildStandConfigModelPkg({
  StoreNs: 'StandAdminFormHistroyConfig',
  StoreNsTitle: 'FormHistroyConfig',
  getConfig: [],
}); // 创建RecordModel

var recordModel = buildStandRecordModelPkg({
  StoreNs: 'StandAdminFormHistroyRecords',
  StoreNsTitle: '表单草稿',
  idFieldName: 'id',
  nameFieldName: 'name',
  searchRecords: searchRecords,
  // getRecord,
  addRecord: addRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
});

function MainComp(props) {
  // const { config } = useStandContext();
  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    /*#__PURE__*/ React.createElement(List, Object.assign({}, props)),
    /*#__PURE__*/ React.createElement(RecordForm, Object.assign({}, props)),
  );
}

function RecordFormWrapper(props) {
  var context = useStandContext();
  var trigger = props.trigger;
  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    trigger(context),
    /*#__PURE__*/ React.createElement(RecordForm, Object.assign({}, props)),
  );
}
var hocParams = defineContextHocParams({
  recordModel: recordModel,
  configModel: configModel,
  syncParamsToUrl: false,
  receiveContextAsProps: false,
  /**
   * 默认的查询参数
   */
  // defaultSearchParams: {},
});
var DynamicCompCache = {}; // 动态主组件，支持不同的数据空间

var getDynamicComp = function getDynamicComp(namespace) {
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$Comp = _ref.Comp,
    Comp = _ref$Comp === void 0 ? MainComp : _ref$Comp,
    extraHocParams = _ref.extraHocParams;

  if (!DynamicCompCache[namespace]) {
    var hocWrapper = StandSelectCtrlHoc;
    DynamicCompCache[namespace] = hocWrapper(
      _objectSpread2(
        _objectSpread2({}, hocParams),
        {},
        {
          makeRecordModelPkgDynamic: namespace,
        },
        extraHocParams,
      ),
    )(Comp);
  }

  return DynamicCompCache[namespace];
};

var css_248z$1 =
  '/* stylelint-disable at-rule-empty-line-before,at-rule-name-space-after,at-rule-no-unknown */\n/* stylelint-disable no-duplicate-selectors */\n/* stylelint-disable */\n/* stylelint-disable declaration-bang-space-before,no-duplicate-selectors,string-no-newline */\n.stand-admin-formhistroy-toolbar {\n  margin-bottom: 12px;\n}\n.stand-admin-formhistroy-vtoolbox {\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #d9d9d9;\n  border-radius: 2px;\n  opacity: 0.5;\n}\n.stand-admin-formhistroy-vtoolbox:hover {\n  opacity: 1;\n}\n.stand-admin-formhistroy-vtoolbox > *:not(:last-child) {\n  border-bottom: 1px solid #d9d9d9;\n}\n.stand-admin-formhistroy-vtoolbox .stand-admin-formhistroy-vtoolbox-icon {\n  cursor: pointer;\n  width: 20px;\n  height: 24px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.stand-admin-formhistroy-vtoolbox .stand-admin-formhistroy-vtoolbox-icon:hover {\n  background-color: #1890ff;\n  color: #fff;\n}\n';
styleInject(css_248z$1);

var clsPrefix$1 = 'stand-admin-formhistroy';
var clsNames$1 = tuple('toolbar', 'vtoolbox', 'vtoolbox-icon');
var styles$1 = clsNames$1.reduce(function(kvMap, clsName) {
  // eslint-disable-next-line no-param-reassign
  kvMap[clsName] = ''.concat(clsPrefix$1, '-').concat(clsName);
  return kvMap;
}, {});

var defaultHistorySaveTrigger = function defaultHistorySaveTrigger(_ref) {
  var showSaveForm = _ref.showSaveForm;
  return /*#__PURE__*/ React.createElement(
    Tooltip,
    {
      placement: 'left',
      title: '\u6682\u5B58\u8868\u5355\u4E3A\u8349\u7A3F',
    },
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: styles$1['vtoolbox-icon'],
        onClick: showSaveForm,
      },
      /*#__PURE__*/ React.createElement(SaveOutlined, null),
    ),
  );
};

var defaultHistoryListTrigger = function defaultHistoryListTrigger(_ref2) {
  var showListModal = _ref2.showListModal;
  return /*#__PURE__*/ React.createElement(
    Tooltip,
    {
      placement: 'left',
      title: '\u67E5\u770B\u8349\u7A3F\u8BB0\u5F55',
    },
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: styles$1['vtoolbox-icon'],
        onClick: showListModal,
      },
      /*#__PURE__*/ React.createElement(HistoryOutlined, null),
    ),
  );
};

var SaveTriggerWrapper = function SaveTriggerWrapper(props) {
  var targetFormInfo = props.targetFormInfo,
    _props$historySaveTri = props.historySaveTrigger,
    historySaveTrigger =
      _props$historySaveTri === void 0
        ? defaultHistorySaveTrigger
        : _props$historySaveTri;

  var _useStandContext = useStandContext(),
    showEmptyRecordForm = _useStandContext.showEmptyRecordForm;

  var targetForm = targetFormInfo.form;

  var handleSaveClick = function handleSaveClick() {
    if (isEmpty(targetForm.getFieldsValue())) {
      message.warn('\u8868\u5355\u5185\u5BB9\u4E3A\u7A7A\uFF01');
    }

    showEmptyRecordForm();
  };

  return /*#__PURE__*/ React.createElement(
    RecordFormWrapper,
    Object.assign({}, props, {
      trigger: function trigger() {
        return historySaveTrigger({
          showSaveForm: handleSaveClick,
        });
      },
    }),
  );
};

var FormHistroyTrigger = function(props) {
  var wrapperClassName = props.wrapperClassName,
    restProps = _objectWithoutProperties(props, ['wrapperClassName']);

  var targetFormInfo = restProps.targetFormInfo,
    _restProps$historyLis = restProps.historyListTrigger,
    historyListTrigger =
      _restProps$historyLis === void 0
        ? defaultHistoryListTrigger
        : _restProps$historyLis;
  var formId = targetFormInfo.formId,
    title = targetFormInfo.title;
  var SelectCtrl = getDynamicComp(''.concat(formId, '-select-ctrl'));
  var SaveTrigger = getDynamicComp(''.concat(formId, '-save-trigger'), {
    Comp: SaveTriggerWrapper,
    extraHocParams: {
      searchRecordsOnMount: false,
    },
  });
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: classNames(styles$1.vtoolbox, wrapperClassName),
    },
    /*#__PURE__*/ React.createElement(
      SaveTrigger,
      Object.assign(
        {
          isModalMode: false,
        },
        restProps,
      ),
    ),
    /*#__PURE__*/ React.createElement(
      SelectCtrl,
      Object.assign(
        {
          specSearchParams: {
            formId: formId,
          },
          modalTrigger: function modalTrigger(opts) {
            return historyListTrigger({
              showListModal: opts.showModal,
            });
          },
          modalProps: {
            width: 700,
            title: '\u8868\u5355\u8349\u7A3F\u8BB0\u5F55 - '.concat(title),
            footer: null,
          },
          listRowSelectionSupport: false,
        },
        restProps,
      ),
    ),
  );
};

function getOptsForStandSearchForm(props) {
  var specSearchParams = props.specSearchParams;
  var opts = {};

  if (specSearchParams) {
    var specParamsMap =
      typeof specSearchParams === 'function'
        ? specSearchParams(props)
        : specSearchParams;
    Object.assign(opts, {
      disabledSearchParams: Object.keys(specParamsMap).filter(function(k) {
        return specParamsMap[k] !== undefined;
      }),
    });
  }

  return opts;
}
function useStandSearchForm(opts) {
  var stOpts = useMemo(
    function() {
      return (
        (opts && 'isStandAdminHoc' in opts
          ? getOptsForStandSearchForm(opts)
          : opts) || {}
      );
    },
    [opts],
  );
  var _stOpts$defaultSearch = stOpts.defaultSearchParams,
    defaultSearchParams =
      _stOpts$defaultSearch === void 0 ? {} : _stOpts$defaultSearch,
    _stOpts$searchParamsT = stOpts.searchParamsToValues,
    searchParamsToValues =
      _stOpts$searchParamsT === void 0 ? identity$1 : _stOpts$searchParamsT,
    _stOpts$searchParamsF = stOpts.searchParamsFromValues,
    searchParamsFromValues =
      _stOpts$searchParamsF === void 0 ? identity$1 : _stOpts$searchParamsF,
    disabledSearchParams = stOpts.disabledSearchParams,
    _stOpts$formIdTag = stOpts.formIdTag,
    formIdTag = _stOpts$formIdTag === void 0 ? 'Search' : _stOpts$formIdTag;
  var context = useStandContext();
  var formNamePrefix = context.formNamePrefix,
    storeRef = context.storeRef,
    goSearch = context.goSearch,
    StoreNs = context.StoreNs,
    mountId = context.mountId,
    nameFieldName = context.nameFieldName,
    StoreNsTitle = context.StoreNsTitle,
    getDefaultSearchParams = context.getDefaultSearchParams,
    getSpecSearchParams = context.getSpecSearchParams,
    config = context.config;

  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0];

  var getInitValues = usePersistFn(function() {
    return searchParamsToValues(
      _objectSpread2(
        _objectSpread2(
          _objectSpread2(
            _objectSpread2({}, getDefaultSearchParams()),
            defaultSearchParams,
          ),
          storeRef.searchParams,
        ),
        getSpecSearchParams(),
      ),
    );
  });
  useEffect(
    function() {
      form.setFieldsValue(getInitValues());
    },
    [form, getInitValues, storeRef.searchParams],
  );
  var onFinish = usePersistFn(function(params) {
    return goSearch(searchParamsFromValues(params, storeRef.searchParams));
  });
  var submitForm = usePersistFn(function() {
    return form.validateFields().then(function(values) {
      onFinish(values);
    });
  });
  var resetForm = usePersistFn(function() {
    var values = form.getFieldsValue();
    var emptyValues = {};
    Object.keys(values).forEach(function(k) {
      // const currVal = values[k];
      emptyValues[k] = undefined; // getEmptyVal(currVal);
    });

    var newValues = _objectSpread2(
      _objectSpread2({}, emptyValues),
      searchParamsToValues(
        _objectSpread2(
          _objectSpread2(
            _objectSpread2({}, getDefaultSearchParams()),
            defaultSearchParams,
          ),
          getSpecSearchParams(),
        ),
      ),
    );

    form.setFieldsValue(newValues);
    onFinish(newValues);
  });
  var FormItem = usePersistFn(function(itemProps) {
    var children = itemProps.children,
      restProps = _objectWithoutProperties(itemProps, ['children']);

    var finalChildren = children;
    var disabled = !!(
      disabledSearchParams &&
      disabledSearchParams.find(function(disabledName) {
        return isEqual(itemProps.name, disabledName);
      })
    );

    if (disabled) {
      if (/*#__PURE__*/ React.isValidElement(children)) {
        finalChildren = /*#__PURE__*/ React.cloneElement(children, {
          disabled: true,
        });
      } else {
        console.error('Disable will not work', itemProps);
      }
    }

    return /*#__PURE__*/ React.createElement(
      Form.Item,
      Object.assign({}, restProps),
      finalChildren,
    );
  });
  var formId = ''
    .concat(formNamePrefix, '_')
    .concat(StoreNs, '_')
    .concat(formIdTag);
  var renderFormHistroyTrigger = usePersistFn(function(renderOpts) {
    var formHistroyTriggerProps = {
      targetFormInfo: {
        formId: formId,
        form: form,
        title: ''.concat(StoreNsTitle, '\u67E5\u8BE2'),
      },
      historyRecordInfo: {
        nameFieldName: nameFieldName,
      },
      formValuesEncoder: {
        encode: encodeFormValues,
        decode: decodeFormValues,
      },
      actionHooks: {
        afterRestore: submitForm,
      },
    };
    return /*#__PURE__*/ React.createElement(
      FormHistroyTrigger,
      Object.assign(
        {},
        formHistroyTriggerProps,
        typeof renderOpts === 'function'
          ? renderOpts(formHistroyTriggerProps)
          : renderOpts,
      ),
    );
  });
  return {
    formId: formId,
    renderFormHistroyTrigger: renderFormHistroyTrigger,
    formProps: {
      name: ''.concat(formId, '_').concat(mountId),
      form: form,
      initialValues: getInitValues(),
      onFinish: onFinish,
    },
    config: config,
    context: context,
    form: form,
    onFinish: onFinish,
    submitForm: submitForm,
    resetForm: resetForm,
    FormItem: FormItem,
  };
}

var standUtils = {
  /**
   * map({key:value}) 转 option({value:key,label:value})
   */
  mapToOptions: function mapToOptions(obj, opts) {
    var _ref = opts || {},
      _ref$valueFilter = _ref.valueFilter,
      valueFilter = _ref$valueFilter === void 0 ? identity$1 : _ref$valueFilter;

    return Object.keys(obj).map(function(key) {
      return {
        value: valueFilter(key),
        label: obj[key],
      };
    });
  },

  /**
   * array([item])转option({value:item,label:item})
   */
  arrayToOptions: function arrayToOptions(arr, opts) {
    var _ref2 = opts || {},
      _ref2$valueFilter = _ref2.valueFilter,
      valueFilter =
        _ref2$valueFilter === void 0 ? identity$1 : _ref2$valueFilter;

    return arr.map(function(value) {
      return {
        value: valueFilter(value),
        label: value,
      };
    });
  },
  stringifyQueryParams: toUrlQuery,
  parseQueryString: fromUrlQuery,
  encodeFormValues: encodeFormValues,
  decodeFormValues: decodeFormValues,
};

export {
  ActionCounterHoc,
  BatchCheckHoc,
  EmptyConfigModel,
  EmptyRecordModel,
  FormHistroyTrigger,
  StandConfigLoadingHoc,
  StandConnectHoc,
  StandContext,
  StandContextHoc,
  StandListCtrlHoc,
  index as StandRecordInfoHoc,
  StandRecordsHoc,
  StandSelectCtrlHoc,
  buildStandConfigModelPkg,
  buildStandRecordModelPkg,
  calColWidth,
  cloneModelPkg,
  closeLog,
  defineCommonHocParams,
  defineContextHocParams,
  defineFullContextHocParams,
  defineFullHocParams,
  defineListCtrlHocParams,
  defineSelectCtrlHocParams,
  getAutoStoreNs,
  getConfig,
  getDynamicModelPkg,
  getOptsForStandSearchForm,
  getOptsForStandTableList,
  getOptsForStandUpsertForm,
  getStandConfigModel,
  getStandModel,
  handleCommonRespError,
  openLog,
  setConfig,
  styles as standStyles,
  standUtils,
  useStandContext,
  useStandSearchForm,
  useStandTableList,
  useStandUpsertForm,
};
