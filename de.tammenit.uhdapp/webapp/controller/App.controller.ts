sap.ui.define(['de/tammenit/UHDApp/controller/BaseController'], function(
	Controller: typeof de.tammenit.UHDApp.controller.BaseController
) {
	'use strict'

	class App extends Controller {
		constructor() {
			// it's important to call the extend method here. It creates metadata that is used in UI5 apps via
			// the method getMetadata. Hence we also assign this method to the prototype of our class.
			const fnClass = Controller.extend('de.tammenit.UHDApp.controller.App', {})
			App.prototype.getMetadata = fnClass.prototype.getMetadata

			super('de.tammenit.UHDApp.controller.App')
		}

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		public onInit(): void {}

		onAfterRendering(): void {
			const resourceBundle = (this.getOwnerComponent().getModel(
				'i18n'
			) as sap.ui.model.resource.ResourceModel).getResourceBundle()
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const text: string = resourceBundle.getText('title')
		}
	}

	return App
})
