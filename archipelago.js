/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 7187:
/***/ ((module) => {

                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.



                var R = typeof Reflect === 'object' ? Reflect : null
                var ReflectApply = R && typeof R.apply === 'function'
                    ? R.apply
                    : function ReflectApply(target, receiver, args) {
                        return Function.prototype.apply.call(target, receiver, args);
                    }

                var ReflectOwnKeys
                if (R && typeof R.ownKeys === 'function') {
                    ReflectOwnKeys = R.ownKeys
                } else if (Object.getOwnPropertySymbols) {
                    ReflectOwnKeys = function ReflectOwnKeys(target) {
                        return Object.getOwnPropertyNames(target)
                            .concat(Object.getOwnPropertySymbols(target));
                    };
                } else {
                    ReflectOwnKeys = function ReflectOwnKeys(target) {
                        return Object.getOwnPropertyNames(target);
                    };
                }

                function ProcessEmitWarning(warning) {
                    if (console && console.warn) console.warn(warning);
                }

                var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
                    return value !== value;
                }

                function EventEmitter() {
                    EventEmitter.init.call(this);
                }
                module.exports = EventEmitter;
                module.exports.once = once;

                // Backwards-compat with node 0.10.x
                EventEmitter.EventEmitter = EventEmitter;

                EventEmitter.prototype._events = undefined;
                EventEmitter.prototype._eventsCount = 0;
                EventEmitter.prototype._maxListeners = undefined;

                // By default EventEmitters will print a warning if more than 10 listeners are
                // added to it. This is a useful default which helps finding memory leaks.
                var defaultMaxListeners = 10;

                function checkListener(listener) {
                    if (typeof listener !== 'function') {
                        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
                    }
                }

                Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
                    enumerable: true,
                    get: function () {
                        return defaultMaxListeners;
                    },
                    set: function (arg) {
                        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
                            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
                        }
                        defaultMaxListeners = arg;
                    }
                });

                EventEmitter.init = function () {

                    if (this._events === undefined ||
                        this._events === Object.getPrototypeOf(this)._events) {
                        this._events = Object.create(null);
                        this._eventsCount = 0;
                    }

                    this._maxListeners = this._maxListeners || undefined;
                };

                // Obviously not all Emitters should be limited to 10. This function allows
                // that to be increased. Set to zero for unlimited.
                EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
                    if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
                        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
                    }
                    this._maxListeners = n;
                    return this;
                };

                function _getMaxListeners(that) {
                    if (that._maxListeners === undefined)
                        return EventEmitter.defaultMaxListeners;
                    return that._maxListeners;
                }

                EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
                    return _getMaxListeners(this);
                };

                EventEmitter.prototype.emit = function emit(type) {
                    var args = [];
                    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
                    var doError = (type === 'error');

                    var events = this._events;
                    if (events !== undefined)
                        doError = (doError && events.error === undefined);
                    else if (!doError)
                        return false;

                    // If there is no 'error' event listener then throw.
                    if (doError) {
                        var er;
                        if (args.length > 0)
                            er = args[0];
                        if (er instanceof Error) {
                            // Note: The comments on the `throw` lines are intentional, they show
                            // up in Node's output if this results in an unhandled exception.
                            throw er; // Unhandled 'error' event
                        }
                        // At least give some kind of context to the user
                        var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
                        err.context = er;
                        throw err; // Unhandled 'error' event
                    }

                    var handler = events[type];

                    if (handler === undefined)
                        return false;

                    if (typeof handler === 'function') {
                        ReflectApply(handler, this, args);
                    } else {
                        var len = handler.length;
                        var listeners = arrayClone(handler, len);
                        for (var i = 0; i < len; ++i)
                            ReflectApply(listeners[i], this, args);
                    }

                    return true;
                };

                function _addListener(target, type, listener, prepend) {
                    var m;
                    var events;
                    var existing;

                    checkListener(listener);

                    events = target._events;
                    if (events === undefined) {
                        events = target._events = Object.create(null);
                        target._eventsCount = 0;
                    } else {
                        // To avoid recursion in the case that type === "newListener"! Before
                        // adding it to the listeners, first emit "newListener".
                        if (events.newListener !== undefined) {
                            target.emit('newListener', type,
                                listener.listener ? listener.listener : listener);

                            // Re-assign `events` because a newListener handler could have caused the
                            // this._events to be assigned to a new object
                            events = target._events;
                        }
                        existing = events[type];
                    }

                    if (existing === undefined) {
                        // Optimize the case of one listener. Don't need the extra array object.
                        existing = events[type] = listener;
                        ++target._eventsCount;
                    } else {
                        if (typeof existing === 'function') {
                            // Adding the second element, need to change to array.
                            existing = events[type] =
                                prepend ? [listener, existing] : [existing, listener];
                            // If we've already got an array, just append.
                        } else if (prepend) {
                            existing.unshift(listener);
                        } else {
                            existing.push(listener);
                        }

                        // Check for listener leak
                        m = _getMaxListeners(target);
                        if (m > 0 && existing.length > m && !existing.warned) {
                            existing.warned = true;
                            // No error code for this since it is a Warning
                            // eslint-disable-next-line no-restricted-syntax
                            var w = new Error('Possible EventEmitter memory leak detected. ' +
                                existing.length + ' ' + String(type) + ' listeners ' +
                                'added. Use emitter.setMaxListeners() to ' +
                                'increase limit');
                            w.name = 'MaxListenersExceededWarning';
                            w.emitter = target;
                            w.type = type;
                            w.count = existing.length;
                            ProcessEmitWarning(w);
                        }
                    }

                    return target;
                }

                EventEmitter.prototype.addListener = function addListener(type, listener) {
                    return _addListener(this, type, listener, false);
                };

                EventEmitter.prototype.on = EventEmitter.prototype.addListener;

                EventEmitter.prototype.prependListener =
                    function prependListener(type, listener) {
                        return _addListener(this, type, listener, true);
                    };

                function onceWrapper() {
                    if (!this.fired) {
                        this.target.removeListener(this.type, this.wrapFn);
                        this.fired = true;
                        if (arguments.length === 0)
                            return this.listener.call(this.target);
                        return this.listener.apply(this.target, arguments);
                    }
                }

                function _onceWrap(target, type, listener) {
                    var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
                    var wrapped = onceWrapper.bind(state);
                    wrapped.listener = listener;
                    state.wrapFn = wrapped;
                    return wrapped;
                }

                EventEmitter.prototype.once = function once(type, listener) {
                    checkListener(listener);
                    this.on(type, _onceWrap(this, type, listener));
                    return this;
                };

                EventEmitter.prototype.prependOnceListener =
                    function prependOnceListener(type, listener) {
                        checkListener(listener);
                        this.prependListener(type, _onceWrap(this, type, listener));
                        return this;
                    };

                // Emits a 'removeListener' event if and only if the listener was removed.
                EventEmitter.prototype.removeListener =
                    function removeListener(type, listener) {
                        var list, events, position, i, originalListener;

                        checkListener(listener);

                        events = this._events;
                        if (events === undefined)
                            return this;

                        list = events[type];
                        if (list === undefined)
                            return this;

                        if (list === listener || list.listener === listener) {
                            if (--this._eventsCount === 0)
                                this._events = Object.create(null);
                            else {
                                delete events[type];
                                if (events.removeListener)
                                    this.emit('removeListener', type, list.listener || listener);
                            }
                        } else if (typeof list !== 'function') {
                            position = -1;

                            for (i = list.length - 1; i >= 0; i--) {
                                if (list[i] === listener || list[i].listener === listener) {
                                    originalListener = list[i].listener;
                                    position = i;
                                    break;
                                }
                            }

                            if (position < 0)
                                return this;

                            if (position === 0)
                                list.shift();
                            else {
                                spliceOne(list, position);
                            }

                            if (list.length === 1)
                                events[type] = list[0];

                            if (events.removeListener !== undefined)
                                this.emit('removeListener', type, originalListener || listener);
                        }

                        return this;
                    };

                EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

                EventEmitter.prototype.removeAllListeners =
                    function removeAllListeners(type) {
                        var listeners, events, i;

                        events = this._events;
                        if (events === undefined)
                            return this;

                        // not listening for removeListener, no need to emit
                        if (events.removeListener === undefined) {
                            if (arguments.length === 0) {
                                this._events = Object.create(null);
                                this._eventsCount = 0;
                            } else if (events[type] !== undefined) {
                                if (--this._eventsCount === 0)
                                    this._events = Object.create(null);
                                else
                                    delete events[type];
                            }
                            return this;
                        }

                        // emit removeListener for all listeners on all events
                        if (arguments.length === 0) {
                            var keys = Object.keys(events);
                            var key;
                            for (i = 0; i < keys.length; ++i) {
                                key = keys[i];
                                if (key === 'removeListener') continue;
                                this.removeAllListeners(key);
                            }
                            this.removeAllListeners('removeListener');
                            this._events = Object.create(null);
                            this._eventsCount = 0;
                            return this;
                        }

                        listeners = events[type];

                        if (typeof listeners === 'function') {
                            this.removeListener(type, listeners);
                        } else if (listeners !== undefined) {
                            // LIFO order
                            for (i = listeners.length - 1; i >= 0; i--) {
                                this.removeListener(type, listeners[i]);
                            }
                        }

                        return this;
                    };

                function _listeners(target, type, unwrap) {
                    var events = target._events;

                    if (events === undefined)
                        return [];

                    var evlistener = events[type];
                    if (evlistener === undefined)
                        return [];

                    if (typeof evlistener === 'function')
                        return unwrap ? [evlistener.listener || evlistener] : [evlistener];

                    return unwrap ?
                        unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
                }

                EventEmitter.prototype.listeners = function listeners(type) {
                    return _listeners(this, type, true);
                };

                EventEmitter.prototype.rawListeners = function rawListeners(type) {
                    return _listeners(this, type, false);
                };

                EventEmitter.listenerCount = function (emitter, type) {
                    if (typeof emitter.listenerCount === 'function') {
                        return emitter.listenerCount(type);
                    } else {
                        return listenerCount.call(emitter, type);
                    }
                };

                EventEmitter.prototype.listenerCount = listenerCount;
                function listenerCount(type) {
                    var events = this._events;

                    if (events !== undefined) {
                        var evlistener = events[type];

                        if (typeof evlistener === 'function') {
                            return 1;
                        } else if (evlistener !== undefined) {
                            return evlistener.length;
                        }
                    }

                    return 0;
                }

                EventEmitter.prototype.eventNames = function eventNames() {
                    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
                };

                function arrayClone(arr, n) {
                    var copy = new Array(n);
                    for (var i = 0; i < n; ++i)
                        copy[i] = arr[i];
                    return copy;
                }

                function spliceOne(list, index) {
                    for (; index + 1 < list.length; index++)
                        list[index] = list[index + 1];
                    list.pop();
                }

                function unwrapListeners(arr) {
                    var ret = new Array(arr.length);
                    for (var i = 0; i < ret.length; ++i) {
                        ret[i] = arr[i].listener || arr[i];
                    }
                    return ret;
                }

                function once(emitter, name) {
                    return new Promise(function (resolve, reject) {
                        function errorListener(err) {
                            emitter.removeListener(name, resolver);
                            reject(err);
                        }

                        function resolver() {
                            if (typeof emitter.removeListener === 'function') {
                                emitter.removeListener('error', errorListener);
                            }
                            resolve([].slice.call(arguments));
                        };

                        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
                        if (name !== 'error') {
                            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
                        }
                    });
                }

                function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
                    if (typeof emitter.on === 'function') {
                        eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
                    }
                }

                function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
                    if (typeof emitter.on === 'function') {
                        if (flags.once) {
                            emitter.once(name, listener);
                        } else {
                            emitter.on(name, listener);
                        }
                    } else if (typeof emitter.addEventListener === 'function') {
                        // EventTarget does not have `error` event semantics like Node
                        // EventEmitters, we do not listen for `error` events here.
                        emitter.addEventListener(name, function wrapListener(arg) {
                            // IE does not have builtin `{ once: true }` support so we
                            // have to do it manually.
                            if (flags.once) {
                                emitter.removeEventListener(name, wrapListener);
                            }
                            listener(arg);
                        });
                    } else {
                        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
                    }
                }


                /***/
}),

