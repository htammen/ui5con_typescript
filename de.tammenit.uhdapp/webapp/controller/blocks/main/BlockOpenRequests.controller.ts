sap.ui.define(
	[
		'de/tammenit/UHDApp/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/ui/core/format/DateFormat',
		'sap/ui/core/Fragment',
	],
	function(
		BaseController: typeof de.tammenit.UHDApp.controller.BaseController,
		JSONModel: typeof sap.ui.model.json.JSONModel,
		DateFormat: typeof sap.ui.core.format.DateFormat,
		Fragment: typeof sap.ui.core.Fragment
	) {
		'use strict'

		class BlockOpenRequests extends BaseController {
			private model: sap.ui.model.json.JSONModel

			constructor() {
				// it's important to call the extend method here. It creates metadata that is used in UI5 apps via
				// the method getMetadata. Hence we also assign this method to the prototype of our class.
				const fnClass = BaseController.extend('de.tammenit.UHDApp.controller.BlockOpenRequests', {})
				BlockOpenRequests.prototype.getMetadata = fnClass.prototype.getMetadata

				super('de.tammenit.UHDApp.controller.BlockOpenRequests')
			}

			public onInit(): void {
				// @ts-ignore
				this.getView().setModel(this.getOwnerComponent().getMainModel())
				this.getView().bindObject({ path: '/openRequests' })
			}

			/**
			 * Grouping Funktion. Die Rollentabelle wollen wir nach der appId gruppieren
			 * @param oCtx
			 */
			getGroup(oCtx): string {
				return oCtx.getProperty('appId')
			}
		}

		return BlockOpenRequests
	}
)
