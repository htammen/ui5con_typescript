sap.ui.define(['sap/ui/core/format/DateFormat', 'sap/base/Log'], function(
	DateFormat: typeof sap.ui.core.format.DateFormat,
	Log: any
) {
	'use strict'

	class Formatter {
		public constructor() {}

		public formatCreateDate(date: Date): string {
			if (date) {
				if (date.getTime() === new Date(0).getTime()) {
					return '----'
				} else {
					return DateFormat.getDateTimeInstance().format(date, false)
				}
			} else {
				return ''
			}
		}
	}

	return Formatter
})