/***/ 6792:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
                    /* harmony export */
});
                // https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

                var ws = null

                if (typeof WebSocket !== 'undefined') {
                    ws = WebSocket
                } else if (typeof MozWebSocket !== 'undefined') {
                    ws = MozWebSocket
                } else if (typeof __webpack_require__.g !== 'undefined') {
                    ws = __webpack_require__.g.WebSocket || __webpack_require__.g.MozWebSocket
                } else if (typeof window !== 'undefined') {
                    ws = window.WebSocket || window.MozWebSocket
                } else if (typeof self !== 'undefined') {
                    ws = self.WebSocket || self.MozWebSocket
                }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ws);


                /***/
}),

/***/ 6108:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                var _Client_instances, _Client_socket, _Client_status, _Client_emitter, _Client_dataManager, _Client_hintManager, _Client_itemsManager, _Client_locationsManager, _Client_playersManager, _Client_finalizeConnection, _Client_connectSocket, _Client_parsePackets, _Client_consolidateMessage;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.MINIMUM_SUPPORTED_AP_VERSION = exports.Client = void 0;
                const events_1 = __webpack_require__(7187);
                const isomorphic_ws_1 = __importDefault(__webpack_require__(6792));
                const uuid_1 = __webpack_require__(7429);
                const CommandPacketType_1 = __webpack_require__(684);
                const ConnectionStatus_1 = __webpack_require__(1537);
                const PrintJSONType_1 = __webpack_require__(5432);
                const DataManager_1 = __webpack_require__(3804);
                const HintsManager_1 = __webpack_require__(8783);
                const ItemsManager_1 = __webpack_require__(6833);
                const LocationsManager_1 = __webpack_require__(1159);
                const PlayersManager_1 = __webpack_require__(3150);
                const types_1 = __webpack_require__(1230);
                /**
                 * The client that connects to an Archipelago server and facilitates communication, listens for events, and manages
                 * data.
                 */
                class Client {
                    constructor() {
                        _Client_instances.add(this);
                        _Client_socket.set(this, void 0);
                        _Client_status.set(this, ConnectionStatus_1.CONNECTION_STATUS.DISCONNECTED);
                        _Client_emitter.set(this, new events_1.EventEmitter());
                        _Client_dataManager.set(this, new DataManager_1.DataManager(this));
                        _Client_hintManager.set(this, new HintsManager_1.HintsManager(this));
                        _Client_itemsManager.set(this, new ItemsManager_1.ItemsManager(this));
                        _Client_locationsManager.set(this, new LocationsManager_1.LocationsManager(this));
                        _Client_playersManager.set(this, new PlayersManager_1.PlayersManager(this));
                    }
                    /**
                     * Get the current WebSocket connection status to the Archipelago server.
                     */
                    get status() {
                        return __classPrivateFieldGet(this, _Client_status, "f");
                    }
                    /**
                     * Get the {@link DataManager} helper object. See {@link DataManager} for additional information.
                     */
                    get data() {
                        return __classPrivateFieldGet(this, _Client_dataManager, "f");
                    }
                    /**
                     * Get the {@link HintsManager} helper object. See {@link HintsManager} for additional information.
                     */
                    get hints() {
                        return __classPrivateFieldGet(this, _Client_hintManager, "f");
                    }
                    /**
                     * Get the {@link ItemsManager} helper object. See {@link ItemsManager} for additional information.
                     */
                    get items() {
                        return __classPrivateFieldGet(this, _Client_itemsManager, "f");
                    }
                    /**
                     * Get the {@link LocationsManager} helper object. See {@link LocationsManager} for additional information.
                     */
                    get locations() {
                        return __classPrivateFieldGet(this, _Client_locationsManager, "f");
                    }
                    /**
                     * Get the {@link PlayersManager} helper object. See {@link PlayersManager} for additional information.
                     */
                    get players() {
                        return __classPrivateFieldGet(this, _Client_playersManager, "f");
                    }
                    /**
                     * Get the URI of the current connection, including protocol.
                     */
                    get uri() {
                        if (__classPrivateFieldGet(this, _Client_socket, "f")) {
                            return __classPrivateFieldGet(this, _Client_socket, "f").url;
                        }
                        return;
                    }
                    /**
                     * Connects to the given address with given connection information.
                     *
                     * @param info All the necessary connection information to connect to an Archipelago server.
                     *
                     * @resolves On successful connection and authentication to the room.
                     * @rejects If web socket connection failed to establish connection or server refused connection, promise will
                     * return a `string[]` of error messages.
                     */
                    connect(info) {
                        return __awaiter(this, void 0, void 0, function* () {
                            // Confirm a valid port was given.
                            if (info.port < 1 || info.port > 65535 || !Number.isInteger(info.port))
                                throw new Error(`Port must be an integer between 1 and 65535. Received: ${info.port}`);
                            try {
                                // First establish the initial connection.
                                __classPrivateFieldSet(this, _Client_status, ConnectionStatus_1.CONNECTION_STATUS.CONNECTING, "f");
                                if (info.protocol === "ws") {
                                    yield __classPrivateFieldGet(this, _Client_instances, "m", _Client_connectSocket).call(this, `ws://${info.hostname}:${info.port}/`);
                                }
                                else if (info.protocol === "wss") {
                                    yield __classPrivateFieldGet(this, _Client_instances, "m", _Client_connectSocket).call(this, `wss://${info.hostname}:${info.port}/`);
                                }
                                else {
                                    try {
                                        // Attempt a secure connection first.
                                        yield __classPrivateFieldGet(this, _Client_instances, "m", _Client_connectSocket).call(this, `wss://${info.hostname}:${info.port}/`);
                                    }
                                    catch (_a) {
                                        // Failing that, attempt to connect to normal websocket.
                                        yield __classPrivateFieldGet(this, _Client_instances, "m", _Client_connectSocket).call(this, `ws://${info.hostname}:${info.port}/`);
                                    }
                                }
                                // Wait for data package to complete, then finalize connection.
                                return yield new Promise((resolve, reject) => {
                                    const onDataPackageLoaded = () => {
                                        __classPrivateFieldGet(this, _Client_instances, "m", _Client_finalizeConnection).call(this, info)
                                            .then((connectPacket) => {
                                                __classPrivateFieldGet(this, _Client_emitter, "f").removeListener("__onRoomInfoLoaded", onDataPackageLoaded.bind(this));
                                                resolve(connectPacket);
                                            })
                                            .catch((error) => reject(error));
                                    };
                                    __classPrivateFieldGet(this, _Client_emitter, "f").addListener("__onRoomInfoLoaded", onDataPackageLoaded.bind(this));
                                });
                            }
                            catch (error) {
                                this.disconnect();
                                throw error;
                            }
                        });
                    }
                    /**
                     * Not meant for users of archipelago.js to use, just an easy way for me to pass events around.
                     *
                     * @internal
                     */
                    emitRawEvent(event, ...args) {
                        __classPrivateFieldGet(this, _Client_emitter, "f").emit(event, ...args);
                    }
                    /**
                     * Send a list of raw packets to the Archipelago server in the order they are listed as arguments.
                     *
                     * @param packets An array of raw {@link ClientPacket}s to send to the AP server. They are processed in
                     * the order they are listed as arguments.
                     */
                    send(...packets) {
                        var _a;
                        (_a = __classPrivateFieldGet(this, _Client_socket, "f")) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(packets));
                    }
                    /**
                     * Send a normal chat message to the server.
                     * @param message The message to send.
                     */
                    say(message) {
                        this.send({ cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.SAY, text: message });
                    }
                    /**
                     * Update the status for this client.
                     * @param status The status code to send.
                     */
                    updateStatus(status) {
                        this.send({ cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.STATUS_UPDATE, status });
                    }
                    /**
                     * Disconnect from the server and re-initialize all managers.
                     */
                    disconnect() {
                        var _a;
                        (_a = __classPrivateFieldGet(this, _Client_socket, "f")) === null || _a === void 0 ? void 0 : _a.close();
                        __classPrivateFieldSet(this, _Client_socket, undefined, "f");
                        __classPrivateFieldSet(this, _Client_status, ConnectionStatus_1.CONNECTION_STATUS.DISCONNECTED, "f");
                        __classPrivateFieldGet(this, _Client_emitter, "f").removeAllListeners();
                        // Reinitialize our Managers.
                        __classPrivateFieldSet(this, _Client_dataManager, new DataManager_1.DataManager(this), "f");
                        __classPrivateFieldSet(this, _Client_hintManager, new HintsManager_1.HintsManager(this), "f");
                        __classPrivateFieldSet(this, _Client_itemsManager, new ItemsManager_1.ItemsManager(this), "f");
                        __classPrivateFieldSet(this, _Client_locationsManager, new LocationsManager_1.LocationsManager(this), "f");
                        __classPrivateFieldSet(this, _Client_playersManager, new PlayersManager_1.PlayersManager(this), "f");
                    }
                    /**
                     * Add an eventListener to fire depending on an event from the Archipelago server or the client.
                     *
                     * @param event The event to listen for.
                     * @param listener The listener callback function to run when an event is fired.
                     */
                    addListener(event, listener) {
                        __classPrivateFieldGet(this, _Client_emitter, "f").addListener(event, listener);
                    }
                    /**
                     * Remove an eventListener from this client's event emitter.
                     *
                     * @param event The event to stop listening for.
                     * @param listener The listener callback function to remove.
                     */
                    removeListener(event, listener) {
                        __classPrivateFieldGet(this, _Client_emitter, "f").removeListener(event, listener);
                    }
                }
                exports.Client = Client;
                window.AP = {...(window.AP || {}), Client}
                _Client_socket = new WeakMap(), _Client_status = new WeakMap(), _Client_emitter = new WeakMap(), _Client_dataManager = new WeakMap(), _Client_hintManager = new WeakMap(), _Client_itemsManager = new WeakMap(), _Client_locationsManager = new WeakMap(), _Client_playersManager = new WeakMap(), _Client_instances = new WeakSet(), _Client_finalizeConnection = function _Client_finalizeConnection(info) {
                    var _a;
                    const version = (_a = info.version) !== null && _a !== void 0 ? _a : exports.MINIMUM_SUPPORTED_AP_VERSION;
                    return new Promise((resolve, reject) => {
                        var _a, _b, _c;
                        // Successfully connected!
                        const onConnectedListener = (packet) => {
                            __classPrivateFieldSet(this, _Client_status, ConnectionStatus_1.CONNECTION_STATUS.CONNECTED, "f");
                            this.removeListener(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED, onConnectedListener.bind(this));
                            resolve(packet);
                        };
                        const onConnectionRefusedListener = (packet) => {
                            this.disconnect();
                            reject(packet.errors);
                        };
                        this.addListener(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED, onConnectedListener.bind(this));
                        this.addListener(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTION_REFUSED, onConnectionRefusedListener.bind(this));
                        // Get the data package and connect to room.
                        this.send({
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.GET_DATA_PACKAGE,
                            games: __classPrivateFieldGet(this, _Client_dataManager, "f").games,
                        }, {
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.CONNECT,
                            game: info.game,
                            name: info.name,
                            version: Object.assign(Object.assign({}, version), { class: "Version" }),
                            items_handling: info.items_handling,
                            uuid: (_a = info.uuid) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
                            tags: (_b = info.tags) !== null && _b !== void 0 ? _b : [],
                            password: (_c = info.password) !== null && _c !== void 0 ? _c : "",
                        });
                    });
                }, _Client_connectSocket = function _Client_connectSocket(uri) {
                    return new Promise((resolve, reject) => {
                        __classPrivateFieldSet(this, _Client_socket, new isomorphic_ws_1.default(uri), "f");
                        // On successful connection.
                        __classPrivateFieldGet(this, _Client_socket, "f").onopen = () => {
                            __classPrivateFieldSet(this, _Client_status, ConnectionStatus_1.CONNECTION_STATUS.WAITING_FOR_AUTH, "f");
                            if (__classPrivateFieldGet(this, _Client_socket, "f")) {
                                __classPrivateFieldGet(this, _Client_socket, "f").onmessage = __classPrivateFieldGet(this, _Client_instances, "m", _Client_parsePackets).bind(this);
                                resolve();
                            }
                            else {
                                reject(["Socket was closed unexpectedly."]);
                            }
                        };
                        // On unsuccessful connection.
                        __classPrivateFieldGet(this, _Client_socket, "f").onerror = (event) => {
                            __classPrivateFieldSet(this, _Client_status, ConnectionStatus_1.CONNECTION_STATUS.DISCONNECTED, "f");
                            reject([event]);
                        };
                    });
                }, _Client_parsePackets = function _Client_parsePackets(event) {
                    // Parse packets and fire our PacketReceived event for each packet.
                    const packets = JSON.parse(event.data.toString());
                    for (const packet of packets) {
                        // Regardless of what type of event this is, we always emit the PacketReceived event.
                        __classPrivateFieldGet(this, _Client_emitter, "f").emit("PacketReceived", packet);
                        switch (packet.cmd) {
                            case CommandPacketType_1.SERVER_PACKET_TYPE.INVALID_PACKET:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.INVALID_PACKET, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.BOUNCED:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.BOUNCED, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTION_REFUSED:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTION_REFUSED, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.DATA_PACKAGE:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.DATA_PACKAGE, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.LOCATION_INFO:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.LOCATION_INFO, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.RECEIVED_ITEMS:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.RECEIVED_ITEMS, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.RETRIEVED:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.RETRIEVED, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_INFO:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_INFO, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_UPDATE:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_UPDATE, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.SET_REPLY:
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.SET_REPLY, packet);
                                break;
                            case CommandPacketType_1.SERVER_PACKET_TYPE.PRINT_JSON: {
                                // Add the plain text version of entire message for easy access.
                                __classPrivateFieldGet(this, _Client_emitter, "f").emit(CommandPacketType_1.SERVER_PACKET_TYPE.PRINT_JSON, packet, __classPrivateFieldGet(this, _Client_instances, "m", _Client_consolidateMessage).call(this, packet));
                                break;
                            }
                        }
                    }
                }, _Client_consolidateMessage = function _Client_consolidateMessage(packet) {
                    // If we're lucky, we can take a shortcut.
                    if (packet.type === PrintJSONType_1.PRINT_JSON_TYPE.CHAT || packet.type === PrintJSONType_1.PRINT_JSON_TYPE.SERVER_CHAT) {
                        return packet.message;
                    }
                    // I guess not, let's reduce through and create message, replacing text as needed if we run into any ids.
                    return packet.data.reduce((string, piece) => {
                        var _a, _b;
                        switch (piece.type) {
                            case types_1.VALID_JSON_MESSAGE_TYPE.PLAYER_ID:
                                return string + this.players.alias(parseInt(piece.text));
                            case types_1.VALID_JSON_MESSAGE_TYPE.LOCATION_ID:
                                return string + ((_a = this.players.get(piece.player)) === null || _a === void 0 ? void 0 : _a.location(parseInt(piece.text)));
                            case types_1.VALID_JSON_MESSAGE_TYPE.ITEM_ID:
                                return string + ((_b = this.players.get(piece.player)) === null || _b === void 0 ? void 0 : _b.item(parseInt(piece.text)));
                            default:
                                return string + piece.text;
                        }
                    }, "");
                };
                /** Minimum supported version of Archipelago this library supports. */
                exports.MINIMUM_SUPPORTED_AP_VERSION = {
                    major: 0,
                    minor: 4,
                    build: 2,
                };


                /***/
}),

