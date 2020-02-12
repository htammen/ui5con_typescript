sap.ui.define(
	[
		'de/tammenit/UHDApp/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/ui/core/format/DateFormat',
		'sap/ui/core/Fragment',
		'de/tammenit/UHDApp/formatter/formatter',
	],
	function(
		BaseController: typeof de.tammenit.UHDApp.controller.BaseController,
		JSONModel: typeof sap.ui.model.json.JSONModel,
		DateFormat: typeof sap.ui.core.format.DateFormat,
		Fragment: typeof sap.ui.core.Fragment,
		Formatter: typeof de.tammenit.UHDApp.formatter.Formatter
	) {
		'use strict'

		class BlockLDAP extends BaseController {
			private model: sap.ui.model.json.JSONModel
			private formatter: de.tammenit.UHDApp.formatter.Formatter

			constructor() {
				// it's important to call the extend method here. It creates metadata that is used in UI5 apps via
				// the method getMetadata. Hence we also assign this method to the prototype of our class.
				const fnClass = BaseController.extend('de.tammenit.UHDApp.controller.BlockLDAP', {})
				BlockLDAP.prototype.getMetadata = fnClass.prototype.getMetadata

				super('de.tammenit.UHDApp.controller.BlockLDAP')
			}

			public onInit(): void {
				this.formatter = new Formatter()
				// @ts-ignore
				this.getView().setModel(this.getOwnerComponent().getMainModel())
				this.getView().bindObject({ path: '/ldap' })
			}

			public formatCreateDate(date: Date): string {
				return this.formatter.formatCreateDate(date)
			}
		}

		return BlockLDAP
	}
)
