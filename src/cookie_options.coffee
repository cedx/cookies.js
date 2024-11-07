# Defines the attributes of a HTTP cookie.
export class CookieOptions

	# Creates new cookie options.
	constructor: (options = {}) ->

		# The domain for which the cookie is valid.
		@domain = options.domain ? ""

		# The expiration date and time for the cookie.
		@expires = options.expires ? null

		# The maximum duration, in seconds, until the cookie expires.
		@maxAge = options.maxAge ? (-1)

		# The path to which the cookie applies.
		@path = options.path ? ""

		# The cross-site requests policy.
		@sameSite = options.sameSite ? null

		# Value indicating whether to transmit the cookie over HTTPS only.
		@secure = options.secure ? no

	# Returns a string representation of this object.
	toString: ->
		value = []
		value.push "domain=#{@domain}" if @domain
		value.push "expires=#{@expires.toUTCString()}" if @expires?
		value.push "max-age=#{@maxAge}" if @maxAge >= 0
		value.push "path=#{@path}" if @path
		value.push "samesite=#{@sameSite}" if @sameSite?
		value.push "secure" if @secure
		value.join "; "