/***/ 7321:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var _SetOperationsBuilder_operations, _SetOperationsBuilder_key, _SetOperationsBuilder_default, _SetOperationsBuilder_wantReply;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.SetOperationsBuilder = void 0;
                const CommandPacketType_1 = __webpack_require__(684);
                /**
                 * A helper class of data operations to perform server-side on a given key.
                 */
                class SetOperationsBuilder {
                    constructor(key, defaultValue, wantReply = false) {
                        _SetOperationsBuilder_operations.set(this, []);
                        _SetOperationsBuilder_key.set(this, void 0);
                        _SetOperationsBuilder_default.set(this, void 0);
                        _SetOperationsBuilder_wantReply.set(this, void 0);
                        __classPrivateFieldSet(this, _SetOperationsBuilder_key, key, "f");
                        __classPrivateFieldSet(this, _SetOperationsBuilder_default, defaultValue, "f");
                        __classPrivateFieldSet(this, _SetOperationsBuilder_wantReply, wantReply, "f");
                    }
                    replace(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "replace",
                            value,
                        });
                        return this;
                    }
                    default(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "default",
                            value,
                        });
                        return this;
                    }
                    add(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "add",
                            value,
                        });
                        return this;
                    }
                    multiply(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "mul",
                            value,
                        });
                        return this;
                    }
                    power(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "pow",
                            value,
                        });
                        return this;
                    }
                    modulo(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "mod",
                            value,
                        });
                        return this;
                    }
                    max(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "max",
                            value,
                        });
                        return this;
                    }
                    min(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "min",
                            value,
                        });
                        return this;
                    }
                    and(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "and",
                            value,
                        });
                        return this;
                    }
                    or(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "or",
                            value,
                        });
                        return this;
                    }
                    xor(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "xor",
                            value,
                        });
                        return this;
                    }
                    shiftLeft(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "left_shift",
                            value,
                        });
                        return this;
                    }
                    shiftRight(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "right_shift",
                            value,
                        });
                        return this;
                    }
                    remove(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "remove",
                            value,
                        });
                        return this;
                    }
                    pop(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "pop",
                            value,
                        });
                        return this;
                    }
                    update(value) {
                        __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f").push({
                            operation: "update",
                            value,
                        });
                        return this;
                    }
                    build() {
                        return {
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.SET,
                            key: __classPrivateFieldGet(this, _SetOperationsBuilder_key, "f"),
                            default: __classPrivateFieldGet(this, _SetOperationsBuilder_default, "f"),
                            want_reply: __classPrivateFieldGet(this, _SetOperationsBuilder_wantReply, "f"),
                            operations: __classPrivateFieldGet(this, _SetOperationsBuilder_operations, "f"),
                        };
                    }
                }
                exports.SetOperationsBuilder = SetOperationsBuilder;
                _SetOperationsBuilder_operations = new WeakMap(), _SetOperationsBuilder_key = new WeakMap(), _SetOperationsBuilder_default = new WeakMap(), _SetOperationsBuilder_wantReply = new WeakMap();


                /***/
}),

/***/ 5161:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.CLIENT_STATUS = void 0;
                /**
                 *  An enumeration containing the possible client states that may be used to inform the server in
                 * {@link StatusUpdatePacket}.
                 */
                exports.CLIENT_STATUS = {
                    /** Client is in an unknown state. */
                    UNKNOWN: 0,
                    /** Client is currently connected. */
                    CONNECTED: 5,
                    /** Client is current ready to start. */
                    READY: 10,
                    /** Client is currently playing. */
                    PLAYING: 20,
                    /** Client has completed their goal. */
                    GOAL: 30,
                };


                /***/
}),

/***/ 684:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.CLIENT_PACKET_TYPE = exports.SERVER_PACKET_TYPE = void 0;
                /**
                 * A const of all possible packet types the server can send to the client. See each packet's documentation page for
                 * additional information on each packet type.
                 */
                exports.SERVER_PACKET_TYPE = {
                    BOUNCED: "Bounced",
                    CONNECTED: "Connected",
                    CONNECTION_REFUSED: "ConnectionRefused",
                    DATA_PACKAGE: "DataPackage",
                    INVALID_PACKET: "InvalidPacket",
                    LOCATION_INFO: "LocationInfo",
                    PRINT_JSON: "PrintJSON",
                    RECEIVED_ITEMS: "ReceivedItems",
                    RETRIEVED: "Retrieved",
                    ROOM_INFO: "RoomInfo",
                    ROOM_UPDATE: "RoomUpdate",
                    SET_REPLY: "SetReply",
                };
                /**
                 * A const of all possible packet types the client can send to the server. See each packet's documentation page for
                 * additional information on each packet type.
                 */
                exports.CLIENT_PACKET_TYPE = {
                    BOUNCE: "Bounce",
                    CONNECT: "Connect",
                    CONNECT_UPDATE: "ConnectUpdate",
                    GET_DATA_PACKAGE: "GetDataPackage",
                    GET: "Get",
                    LOCATION_CHECKS: "LocationChecks",
                    LOCATION_SCOUTS: "LocationScouts",
                    SAY: "Say",
                    SET_NOTIFY: "SetNotify",
                    SET: "Set",
                    STATUS_UPDATE: "StatusUpdate",
                    SYNC: "Sync",
                };


                /***/
}),

/***/ 8868:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.COMMON_TAGS = void 0;
                /**
                 * Tags are represented as a list of strings, these are some of the most common tags.
                 */
                exports.COMMON_TAGS = {
                    /**
                     * Signifies that this client is a reference client, its usefulness is mostly in debugging to compare client
                     * behaviours more easily.
                     *
                     * **This tag should only be utilized by clients that come pre-packaged with Archipelago.**
                     */
                    REFERENCE_CLIENT: "AP",
                    /**
                     * Client participates in the DeathLink mechanic, therefore will send and receive DeathLink {@link BouncePacket}s.
                     */
                    DEATH_LINK: "DeathLink",
                    /**
                     * Tells the server that this client will not send locations and is actually a Tracker. When specified and used with
                     * an empty `game` in the {@link ConnectPacket}, `game` and `game`'s version validation will be skipped.
                     */
                    TRACKER: "Tracker",
                    /**
                     * Tells the server that this client will not send locations and is intended for chat. When specified and used with
                     * an empty `game` in the {@link ConnectPacket}, `game` and `game`'s version validation will be skipped.
                     */
                    TEXT_ONLY: "TextOnly",
                };


                /***/
}),

/***/ 2135:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.CONNECTION_ERROR = void 0;
                /**
                 * An enumeration of known errors the Archipelago server can send back to the client when they receive a
                 * {@link ConnectionRefusedPacket}.
                 */
                exports.CONNECTION_ERROR = {
                    /** Indicates that the `name` field did not match any auth entry on the server. */
                    INVALID_SLOT: "InvalidSlot",
                    /** Indicates that a correctly named slot was found, but the game for it mismatched. */
                    INVALID_GAME: "InvalidGame",
                    /** Indicates a version mismatch or an unsupported client version number. */
                    INCOMPATIBLE_VERSION: "IncompatibleVersion",
                    /** Indicates the wrong, or no password when it was required, was sent. */
                    INVALID_PASSWORD: "InvalidPassword",
                    /** Indicates a wrong value type or flag combination was sent. */
                    INVALID_ITEMS_HANDLING: "InvalidItemsHandling",
                };


                /***/
}),

