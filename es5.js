'use strict'
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value)
				  })
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	}
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1]
					return t[1]
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this
				}),
			g
		)
		function verb(n) {
			return function (v) {
				return step([n, v])
			}
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.')
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t
					if (((y = 0), t)) op = [op[0] & 2, t.value]
					switch (op[0]) {
						case 0:
						case 1:
							t = op
							break
						case 4:
							_.label++
							return { value: op[1], done: false }
						case 5:
							_.label++
							y = op[1]
							op = [0]
							continue
						case 7:
							op = _.ops.pop()
							_.trys.pop()
							continue
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0
								continue
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1]
								break
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1]
								t = op
								break
							}
							if (t && _.label < t[2]) {
								_.label = t[2]
								_.ops.push(op)
								break
							}
							if (t[2]) _.ops.pop()
							_.trys.pop()
							continue
					}
					op = body.call(thisArg, _)
				} catch (e) {
					op = [6, e]
					y = 0
				} finally {
					f = t = 0
				}
			if (op[0] & 5) throw op[1]
			return { value: op[0] ? op[1] : void 0, done: true }
		}
	}
exports.__esModule = true
exports.Fence = void 0
var Fence = /** @class */ (function () {
	function Fence() {
		/**
		 * task list
		 */
		this.tasks = []
		/**
		 * result for each task
		 */
		this.results = []
		/**
		 * error for each task
		 */
		this.errors = []
		this.state = 'pending'
		this.fired = false
	}
	Fence.prototype.addTask = function (task) {
		var _this = this
		if (this.fired) {
			throw new Error('This fence has been fired. Can not add more task to it.')
		}
		var pointer = this.tasks.length
		var wrappedTask = function () {
			return __awaiter(_this, void 0, void 0, function () {
				var result, error_1
				return __generator(this, function (_a) {
					switch (_a.label) {
						case 0:
							_a.trys.push([0, 2, , 3])
							return [4 /*yield*/, task()]
						case 1:
							result = _a.sent()
							this.results[pointer] = result
							return [3 /*break*/, 3]
						case 2:
							error_1 = _a.sent()
							this.errors[pointer] = error_1
							return [3 /*break*/, 3]
						case 3:
							return [2 /*return*/]
					}
				})
			})
		}
		this.tasks.push(wrappedTask)
		return pointer
	}
	Fence.prototype.addTaskPromsise = function (task) {
		var _this = this
		if (this.fired) {
			throw new Error('This fence has been fired. Can not add more task to it.')
		}
		var pointer = this.tasks.length
		var wrappedTask = function () {
			return __awaiter(_this, void 0, void 0, function () {
				var promise, result, error_2
				return __generator(this, function (_a) {
					switch (_a.label) {
						case 0:
							_a.trys.push([0, 2, , 3])
							promise = new Promise(function (resolve, reject) {
								task(resolve, reject)
							})
							return [4 /*yield*/, promise]
						case 1:
							result = _a.sent()
							this.results[pointer] = result
							return [3 /*break*/, 3]
						case 2:
							error_2 = _a.sent()
							this.errors[pointer] = error_2
							return [3 /*break*/, 3]
						case 3:
							return [2 /*return*/]
					}
				})
			})
		}
		this.tasks.push(wrappedTask)
		return pointer
	}
	/**
	 * @todo error handling
	 */
	Fence.prototype.done = function (needsAll) {
		if (needsAll === void 0) {
			needsAll = false
		}
		return __awaiter(this, void 0, void 0, function () {
			var error_3
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						if (this.fired) {
							throw new Error('This fence has been fired. Can not fire again.')
						}
						this.fired = true
						_a.label = 1
					case 1:
						_a.trys.push([1, 3, , 4])
						return [
							4 /*yield*/,
							Promise.all(
								this.tasks.map(function (f) {
									return f()
								})
							),
						]
					case 2:
						_a.sent()
						this.state = 'fulfilled'
						return [3 /*break*/, 4]
					case 3:
						error_3 = _a.sent()
						return [3 /*break*/, 4]
					case 4:
						return [2 /*return*/, this.results]
				}
			})
		})
	}
	Fence.prototype.getResult = function (taskID) {
		if (this.state === 'pending' || this.state === 'rejected') {
			throw new Error('Results not ready')
		}
		return this.results[taskID]
	}
	Fence.prototype.getError = function (taskID) {
		if (this.state === 'pending') {
			throw new Error('Errors not ready')
		}
		return this.errors[taskID]
	}
	return Fence
})()
exports.Fence = Fence
