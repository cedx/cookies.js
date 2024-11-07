# An event dispatched when the cookie store has been changed.
export class CookieEvent extends Event

	# The event type.
	@type = "cookie:change"

	# Creates a new storage event.
	constructor: (key, oldValue = null, newValue = null) ->
		super CookieEvent.type

		# The changed key.
		@key = key

		# The new value.
		@newValue = newValue

		# The original value.
		@oldValue = oldValue