/***/ 1537:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.CONNECTION_STATUS = void 0;
                /**
                 * A const of the current {@link Client} connection status to the Archipelago server.
                 */
                exports.CONNECTION_STATUS = {
                    /** Currently not connected to any Archipelago server. */
                    DISCONNECTED: "Disconnected",
                    /** Attempting to establish a connection to the Archipelago server. */
                    CONNECTING: "Connecting",
                    /** Connected to the Archipelago server, but awaiting to authenticate to join the room. */
                    WAITING_FOR_AUTH: "Waiting For Authentication",
                    /** Connected to the Archipelago server and authenticated to the current room. */
                    CONNECTED: "Connected",
                };


                /***/
}),

/***/ 3423:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.CREATE_AS_HINT_MODE = void 0;
                /**
                 * The hint type for `create_as_hint` in {@link LocationScoutsPacket}.
                 */
                exports.CREATE_AS_HINT_MODE = {
                    /** Does not mark any location to be hinted and broadcast to clients. */
                    NO_HINT: 0,
                    /** Mark all locations as hinted and show to all relevant clients. */
                    HINT_EVERYTHING: 1,
                    /** Mark all locations as hinted and show only newly hinted locations to relevant clients. */
                    HINT_ONLY_NEW: 2,
                };


                /***/
}),

/***/ 343:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.ITEM_FLAGS = void 0;
                /**
                 * Bit flags that determine if an item is progression, "nice to have", filler, or a trap.
                 */
                exports.ITEM_FLAGS = {
                    /** Nothing special about this item. */
                    FILLER: 0,
                    /** If set, indicates the item can unlock logical advancement. */
                    PROGRESSION: 0b001,
                    /** If set, indicates the item is important but not in a way that unlocks advancement. */
                    NEVER_EXCLUDE: 0b010,
                    /** If set, indicates the item is a trap that can inconvenience the player. */
                    TRAP: 0b100,
                };


                /***/
}),

/***/ 187:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.ITEMS_HANDLING_FLAGS = void 0;
                /**
                 * Bit flags configuring which items should be sent by the server to this client.
                 */
                exports.ITEMS_HANDLING_FLAGS = {
                    /** No ReceivedItems is sent to you, ever. */
                    LOCAL_ONLY: 0b000,
                    /** Indicates you get items sent from other worlds. */
                    REMOTE_DIFFERENT_WORLDS: 0b001,
                    /** Indicates you get items sent from your own world. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
                    REMOTE_OWN_WORLD: 0b010,
                    /** Indicates you get your starting inventory sent. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
                    REMOTE_STARTING_INVENTORY: 0b100,
                    /** Shorthand for `REMOTE_DIFFERENT_WORLDS`, `REMOTE_OWN_WORLD`, and `REMOTE_STARTING_INVENTORY`. */
                    REMOTE_ALL: 0b111,
                };
                window.AP = { ...(window.AP || {}), ITEMS_HANDLING_FLAGS: exports.ITEMS_HANDLING_FLAGS}

                /***/
}),

/***/ 6582:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.PACKET_PROBLEM_TYPE = void 0;
                /**
                 * PacketProblemType indicates the type of problem that was detected in the faulty packet, the known problem types are
                 * below but others may be added in the future.
                 */
                exports.PACKET_PROBLEM_TYPE = {
                    /** `cmd` argument of the faulty packet that could not be parsed correctly. */
                    CMD: "cmd",
                    /** Arguments of the faulty packet which were not correct. */
                    ARGUMENTS: "arguments",
                };


                /***/
}),

/***/ 1386:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.REDUCED_PERMISSION = exports.PERMISSION = void 0;
                /**
                 * A const containing the possible command permissions, for commands that may be restricted.
                 */
                exports.PERMISSION = {
                    /** Prevents players from using this command at any time. */
                    DISABLED: 0,
                    /** Allows players to use this command manually at any time. */
                    ENABLED: 0b001,
                    /** Allows players to use this command manually after they have completed their goal. */
                    GOAL: 0b010,
                    /**
                     * Forces players to use this command after they have completed their goal. Only works for `!release` and `!collect`
                     */
                    AUTO: 0b110,
                    /**
                     * Allows players to use this command manually at any time and forces them to use this command after they have
                     * completed their goal.
                     */
                    AUTO_ENABLED: 0b111,
                };
                /**
                 * A const containing the possible command permissions, for commands that may be restricted and do not support auto
                 * modes.
                 */
                exports.REDUCED_PERMISSION = {
                    /** Prevents players from using this command at any time. */
                    DISABLED: 0,
                    /** Allows players to use this command manually at any time. */
                    ENABLED: 0b001,
                    /** Allows players to use this command manually after they have completed their goal. */
                    GOAL: 0b010,
                };


                /***/
}),

/***/ 5432:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.PRINT_JSON_TYPE = void 0;
                /**
                 * A const of known {@link PrintJSONPacket} types.
                 */
                exports.PRINT_JSON_TYPE = {
                    /** A player received an item. */
                    ITEM_SEND: "ItemSend",
                    /** A player used the `!getitem` command. */
                    ITEM_CHEAT: "ItemCheat",
                    /** A player hinted. */
                    HINT: "Hint",
                    /** A player connected. */
                    JOIN: "Join",
                    /** A player disconnected. */
                    PART: "Part",
                    /** A player sent a chat message. */
                    CHAT: "Chat",
                    /** The server broadcast a message. */
                    SERVER_CHAT: "ServerChat",
                    /** The client has triggered a tutorial message, such as when first connecting. */
                    TUTORIAL: "Tutorial",
                    /** A player changed their tags. */
                    TAGS_CHANGED: "TagsChanged",
                    /** Someone (usually the client) entered an `!` command. */
                    COMMAND_RESULT: "CommandResult",
                    /** The client entered an `!admin` command. */
                    ADMIN_COMMAND_RESULT: "AdminCommandResult",
                    /** A player reached their goal. */
                    GOAL: "Goal",
                    /** A player released the remaining items in their world. */
                    RELEASE: "Release",
                    /** A player collected the remaining items for their world. */
                    COLLECT: "Collect",
                    /** The current server countdown has progressed. */
                    COUNTDOWN: "Countdown",
                };


                /***/
}),

/***/ 1723:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.SLOT_TYPE = void 0;
                /**
                 * A const representing the nature of the slot.
                 */
                exports.SLOT_TYPE = {
                    /** This client is a spectator and not participating in the current game. */
                    SPECTATOR: 0b00,
                    /** This client is a player and is participating in the current game. */
                    PLAYER: 0b01,
                    /** This client is an item links group containing at least 1 player with active item links. */
                    GROUP: 0b10,
                };


                /***/
}),

/***/ 3607:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    var desc = Object.getOwnPropertyDescriptor(m, k);
                    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                        desc = { enumerable: true, get: function () { return m[k]; } };
                    }
                    Object.defineProperty(o, k2, desc);
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __exportStar = (this && this.__exportStar) || function (m, exports) {
                    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
                };
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                __exportStar(__webpack_require__(6108), exports);
                __exportStar(__webpack_require__(7321), exports);
                __exportStar(__webpack_require__(5161), exports);
                __exportStar(__webpack_require__(684), exports);
                __exportStar(__webpack_require__(8868), exports);
                __exportStar(__webpack_require__(2135), exports);
                __exportStar(__webpack_require__(1537), exports);
                __exportStar(__webpack_require__(3423), exports);
                __exportStar(__webpack_require__(343), exports);
                __exportStar(__webpack_require__(187), exports);
                __exportStar(__webpack_require__(6582), exports);
                __exportStar(__webpack_require__(1386), exports);
                __exportStar(__webpack_require__(5432), exports);
                __exportStar(__webpack_require__(1723), exports);
                __exportStar(__webpack_require__(3804), exports);
                __exportStar(__webpack_require__(8783), exports);
                __exportStar(__webpack_require__(6833), exports);
                __exportStar(__webpack_require__(1159), exports);
                __exportStar(__webpack_require__(3150), exports);
                __exportStar(__webpack_require__(2422), exports);
                __exportStar(__webpack_require__(1551), exports);
                __exportStar(__webpack_require__(8858), exports);
                __exportStar(__webpack_require__(8602), exports);
                __exportStar(__webpack_require__(8247), exports);
                __exportStar(__webpack_require__(8223), exports);
                __exportStar(__webpack_require__(9698), exports);
                __exportStar(__webpack_require__(1522), exports);
                __exportStar(__webpack_require__(1726), exports);
                __exportStar(__webpack_require__(8264), exports);
                __exportStar(__webpack_require__(2888), exports);
                __exportStar(__webpack_require__(1486), exports);
                __exportStar(__webpack_require__(7345), exports);
                __exportStar(__webpack_require__(6240), exports);
                __exportStar(__webpack_require__(7433), exports);
                __exportStar(__webpack_require__(7095), exports);
                __exportStar(__webpack_require__(4199), exports);
                __exportStar(__webpack_require__(6394), exports);
                __exportStar(__webpack_require__(3859), exports);
                __exportStar(__webpack_require__(2864), exports);
                __exportStar(__webpack_require__(7141), exports);
                __exportStar(__webpack_require__(3267), exports);
                __exportStar(__webpack_require__(3396), exports);
                __exportStar(__webpack_require__(5145), exports);
                __exportStar(__webpack_require__(2014), exports);
                // Export types.
                __exportStar(__webpack_require__(1230), exports);


                /***/
}),

