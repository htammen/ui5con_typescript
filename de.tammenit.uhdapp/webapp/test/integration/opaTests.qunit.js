/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"de/tammenit/UHDApp/test/integration/BasicJourney"
	], function() {
		QUnit.start();
	});
});
