import {CookieEvent} from "./cookie_event.js"
import {CookieOptions} from "./cookie_options.js"

# Provides access to the [HTTP Cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).
export class CookieStore extends EventTarget

	# Creates a new cookie store.
	constructor: (options = {}) ->
		super()

		# The default cookie options.
		@defaults = new CookieOptions options.defaults

		# A string prefixed to every key so that it is unique globally in the whole cookie store.
		@_keyPrefix = options.keyPrefix or ""

	# The map of all cookies.
	Object.defineProperty @, "all",
		get: ->
			map = new Map
			if document.cookie then for item from document.cookie.split ";"
				parts = item.trimStart().split "="
				map.set parts[0], decodeURIComponent parts[1..].join("=") if parts.length >= 2
			map

	# The keys of this cookie store.
	Object.defineProperty @prototype, "keys",
		get: ->
			keys = Array.from CookieStore.all.keys()
			{length} = @_keyPrefix
			new Set if length then keys.filter((key) => key.startsWith @_keyPrefix).map((key) -> key[length..]) else keys

	# The number of entries in this cookie store.
	Object.defineProperty @prototype, "length",
		get: -> @keys.size

	# Returns a new iterator that allows iterating the entries of this cookie store.
	[Symbol.iterator]: ->
		yield [key, @get key] for key from @keys
		return

	# Removes all entries from this cookie store.
	clear: (options = {}) -> @delete key, options for key from @keys

	# Removes the value associated with the specified key.
	delete: (key, options = {}) ->
		oldValue = @get key

		cookieOptions = @_getOptions options
		cookieOptions.expires = new Date 0
		cookieOptions.maxAge = 0
		document.cookie = "#{@_buildKey key}=; #{cookieOptions}"

		@dispatchEvent new CookieEvent key, oldValue
		oldValue

	# Gets the value associated to the specified key.
	get: (key) -> CookieStore.all.get(@_buildKey key) or null

	# Gets the deserialized value associated with the specified key.
	getObject: (key) -> try JSON.parse(@get(key) ? "") catch then null

	# Gets a value indicating whether this cookie store contains the specified key.
	has: (key) -> CookieStore.all.has @_buildKey key

	# Registers a function that will be invoked whenever the "change" event is triggered.
	onChange: (listener) ->
		@addEventListener CookieEvent.type, listener, passive: yes
		this # coffeelint: disable-line = no_this

	# Associates a given value with the specified key.
	set: (key, value, options = {}) ->
		throw Error "Invalid cookie name." if not key or key.includes "=" or key.includes ";"

		cookie = "#{@_buildKey key}=#{encodeURIComponent value}"
		cookieOptions = @_getOptions(options).toString()
		cookie += "; #{cookieOptions}" if cookieOptions

		oldValue = @get key
		document.cookie = cookie
		@dispatchEvent new CookieEvent key, oldValue, value
		this # coffeelint: disable-line = no_this

	# Serializes and associates a given value with the specified key.
	setObject: (key, value, options = {}) -> @set key, JSON.stringify(value), options

	# Returns a JSON representation of this object.
	toJSON: -> Array.from @

	# Returns a string representation of this object.
	toString: ->
		if @_keyPrefix then Array.from(@).map(([key, value]) -> "#{key}=#{encodeURIComponent value}").join "; "
		else document.cookie

	# Builds a normalized cookie key from the given key.
	_buildKey: (key) -> "#{@_keyPrefix}#{key}"

	# Merges the default cookie options with the specified ones.
	_getOptions: (options) -> new CookieOptions
		domain: options.domain ? @defaults.domain
		expires: options.expires ? @defaults.expires
		maxAge: options.maxAge ? @defaults.maxAge
		path: options.path ? @defaults.path
		sameSite: options.sameSite ? @defaults.sameSite
		secure: options.secure ? @defaults.secure