/***/ 3804:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                    return new (P || (P = Promise))(function (resolve, reject) {
                        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                        step((generator = generator.apply(thisArg, _arguments || [])).next());
                    });
                };
                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var _DataManager_instances, _DataManager_client, _DataManager_dataPackage, _DataManager_players, _DataManager_games, _DataManager_hintCost, _DataManager_hintPoints, _DataManager_slotData, _DataManager_slot, _DataManager_team, _DataManager_seed, _DataManager_awaitingSetReplies, _DataManager_permissions, _DataManager_onSetReply, _DataManager_onDataPackage, _DataManager_onConnected, _DataManager_onRoomInfo, _DataManager_onRoomUpdate;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.DataManager = void 0;
                const CommandPacketType_1 = __webpack_require__(684);
                const Permission_1 = __webpack_require__(1386);
                const SlotType_1 = __webpack_require__(1723);
                /**
                 * Manages and watches for events regarding session data and the data package. Most other mangers use this information
                 * to create helper functions and track other information.
                 */
                class DataManager {
                    /**
                     * Creates a new {@link DataManager} and sets up events on the {@link Client} to listen for to start
                     * updating its internal state.
                     * @param client The {@link Client} that should be managing this manager.
                     */
                    constructor(client) {
                        _DataManager_instances.add(this);
                        _DataManager_client.set(this, void 0);
                        _DataManager_dataPackage.set(this, new Map());
                        _DataManager_players.set(this, []);
                        _DataManager_games.set(this, []);
                        _DataManager_hintCost.set(this, 0);
                        _DataManager_hintPoints.set(this, 0);
                        _DataManager_slotData.set(this, {});
                        _DataManager_slot.set(this, -1);
                        _DataManager_team.set(this, -1);
                        _DataManager_seed.set(this, "");
                        _DataManager_awaitingSetReplies.set(this, []);
                        _DataManager_permissions.set(this, {
                            release: Permission_1.PERMISSION.DISABLED,
                            collect: Permission_1.PERMISSION.DISABLED,
                            remaining: Permission_1.PERMISSION.DISABLED,
                        });
                        __classPrivateFieldSet(this, _DataManager_client, client, "f");
                        __classPrivateFieldGet(this, _DataManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.DATA_PACKAGE, __classPrivateFieldGet(this, _DataManager_instances, "m", _DataManager_onDataPackage).bind(this));
                        __classPrivateFieldGet(this, _DataManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED, __classPrivateFieldGet(this, _DataManager_instances, "m", _DataManager_onConnected).bind(this));
                        __classPrivateFieldGet(this, _DataManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_INFO, __classPrivateFieldGet(this, _DataManager_instances, "m", _DataManager_onRoomInfo).bind(this));
                        __classPrivateFieldGet(this, _DataManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_UPDATE, __classPrivateFieldGet(this, _DataManager_instances, "m", _DataManager_onRoomUpdate).bind(this));
                        __classPrivateFieldGet(this, _DataManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.SET_REPLY, __classPrivateFieldGet(this, _DataManager_instances, "m", _DataManager_onSetReply).bind(this));
                    }
                    /**
                     * Returns a map of all {@link GamePackage} mapped to their game `name`.
                     */
                    get package() {
                        return __classPrivateFieldGet(this, _DataManager_dataPackage, "f");
                    }
                    /**
                     * Returns an array of all `players`, keyed by player id.
                     */
                    get players() {
                        return __classPrivateFieldGet(this, _DataManager_players, "f");
                    }
                    /**
                     * Returns an array of all games that exist in this room.
                     */
                    get games() {
                        return __classPrivateFieldGet(this, _DataManager_games, "f");
                    }
                    /**
                     * Returns how many hint points a player needs to spend to receive a hint.
                     */
                    get hintCost() {
                        return __classPrivateFieldGet(this, _DataManager_hintCost, "f");
                    }
                    /**
                     * Returns how many hint points a player has.
                     */
                    get hintPoints() {
                        return __classPrivateFieldGet(this, _DataManager_hintPoints, "f");
                    }
                    /**
                     * Returns the slot data for this game. Will be `undefined` if no connection has been established.
                     */
                    get slotData() {
                        return __classPrivateFieldGet(this, _DataManager_slotData, "f");
                    }
                    /**
                     * Returns this player's slot. Returns `-1` if player is not connected.
                     */
                    get slot() {
                        return __classPrivateFieldGet(this, _DataManager_slot, "f");
                    }
                    /**
                     * Returns this player's team. Returns `-1` if player is not connected.
                     */
                    get team() {
                        return __classPrivateFieldGet(this, _DataManager_team, "f");
                    }
                    /**
                     * Return the seed for this room.
                     */
                    get seed() {
                        return __classPrivateFieldGet(this, _DataManager_seed, "f");
                    }
                    /**
                     * Get the current permissions for the room.
                     */
                    get permissions() {
                        return __classPrivateFieldGet(this, _DataManager_permissions, "f");
                    }
                    /**
                     * Send a series of set operations to the server. Promise returns a {@link SetReplyPacket} if `want_reply` was
                     * requested.
                     *
                     * @param setOperation The set builder to do operations on the data storage.
                     */
                    set(setOperation) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const packet = setOperation.build();
                            if (packet.want_reply) {
                                return new Promise((resolve) => {
                                    __classPrivateFieldGet(this, _DataManager_awaitingSetReplies, "f").push({ key: packet.key, resolve });
                                    __classPrivateFieldGet(this, _DataManager_client, "f").send(packet);
                                });
                            }
                            else {
                                __classPrivateFieldGet(this, _DataManager_client, "f").send(packet);
                            }
                        });
                    }
                }
                exports.DataManager = DataManager;
                _DataManager_client = new WeakMap(), _DataManager_dataPackage = new WeakMap(), _DataManager_players = new WeakMap(), _DataManager_games = new WeakMap(), _DataManager_hintCost = new WeakMap(), _DataManager_hintPoints = new WeakMap(), _DataManager_slotData = new WeakMap(), _DataManager_slot = new WeakMap(), _DataManager_team = new WeakMap(), _DataManager_seed = new WeakMap(), _DataManager_awaitingSetReplies = new WeakMap(), _DataManager_permissions = new WeakMap(), _DataManager_instances = new WeakSet(), _DataManager_onSetReply = function _DataManager_onSetReply(packet) {
                    const replyIndex = __classPrivateFieldGet(this, _DataManager_awaitingSetReplies, "f").findIndex((s) => s.key === packet.key);
                    if (replyIndex !== -1) {
                        const { resolve } = __classPrivateFieldGet(this, _DataManager_awaitingSetReplies, "f")[replyIndex];
                        // Remove the "await".
                        __classPrivateFieldGet(this, _DataManager_awaitingSetReplies, "f").splice(replyIndex, 1);
                        resolve(packet);
                    }
                }, _DataManager_onDataPackage = function _DataManager_onDataPackage(packet) {
                    // TODO: Cache results.
                    for (const game in packet.data.games) {
                        const data = packet.data.games[game];
                        __classPrivateFieldGet(this, _DataManager_dataPackage, "f").set(game, data);
                        let createItemNameGroup = false;
                        let createLocationNameGroup = false;
                        // Check if these fields exist, if not, let's add them.
                        if (!data.item_name_groups) {
                            data.item_name_groups = { Everything: [] };
                            createItemNameGroup = true;
                        }
                        if (!data.location_name_groups) {
                            data.location_name_groups = { Everywhere: [] };
                            createLocationNameGroup = true;
                        }
                        // Build reverse lookups for items and locations. (also add to Everywhere and Everything group if needed)
                        data.location_id_to_name = {};
                        data.item_id_to_name = {};
                        for (const [name, id] of Object.entries(data.location_name_to_id)) {
                            data.location_id_to_name[id] = name;
                            if (createLocationNameGroup) {
                                data.location_name_groups["Everywhere"].push(name);
                            }
                        }
                        for (const [name, id] of Object.entries(data.item_name_to_id)) {
                            data.item_id_to_name[id] = name;
                            if (createItemNameGroup) {
                                data.item_name_groups["Everything"].push(name);
                            }
                        }
                    }
                }, _DataManager_onConnected = function _DataManager_onConnected(packet) {
                    var _a;
                    // Archipelago player for slot 0 is implicitly the server.
                    const players = [
                        {
                            name: "Archipelago",
                            slot: 0,
                            game: "Archipelago",
                            team: 0,
                            type: SlotType_1.SLOT_TYPE.SPECTATOR,
                            alias: "Archipelago",
                            group_members: [],
                            item: (id) => __classPrivateFieldGet(this, _DataManager_client, "f").items.name(0, id),
                            location: (id) => __classPrivateFieldGet(this, _DataManager_client, "f").locations.name(0, id),
                        },
                    ];
                    // Add all players.
                    for (const networkPlayer of packet.players) {
                        const player = Object.assign(Object.assign(Object.assign({}, networkPlayer), packet.slot_info[networkPlayer.slot]), { item: (id) => __classPrivateFieldGet(this, _DataManager_client, "f").items.name(networkPlayer.slot, id), location: (id) => __classPrivateFieldGet(this, _DataManager_client, "f").locations.name(networkPlayer.slot, id) });
                        players[player.slot] = player;
                    }
                    __classPrivateFieldSet(this, _DataManager_players, players, "f");
                    __classPrivateFieldSet(this, _DataManager_slot, packet.slot, "f");
                    __classPrivateFieldSet(this, _DataManager_team, packet.team, "f");
                    __classPrivateFieldSet(this, _DataManager_hintPoints, (_a = packet.hint_points) !== null && _a !== void 0 ? _a : 0, "f");
                    __classPrivateFieldSet(this, _DataManager_slotData, packet.slot_data, "f");
                }, _DataManager_onRoomInfo = function _DataManager_onRoomInfo(packet) {
                    __classPrivateFieldSet(this, _DataManager_seed, packet.seed_name, "f");
                    __classPrivateFieldSet(this, _DataManager_hintCost, packet.hint_cost, "f");
                    __classPrivateFieldSet(this, _DataManager_permissions, packet.permissions, "f");
                    __classPrivateFieldSet(this, _DataManager_games, packet.games, "f");
                    // We are ready to finalize connection.
                    __classPrivateFieldGet(this, _DataManager_client, "f").emitRawEvent("__onRoomInfoLoaded");
                }, _DataManager_onRoomUpdate = function _DataManager_onRoomUpdate(packet) {
                    if (packet.hint_points) {
                        __classPrivateFieldSet(this, _DataManager_hintPoints, packet.hint_points, "f");
                    }
                    if (packet.hint_cost) {
                        __classPrivateFieldSet(this, _DataManager_hintCost, packet.hint_cost, "f");
                    }
                    if (packet.permissions) {
                        __classPrivateFieldSet(this, _DataManager_permissions, packet.permissions, "f");
                    }
                    if (packet.players) {
                        for (const player of packet.players) {
                            __classPrivateFieldGet(this, _DataManager_players, "f")[player.slot] = Object.assign(Object.assign({}, __classPrivateFieldGet(this, _DataManager_players, "f")[player.slot]), player);
                        }
                    }
                };


                /***/
}),

/***/ 8783:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var _HintsManager_instances, _HintsManager_client, _HintsManager_hints, _HintsManager_onSetReply, _HintsManager_onRetrieved, _HintsManager_onConnected;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.HintsManager = void 0;
                const CommandPacketType_1 = __webpack_require__(684);
                /**
                 * Manages and watches for hint events to this player slot and provides helper functions to make working with hints
                 * easier.
                 */
                class HintsManager {
                    constructor(client) {
                        _HintsManager_instances.add(this);
                        _HintsManager_client.set(this, void 0);
                        _HintsManager_hints.set(this, []);
                        __classPrivateFieldSet(this, _HintsManager_client, client, "f");
                        __classPrivateFieldGet(this, _HintsManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.SET_REPLY, __classPrivateFieldGet(this, _HintsManager_instances, "m", _HintsManager_onSetReply).bind(this));
                        __classPrivateFieldGet(this, _HintsManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.RETRIEVED, __classPrivateFieldGet(this, _HintsManager_instances, "m", _HintsManager_onRetrieved).bind(this));
                        __classPrivateFieldGet(this, _HintsManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED, __classPrivateFieldGet(this, _HintsManager_instances, "m", _HintsManager_onConnected).bind(this));
                    }
                    /**
                     * Get all hints that are relevant for this slot.
                     */
                    get mine() {
                        return __classPrivateFieldGet(this, _HintsManager_hints, "f");
                    }
                }
                exports.HintsManager = HintsManager;
                _HintsManager_client = new WeakMap(), _HintsManager_hints = new WeakMap(), _HintsManager_instances = new WeakSet(), _HintsManager_onSetReply = function _HintsManager_onSetReply(packet) {
                    if (packet.key === `_read_hints_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.team}_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.slot}`) {
                        __classPrivateFieldSet(this, _HintsManager_hints, packet.value, "f");
                    }
                }, _HintsManager_onRetrieved = function _HintsManager_onRetrieved(packet) {
                    for (const key in packet.keys) {
                        if (key !== `_read_hints_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.team}_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.slot}`) {
                            continue;
                        }
                        __classPrivateFieldSet(this, _HintsManager_hints, packet.keys[key], "f");
                    }
                }, _HintsManager_onConnected = function _HintsManager_onConnected() {
                    // Once connected, let's send out our set_notify for hints.
                    __classPrivateFieldGet(this, _HintsManager_client, "f").send({
                        cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.SET_NOTIFY,
                        keys: [`_read_hints_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.team}_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.slot}`],
                    }, {
                        cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.GET,
                        keys: [`_read_hints_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.team}_${__classPrivateFieldGet(this, _HintsManager_client, "f").data.slot}`],
                    });
                };


                /***/
}),

