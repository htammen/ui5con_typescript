sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("de.tammenit.UHDApp.test.integration.arrangements.Startup", {

		iStartMyApp: function () {
			this.iStartMyUIComponent({
				componentConfig: {
					name: "de.tammenit.UHDApp",
					async: true,
					manifest: true
				}
			});
		}

	});
});
