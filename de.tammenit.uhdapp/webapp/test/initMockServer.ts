/** global Promise */
sap.ui.define(['de/tammenit/UHDApp/localService/mockserver'], function(Mockserver) {
	'use strict'

	// initialize the mock server
	const mockserver = new Mockserver()
	mockserver.init()

	// initialize the embedded component on the HTML page
	sap.ui.require(['sap/ui/core/ComponentSupport'])
})