/***/ 6833:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var _ItemsManager_instances, _ItemsManager_client, _ItemsManager_items, _ItemsManager_index, _ItemsManager_onReceivedItems;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.ItemsManager = void 0;
                const CommandPacketType_1 = __webpack_require__(684);
                /**
                 * Manages and watches for events regarding item data and provides helper functions to make working with items easier.
                 */
                class ItemsManager {
                    /**
                     * Creates a new {@link ItemsManager} and sets up events on the {@link Client} to listen for to start
                     * updating its internal state.
                     *
                     * @param client The {@link Client} that should be managing this manager.
                     */
                    constructor(client) {
                        _ItemsManager_instances.add(this);
                        _ItemsManager_client.set(this, void 0);
                        _ItemsManager_items.set(this, []);
                        _ItemsManager_index.set(this, 0);
                        __classPrivateFieldSet(this, _ItemsManager_client, client, "f");
                        __classPrivateFieldGet(this, _ItemsManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.RECEIVED_ITEMS, __classPrivateFieldGet(this, _ItemsManager_instances, "m", _ItemsManager_onReceivedItems).bind(this));
                    }
                    name(value, id) {
                        if (isNaN(id) || !Number.isSafeInteger(id)) {
                            throw new Error(`'id' must be a safe integer. Received: ${id}`);
                        }
                        let game;
                        if (typeof value === "string") {
                            game = value;
                        }
                        else {
                            if (isNaN(value) || !Number.isSafeInteger(value)) {
                                throw new Error(`'player' must be a safe integer. Received: ${id}`);
                            }
                            const player = __classPrivateFieldGet(this, _ItemsManager_client, "f").players.get(value);
                            if (!player) {
                                return `Unknown Item: ${id}`;
                            }
                            game = player.game;
                        }
                        const gameData = __classPrivateFieldGet(this, _ItemsManager_client, "f").data.package.get(game);
                        if (!gameData) {
                            return `Unknown Item: ${id}`;
                        }
                        const name = gameData.item_id_to_name[id];
                        if (!name) {
                            return `Unknown Item: ${id}`;
                        }
                        return name;
                    }
                    /**
                     * Returns a list of all item names in a given group.
                     *
                     * @param game
                     * @param name
                     *
                     * @throws Throws an error if unable to find game for group in data package.
                     */
                    group(game, name) {
                        const gameData = __classPrivateFieldGet(this, _ItemsManager_client, "f").data.package.get(game);
                        if (!gameData) {
                            throw new Error(`Unknown Game: ${game}`);
                        }
                        const group = gameData.item_name_groups[name];
                        if (!group) {
                            return [];
                        }
                        return group;
                    }
                    /**
                     * Returns the current item index. If this value is larger than expected, that means new items have been received.
                     */
                    get index() {
                        return __classPrivateFieldGet(this, _ItemsManager_index, "f");
                    }
                    /**
                     * Returns an array of all items that have been received.
                     */
                    get received() {
                        return __classPrivateFieldGet(this, _ItemsManager_items, "f");
                    }
                }
                exports.ItemsManager = ItemsManager;
                _ItemsManager_client = new WeakMap(), _ItemsManager_items = new WeakMap(), _ItemsManager_index = new WeakMap(), _ItemsManager_instances = new WeakSet(), _ItemsManager_onReceivedItems = function _ItemsManager_onReceivedItems(packet) {
                    // De-sync occurred! Attempt a re-sync before continuing.
                    if (packet.index > __classPrivateFieldGet(this, _ItemsManager_index, "f")) {
                        __classPrivateFieldSet(this, _ItemsManager_index, 0, "f");
                        __classPrivateFieldGet(this, _ItemsManager_client, "f").send({
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.SYNC,
                        });
                        return;
                    }
                    let index = packet.index;
                    for (const item of packet.items) {
                        __classPrivateFieldGet(this, _ItemsManager_items, "f")[index++] = item;
                    }
                };


                /***/
}),

/***/ 1159:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var _LocationsManager_instances, _LocationsManager_client, _LocationsManager_checked, _LocationsManager_missing, _LocationsManager_onConnected, _LocationsManager_onRoomUpdate;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.LocationsManager = void 0;
                const CommandPacketType_1 = __webpack_require__(684);
                const CreateAsHintMode_1 = __webpack_require__(3423);
                /**
                 * Manages and watches for events regarding location data and provides helper functions to make checking, scouting, or
                 * working with locations in general easier.
                 */
                class LocationsManager {
                    /**
                     * Creates a new {@link LocationsManager} and sets up events on the {@link Client} to listen for to start
                     * updating its internal state.
                     *
                     * @param client The {@link Client} that should be managing this manager.
                     */
                    constructor(client) {
                        _LocationsManager_instances.add(this);
                        _LocationsManager_client.set(this, void 0);
                        _LocationsManager_checked.set(this, []);
                        _LocationsManager_missing.set(this, []);
                        __classPrivateFieldSet(this, _LocationsManager_client, client, "f");
                        __classPrivateFieldGet(this, _LocationsManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.CONNECTED, __classPrivateFieldGet(this, _LocationsManager_instances, "m", _LocationsManager_onConnected).bind(this));
                        __classPrivateFieldGet(this, _LocationsManager_client, "f").addListener(CommandPacketType_1.SERVER_PACKET_TYPE.ROOM_UPDATE, __classPrivateFieldGet(this, _LocationsManager_instances, "m", _LocationsManager_onRoomUpdate).bind(this));
                    }
                    /**
                     * An array of all checked locations.
                     */
                    get checked() {
                        return __classPrivateFieldGet(this, _LocationsManager_checked, "f");
                    }
                    /**
                     * An array of all locations that are not checked.
                     */
                    get missing() {
                        return __classPrivateFieldGet(this, _LocationsManager_missing, "f");
                    }
                    /**
                     * Check a list of locations and mark the locations as found.
                     *
                     * @param locationIds A list of location ids.
                     */
                    check(...locationIds) {
                        __classPrivateFieldGet(this, _LocationsManager_client, "f").send({
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.LOCATION_CHECKS,
                            locations: locationIds,
                        });
                    }
                    /**
                     * Scout a list of locations without marking the locations as found.
                     *
                     * @param hint Create a hint for these locations.
                     * @param locationIds A list of location ids.
                     */
                    scout(hint = CreateAsHintMode_1.CREATE_AS_HINT_MODE.NO_HINT, ...locationIds) {
                        __classPrivateFieldGet(this, _LocationsManager_client, "f").send({
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.LOCATION_SCOUTS,
                            locations: locationIds,
                            create_as_hint: hint,
                        });
                    }
                    name(value, id) {
                        if (isNaN(id) || !Number.isSafeInteger(id)) {
                            throw new Error(`'id' must be a safe integer. Received: ${id}`);
                        }
                        let game;
                        if (typeof value === "string") {
                            game = value;
                        }
                        else {
                            if (isNaN(value) || !Number.isSafeInteger(value)) {
                                throw new Error(`'player' must be a safe integer. Received: ${id}`);
                            }
                            const player = __classPrivateFieldGet(this, _LocationsManager_client, "f").players.get(value);
                            if (!player) {
                                return `Unknown Location: ${id}`;
                            }
                            game = player.game;
                        }
                        const gameData = __classPrivateFieldGet(this, _LocationsManager_client, "f").data.package.get(game);
                        if (!gameData) {
                            return `Unknown Location: ${id}`;
                        }
                        const name = gameData.location_id_to_name[id];
                        if (!name) {
                            return `Unknown Location: ${id}`;
                        }
                        return name;
                    }
                    /**
                     * Returns a list of all location names in a given group.
                     *
                     * @param game
                     * @param name
                     *
                     * @throws Throws an error if unable to find game for group in data package.
                     */
                    group(game, name) {
                        const gameData = __classPrivateFieldGet(this, _LocationsManager_client, "f").data.package.get(game);
                        if (!gameData) {
                            throw new Error(`Unknown Game: ${game}`);
                        }
                        const group = gameData.location_name_groups[name];
                        if (!group) {
                            return [];
                        }
                        return group;
                    }
                    /**
                     * Sends out all missing locations as checked.
                     */
                    autoRelease() {
                        __classPrivateFieldGet(this, _LocationsManager_client, "f").send({
                            cmd: CommandPacketType_1.CLIENT_PACKET_TYPE.LOCATION_CHECKS,
                            locations: __classPrivateFieldGet(this, _LocationsManager_missing, "f"),
                        });
                    }
                }
                exports.LocationsManager = LocationsManager;
                _LocationsManager_client = new WeakMap(), _LocationsManager_checked = new WeakMap(), _LocationsManager_missing = new WeakMap(), _LocationsManager_instances = new WeakSet(), _LocationsManager_onConnected = function _LocationsManager_onConnected(packet) {
                    __classPrivateFieldSet(this, _LocationsManager_checked, packet.checked_locations, "f");
                    __classPrivateFieldSet(this, _LocationsManager_missing, packet.missing_locations, "f");
                }, _LocationsManager_onRoomUpdate = function _LocationsManager_onRoomUpdate(packet) {
                    // Update our checked/missing arrays.
                    if (packet.checked_locations) {
                        for (const location of packet.checked_locations) {
                            if (!__classPrivateFieldGet(this, _LocationsManager_checked, "f").includes(location)) {
                                __classPrivateFieldGet(this, _LocationsManager_checked, "f").push(location);
                                // Remove from missing locations array as well.
                                const index = __classPrivateFieldGet(this, _LocationsManager_missing, "f").indexOf(location);
                                if (index !== -1) {
                                    __classPrivateFieldGet(this, _LocationsManager_missing, "f").splice(index, 1);
                                }
                            }
                        }
                    }
                };


                /***/
}),

/***/ 3150:
/***/ (function (__unused_webpack_module, exports) {


                var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
                    if (kind === "m") throw new TypeError("Private method is not writable");
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
                };
                var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
                    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
                    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
                };
                var _PlayersManager_client;
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.PlayersManager = void 0;
                /**
                 * Manages and watches for events regarding player data and provides helper functions to make working with players
                 * easier.
                 */
                class PlayersManager {
                    /**
                     * Creates a new {@link PlayersManager} and sets up events on the {@link Client} to listen for to start
                     * updating its internal state.
                     *
                     * @param client The {@link Client} that should be managing this manager.
                     */
                    constructor(client) {
                        _PlayersManager_client.set(this, void 0);
                        __classPrivateFieldSet(this, _PlayersManager_client, client, "f");
                    }
                    /**
                     * Returns an array of all `players`, keyed by player id.
                     */
                    get all() {
                        return __classPrivateFieldGet(this, _PlayersManager_client, "f").data.players;
                    }
                    /**
                     * Returns a specific `player` by player id. Returns undefined if player does not exist.
                     */
                    get(id) {
                        return __classPrivateFieldGet(this, _PlayersManager_client, "f").data.players[id];
                    }
                    /**
                     * Returns the `name` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
                     *
                     * Special cases:
                     * - If player id is `0`, returns `Archipelago`.
                     *
                     * @param id The slot `id` of a player.
                     *
                     * @throws Throws an error if unable to find a player with the given `id`.
                     */
                    name(id) {
                        var _a;
                        if (id === 0) {
                            return "Archipelago";
                        }
                        const name = (_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.name;
                        if (!name) {
                            throw new Error(`Unable to find player by id: ${id}`);
                        }
                        return name;
                    }
                    /**
                     * Returns the `alias` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
                     *
                     * Special cases:
                     * - If player id is `0`, returns `Archipelago`.
                     *
                     * @param id The slot `id` of a player.
                     *
                     * @throws Throws an error if unable to find a player with the given `id`.
                     */
                    alias(id) {
                        var _a;
                        if (id === 0) {
                            return "Archipelago";
                        }
                        const alias = (_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.alias;
                        if (!alias) {
                            throw new Error(`Unable to find player by id: ${id}`);
                        }
                        return alias;
                    }
                    /**
                     * Returns the game name of a given player.
                     *
                     * Special cases:
                     * - If player id is `0`, returns `Archipelago`.
                     *
                     * @param id The slot `id` of a player.
                     *
                     * @throws Throws an error if unable to find a player with the given `id`.
                     */
                    game(id) {
                        var _a;
                        if (id === 0) {
                            return "Archipelago";
                        }
                        const game = (_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.game;
                        if (!game) {
                            throw new Error(`Unable to find player by id: ${id}`);
                        }
                        return game;
                    }
                    /**
                     * Returns an array of player `id`s in a specific group. Returns an empty array for non-{@link SlotType.GROUP}
                     * members.
                     *
                     * @param id The slot `id` of a {@link SlotType.GROUP} player.
                     */
                    members(id) {
                        var _a;
                        const members = (_a = this.get(id)) === null || _a === void 0 ? void 0 : _a.group_members;
                        if (!members) {
                            return [];
                        }
                        return members;
                    }
                }
                exports.PlayersManager = PlayersManager;
                _PlayersManager_client = new WeakMap();


                /***/
}),

/***/ 2422:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 1551:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 8858:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 8602:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 8247:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 8223:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 9698:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 1522:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 1726:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 8264:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 2888:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 1486:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 7345:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 6240:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 7433:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 7095:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 4199:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 6394:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 3859:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 2864:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 7141:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 3267:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 3396:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 5145:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 2014:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 6231:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 4101:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 8380:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 7749:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 4569:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 182:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 44:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));
                exports.VALID_JSON_COLOR_TYPE = exports.VALID_JSON_MESSAGE_TYPE = void 0;
                /**
                 * This is a const of all supported message types for denoting the intent of the message part. This can be used to
                 * indicate special information which may be rendered differently depending on client.
                 *
                 * - `text`: Regular text content. Is the default type and as such may be omitted.
                 * - `player_id`: Player id of someone on your team, should be resolved to player Name.
                 * - `player_name`: Player Name, could be a player within a multiplayer game or from another team, not id resolvable.
                 * - `item_id`: Item id, should be resolved to an item name.
                 * - `item_name`: Item name, not currently used over network, but supported by reference clients.
                 * - `location_id`: Location id, should be resolved to a location name.
                 * - `location_name`: Location name, not currently used over network, but supported by reference clients.
                 * - `entrance_name`: Entrance name. No id mapping exists.
                 * - `color`: Regular text that should be colored. Only type that will contain color data.
                 */
                exports.VALID_JSON_MESSAGE_TYPE = {
                    TEXT: "text",
                    PLAYER_ID: "player_id",
                    PLAYER_NAME: "player_name",
                    ITEM_ID: "item_id",
                    ITEM_NAME: "item_name",
                    LOCATION_ID: "location_id",
                    LOCATION_NAME: "location_name",
                    ENTRANCE_NAME: "entrance_name",
                    COLOR: "color",
                };
                /**
                 * This is a const of all supported "colors" denoting a console color to display the message part with and is only
                 * sent if the `type` is `color`. This is limited to console colors due to backwards compatibility needs with games such
                 * as `A Link to the Past`. Although background colors as well as foreground colors are listed, only one may be applied
                 * to a {@link JSONMessagePart} at a time.
                 */
                exports.VALID_JSON_COLOR_TYPE = {
                    // Yes, 'bold' and 'underline' are colors. Deal with it.
                    BOLD: "bold",
                    UNDERLINE: "underline",
                    BLACK: "black",
                    RED: "red",
                    GREEN: "green",
                    YELLOW: "yellow",
                    BLUE: "blue",
                    MAGENTA: "magenta",
                    CYAN: "cyan",
                    WHITE: "white",
                    BLACK_BACKGROUND: "black_bg",
                    RED_BACKGROUND: "red_bg",
                    GREEN_BACKGROUND: "green_bg",
                    YELLOW_BACKGROUND: "yellow_bg",
                    BLUE_BACKGROUND: "blue_bg",
                    PURPLE_BACKGROUND: "purple_bg",
                    CYAN_BACKGROUND: "cyan_bg",
                    WHITE_BACKGROUND: "white_bg",
                };


                /***/
}),

/***/ 2561:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 9507:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 2034:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 4274:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 4971:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 2540:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 3585:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 2011:
/***/ ((__unused_webpack_module, exports) => {


                Object.defineProperty(exports, "__esModule", ({ value: true }));


                /***/
}),

/***/ 1230:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    var desc = Object.getOwnPropertyDescriptor(m, k);
                    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                        desc = { enumerable: true, get: function () { return m[k]; } };
                    }
                    Object.defineProperty(o, k2, desc);
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined) k2 = k;
                    o[k2] = m[k];
                }));
                var __exportStar = (this && this.__exportStar) || function (m, exports) {
                    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
                };
                Object.defineProperty(exports, "__esModule", ({ value: true }));
                __exportStar(__webpack_require__(6231), exports);
                __exportStar(__webpack_require__(4101), exports);
                __exportStar(__webpack_require__(8380), exports);
                __exportStar(__webpack_require__(7749), exports);
                __exportStar(__webpack_require__(4569), exports);
                __exportStar(__webpack_require__(182), exports);
                __exportStar(__webpack_require__(44), exports);
                __exportStar(__webpack_require__(2561), exports);
                __exportStar(__webpack_require__(9507), exports);
                __exportStar(__webpack_require__(2034), exports);
                __exportStar(__webpack_require__(4274), exports);
                __exportStar(__webpack_require__(4971), exports);
                __exportStar(__webpack_require__(2540), exports);
                __exportStar(__webpack_require__(3585), exports);
                __exportStar(__webpack_require__(2011), exports);


                /***/
}),

/***/ 7429:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                Object.defineProperty(exports, "NIL", ({
                    enumerable: true,
                    get: function get() {
                        return _nil.default;
                    }
                }));
                Object.defineProperty(exports, "parse", ({
                    enumerable: true,
                    get: function get() {
                        return _parse.default;
                    }
                }));
                Object.defineProperty(exports, "stringify", ({
                    enumerable: true,
                    get: function get() {
                        return _stringify.default;
                    }
                }));
                Object.defineProperty(exports, "v1", ({
                    enumerable: true,
                    get: function get() {
                        return _v.default;
                    }
                }));
                Object.defineProperty(exports, "v3", ({
                    enumerable: true,
                    get: function get() {
                        return _v2.default;
                    }
                }));
                Object.defineProperty(exports, "v4", ({
                    enumerable: true,
                    get: function get() {
                        return _v3.default;
                    }
                }));
                Object.defineProperty(exports, "v5", ({
                    enumerable: true,
                    get: function get() {
                        return _v4.default;
                    }
                }));
                Object.defineProperty(exports, "validate", ({
                    enumerable: true,
                    get: function get() {
                        return _validate.default;
                    }
                }));
                Object.defineProperty(exports, "version", ({
                    enumerable: true,
                    get: function get() {
                        return _version.default;
                    }
                }));

                var _v = _interopRequireDefault(__webpack_require__(3990));

                var _v2 = _interopRequireDefault(__webpack_require__(8237));

                var _v3 = _interopRequireDefault(__webpack_require__(5355));

                var _v4 = _interopRequireDefault(__webpack_require__(3764));

                var _nil = _interopRequireDefault(__webpack_require__(6314));

                var _version = _interopRequireDefault(__webpack_require__(8464));

                var _validate = _interopRequireDefault(__webpack_require__(6435));

                var _stringify = _interopRequireDefault(__webpack_require__(4008));

                var _parse = _interopRequireDefault(__webpack_require__(8222));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                /***/
}),

/***/ 4163:
/***/ ((__unused_webpack_module, exports) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                /*
                 * Browser-compatible JavaScript MD5
                 *
                 * Modification of JavaScript MD5
                 * https://github.com/blueimp/JavaScript-MD5
                 *
                 * Copyright 2011, Sebastian Tschan
                 * https://blueimp.net
                 *
                 * Licensed under the MIT license:
                 * https://opensource.org/licenses/MIT
                 *
                 * Based on
                 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
                 * Digest Algorithm, as defined in RFC 1321.
                 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
                 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
                 * Distributed under the BSD License
                 * See http://pajhome.org.uk/crypt/md5 for more info.
                 */
                function md5(bytes) {
                    if (typeof bytes === 'string') {
                        const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

                        bytes = new Uint8Array(msg.length);

                        for (let i = 0; i < msg.length; ++i) {
                            bytes[i] = msg.charCodeAt(i);
                        }
                    }

                    return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
                }
                /*
                 * Convert an array of little-endian words to an array of bytes
                 */


                function md5ToHexEncodedArray(input) {
                    const output = [];
                    const length32 = input.length * 32;
                    const hexTab = '0123456789abcdef';

                    for (let i = 0; i < length32; i += 8) {
                        const x = input[i >> 5] >>> i % 32 & 0xff;
                        const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
                        output.push(hex);
                    }

                    return output;
                }
                /**
                 * Calculate output length with padding and bit length
                 */


                function getOutputLength(inputLength8) {
                    return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
                }
                /*
                 * Calculate the MD5 of an array of little-endian words, and a bit length.
                 */


                function wordsToMd5(x, len) {
                    /* append padding */
                    x[len >> 5] |= 0x80 << len % 32;
                    x[getOutputLength(len) - 1] = len;
                    let a = 1732584193;
                    let b = -271733879;
                    let c = -1732584194;
                    let d = 271733878;

                    for (let i = 0; i < x.length; i += 16) {
                        const olda = a;
                        const oldb = b;
                        const oldc = c;
                        const oldd = d;
                        a = md5ff(a, b, c, d, x[i], 7, -680876936);
                        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
                        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                        b = md5gg(b, c, d, a, x[i], 20, -373897302);
                        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
                        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                        d = md5hh(d, a, b, c, x[i], 11, -358537222);
                        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
                        a = md5ii(a, b, c, d, x[i], 6, -198630844);
                        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
                        a = safeAdd(a, olda);
                        b = safeAdd(b, oldb);
                        c = safeAdd(c, oldc);
                        d = safeAdd(d, oldd);
                    }

                    return [a, b, c, d];
                }
                /*
                 * Convert an array bytes to an array of little-endian words
                 * Characters >255 have their high-byte silently ignored.
                 */


                function bytesToWords(input) {
                    if (input.length === 0) {
                        return [];
                    }

                    const length8 = input.length * 8;
                    const output = new Uint32Array(getOutputLength(length8));

                    for (let i = 0; i < length8; i += 8) {
                        output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
                    }

                    return output;
                }
                /*
                 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
                 * to work around bugs in some JS interpreters.
                 */


                function safeAdd(x, y) {
                    const lsw = (x & 0xffff) + (y & 0xffff);
                    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return msw << 16 | lsw & 0xffff;
                }
                /*
                 * Bitwise rotate a 32-bit number to the left.
                 */


                function bitRotateLeft(num, cnt) {
                    return num << cnt | num >>> 32 - cnt;
                }
                /*
                 * These functions implement the four basic operations the algorithm uses.
                 */


                function md5cmn(q, a, b, x, s, t) {
                    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
                }

                function md5ff(a, b, c, d, x, s, t) {
                    return md5cmn(b & c | ~b & d, a, b, x, s, t);
                }

                function md5gg(a, b, c, d, x, s, t) {
                    return md5cmn(b & d | c & ~d, a, b, x, s, t);
                }

                function md5hh(a, b, c, d, x, s, t) {
                    return md5cmn(b ^ c ^ d, a, b, x, s, t);
                }

                function md5ii(a, b, c, d, x, s, t) {
                    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
                }

                var _default = md5;
                exports["default"] = _default;

                /***/
}),

/***/ 4790:
/***/ ((__unused_webpack_module, exports) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;
                const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
                var _default = {
                    randomUUID
                };
                exports["default"] = _default;

                /***/
}),

/***/ 6314:
/***/ ((__unused_webpack_module, exports) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;
                var _default = '00000000-0000-0000-0000-000000000000';
                exports["default"] = _default;

                /***/
}),

/***/ 8222:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _validate = _interopRequireDefault(__webpack_require__(6435));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function parse(uuid) {
                    if (!(0, _validate.default)(uuid)) {
                        throw TypeError('Invalid UUID');
                    }

                    let v;
                    const arr = new Uint8Array(16); // Parse ########-....-....-....-............

                    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
                    arr[1] = v >>> 16 & 0xff;
                    arr[2] = v >>> 8 & 0xff;
                    arr[3] = v & 0xff; // Parse ........-####-....-....-............

                    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
                    arr[5] = v & 0xff; // Parse ........-....-####-....-............

                    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
                    arr[7] = v & 0xff; // Parse ........-....-....-####-............

                    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
                    arr[9] = v & 0xff; // Parse ........-....-....-....-############
                    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

                    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
                    arr[11] = v / 0x100000000 & 0xff;
                    arr[12] = v >>> 24 & 0xff;
                    arr[13] = v >>> 16 & 0xff;
                    arr[14] = v >>> 8 & 0xff;
                    arr[15] = v & 0xff;
                    return arr;
                }

                var _default = parse;
                exports["default"] = _default;

                /***/
}),

/***/ 58:
/***/ ((__unused_webpack_module, exports) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;
                var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
                exports["default"] = _default;

                /***/
}),

/***/ 3319:
/***/ ((__unused_webpack_module, exports) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = rng;
                // Unique ID creation requires a high quality random # generator. In the browser we therefore
                // require the crypto API and do not support built-in fallback to lower quality random number
                // generators (like Math.random()).
                let getRandomValues;
                const rnds8 = new Uint8Array(16);

                function rng() {
                    // lazy load so that environments that need to polyfill have a chance to do so
                    if (!getRandomValues) {
                        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
                        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

                        if (!getRandomValues) {
                            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
                        }
                    }

                    return getRandomValues(rnds8);
                }

                /***/
}),

/***/ 3757:
/***/ ((__unused_webpack_module, exports) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                // Adapted from Chris Veness' SHA1 code at
                // http://www.movable-type.co.uk/scripts/sha1.html
                function f(s, x, y, z) {
                    switch (s) {
                        case 0:
                            return x & y ^ ~x & z;

                        case 1:
                            return x ^ y ^ z;

                        case 2:
                            return x & y ^ x & z ^ y & z;

                        case 3:
                            return x ^ y ^ z;
                    }
                }

                function ROTL(x, n) {
                    return x << n | x >>> 32 - n;
                }

                function sha1(bytes) {
                    const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
                    const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

                    if (typeof bytes === 'string') {
                        const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

                        bytes = [];

                        for (let i = 0; i < msg.length; ++i) {
                            bytes.push(msg.charCodeAt(i));
                        }
                    } else if (!Array.isArray(bytes)) {
                        // Convert Array-like to Array
                        bytes = Array.prototype.slice.call(bytes);
                    }

                    bytes.push(0x80);
                    const l = bytes.length / 4 + 2;
                    const N = Math.ceil(l / 16);
                    const M = new Array(N);

                    for (let i = 0; i < N; ++i) {
                        const arr = new Uint32Array(16);

                        for (let j = 0; j < 16; ++j) {
                            arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
                        }

                        M[i] = arr;
                    }

                    M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
                    M[N - 1][14] = Math.floor(M[N - 1][14]);
                    M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

                    for (let i = 0; i < N; ++i) {
                        const W = new Uint32Array(80);

                        for (let t = 0; t < 16; ++t) {
                            W[t] = M[i][t];
                        }

                        for (let t = 16; t < 80; ++t) {
                            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
                        }

                        let a = H[0];
                        let b = H[1];
                        let c = H[2];
                        let d = H[3];
                        let e = H[4];

                        for (let t = 0; t < 80; ++t) {
                            const s = Math.floor(t / 20);
                            const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
                            e = d;
                            d = c;
                            c = ROTL(b, 30) >>> 0;
                            b = a;
                            a = T;
                        }

                        H[0] = H[0] + a >>> 0;
                        H[1] = H[1] + b >>> 0;
                        H[2] = H[2] + c >>> 0;
                        H[3] = H[3] + d >>> 0;
                        H[4] = H[4] + e >>> 0;
                    }

                    return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
                }

                var _default = sha1;
                exports["default"] = _default;

                /***/
}),

/***/ 4008:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;
                exports.unsafeStringify = unsafeStringify;

                var _validate = _interopRequireDefault(__webpack_require__(6435));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                /**
                 * Convert array of 16 byte values to UUID string format of the form:
                 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
                 */
                const byteToHex = [];

                for (let i = 0; i < 256; ++i) {
                    byteToHex.push((i + 0x100).toString(16).slice(1));
                }

                function unsafeStringify(arr, offset = 0) {
                    // Note: Be careful editing this code!  It's been tuned for performance
                    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
                    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
                }

                function stringify(arr, offset = 0) {
                    const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
                    // of the following:
                    // - One or more input array values don't map to a hex octet (leading to
                    // "undefined" in the uuid)
                    // - Invalid input values for the RFC `version` or `variant` fields

                    if (!(0, _validate.default)(uuid)) {
                        throw TypeError('Stringified UUID is invalid');
                    }

                    return uuid;
                }

                var _default = stringify;
                exports["default"] = _default;

                /***/
}),

/***/ 3990:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _rng = _interopRequireDefault(__webpack_require__(3319));

                var _stringify = __webpack_require__(4008);

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                // **`v1()` - Generate time-based UUID**
                //
                // Inspired by https://github.com/LiosK/UUID.js
                // and http://docs.python.org/library/uuid.html
                let _nodeId;

                let _clockseq; // Previous uuid creation time


                let _lastMSecs = 0;
                let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

                function v1(options, buf, offset) {
                    let i = buf && offset || 0;
                    const b = buf || new Array(16);
                    options = options || {};
                    let node = options.node || _nodeId;
                    let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
                    // specified.  We do this lazily to minimize issues related to insufficient
                    // system entropy.  See #189

                    if (node == null || clockseq == null) {
                        const seedBytes = options.random || (options.rng || _rng.default)();

                        if (node == null) {
                            // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
                            node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
                        }

                        if (clockseq == null) {
                            // Per 4.2.2, randomize (14 bit) clockseq
                            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
                        }
                    } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
                    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
                    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
                    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


                    let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
                    // cycle to simulate higher resolution clock

                    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

                    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

                    if (dt < 0 && options.clockseq === undefined) {
                        clockseq = clockseq + 1 & 0x3fff;
                    } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
                    // time interval


                    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
                        nsecs = 0;
                    } // Per 4.2.1.2 Throw error if too many uuids are requested


                    if (nsecs >= 10000) {
                        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                    }

                    _lastMSecs = msecs;
                    _lastNSecs = nsecs;
                    _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

                    msecs += 12219292800000; // `time_low`

                    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
                    b[i++] = tl >>> 24 & 0xff;
                    b[i++] = tl >>> 16 & 0xff;
                    b[i++] = tl >>> 8 & 0xff;
                    b[i++] = tl & 0xff; // `time_mid`

                    const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
                    b[i++] = tmh >>> 8 & 0xff;
                    b[i++] = tmh & 0xff; // `time_high_and_version`

                    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

                    b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

                    b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

                    b[i++] = clockseq & 0xff; // `node`

                    for (let n = 0; n < 6; ++n) {
                        b[i + n] = node[n];
                    }

                    return buf || (0, _stringify.unsafeStringify)(b);
                }

                var _default = v1;
                exports["default"] = _default;

                /***/
}),

/***/ 8237:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _v = _interopRequireDefault(__webpack_require__(7925));

                var _md = _interopRequireDefault(__webpack_require__(4163));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                const v3 = (0, _v.default)('v3', 0x30, _md.default);
                var _default = v3;
                exports["default"] = _default;

                /***/
}),

/***/ 7925:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports.URL = exports.DNS = void 0;
                exports["default"] = v35;

                var _stringify = __webpack_require__(4008);

                var _parse = _interopRequireDefault(__webpack_require__(8222));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function stringToBytes(str) {
                    str = unescape(encodeURIComponent(str)); // UTF8 escape

                    const bytes = [];

                    for (let i = 0; i < str.length; ++i) {
                        bytes.push(str.charCodeAt(i));
                    }

                    return bytes;
                }

                const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
                exports.DNS = DNS;
                const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
                exports.URL = URL;

                function v35(name, version, hashfunc) {
                    function generateUUID(value, namespace, buf, offset) {
                        var _namespace;

                        if (typeof value === 'string') {
                            value = stringToBytes(value);
                        }

                        if (typeof namespace === 'string') {
                            namespace = (0, _parse.default)(namespace);
                        }

                        if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
                            throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
                        } // Compute hash of namespace and value, Per 4.3
                        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
                        // hashfunc([...namespace, ... value])`


                        let bytes = new Uint8Array(16 + value.length);
                        bytes.set(namespace);
                        bytes.set(value, namespace.length);
                        bytes = hashfunc(bytes);
                        bytes[6] = bytes[6] & 0x0f | version;
                        bytes[8] = bytes[8] & 0x3f | 0x80;

                        if (buf) {
                            offset = offset || 0;

                            for (let i = 0; i < 16; ++i) {
                                buf[offset + i] = bytes[i];
                            }

                            return buf;
                        }

                        return (0, _stringify.unsafeStringify)(bytes);
                    } // Function#name is not settable on some platforms (#270)


                    try {
                        generateUUID.name = name; // eslint-disable-next-line no-empty
                    } catch (err) { } // For CommonJS default export support


                    generateUUID.DNS = DNS;
                    generateUUID.URL = URL;
                    return generateUUID;
                }

                /***/
}),

/***/ 5355:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _native = _interopRequireDefault(__webpack_require__(4790));

                var _rng = _interopRequireDefault(__webpack_require__(3319));

                var _stringify = __webpack_require__(4008);

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function v4(options, buf, offset) {
                    if (_native.default.randomUUID && !buf && !options) {
                        return _native.default.randomUUID();
                    }

                    options = options || {};

                    const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


                    rnds[6] = rnds[6] & 0x0f | 0x40;
                    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

                    if (buf) {
                        offset = offset || 0;

                        for (let i = 0; i < 16; ++i) {
                            buf[offset + i] = rnds[i];
                        }

                        return buf;
                    }

                    return (0, _stringify.unsafeStringify)(rnds);
                }

                var _default = v4;
                exports["default"] = _default;

                /***/
}),

/***/ 3764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _v = _interopRequireDefault(__webpack_require__(7925));

                var _sha = _interopRequireDefault(__webpack_require__(3757));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                const v5 = (0, _v.default)('v5', 0x50, _sha.default);
                var _default = v5;
                exports["default"] = _default;

                /***/
}),

/***/ 6435:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _regex = _interopRequireDefault(__webpack_require__(58));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function validate(uuid) {
                    return typeof uuid === 'string' && _regex.default.test(uuid);
                }

                var _default = validate;
                exports["default"] = _default;

                /***/
}),

/***/ 8464:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



                Object.defineProperty(exports, "__esModule", ({
                    value: true
                }));
                exports["default"] = void 0;

                var _validate = _interopRequireDefault(__webpack_require__(6435));

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                function version(uuid) {
                    if (!(0, _validate.default)(uuid)) {
                        throw TypeError('Invalid UUID');
                    }

                    return parseInt(uuid.slice(14, 15), 16);
                }

                var _default = version;
                exports["default"] = _default;

                /***/
})

        /******/
});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
            /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
            /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
        /******/
}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for (var key in definition) {
/******/ 				if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                    /******/
}
                /******/
}
            /******/
};
        /******/
})();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function () {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
                /******/
} catch (e) {
/******/ 				if (typeof window === 'object') return window;
                /******/
}
            /******/
})();
        /******/
})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
        /******/
})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/
}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
            /******/
};
        /******/
})();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(3607);
    /******/
    /******/
})()
    ;