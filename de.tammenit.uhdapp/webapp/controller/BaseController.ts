sap.ui.define(
	[
		'sap/ui/core/mvc/Controller',
		'sap/ui/core/routing/History',
		'de/tammenit/UHDApp/Component',
		'sap/ui/model/json/JSONModel',
	],
	function(
		Controller: typeof sap.ui.core.mvc.Controller,
		History: typeof sap.ui.core.routing.History,
		Component: typeof de.tammenit.UHDApp.Component,
		JSONModel: typeof sap.ui.model.json.JSONModel
	) {
		'use strict'

		class BaseController extends Controller {
			private model: sap.ui.model.json.JSONModel

			constructor() {
				// it's important to call the extend method here. It creates metadata that is used in UI5 apps via
				// the method getMetadata. Hence we also assign this method to the prototype of our class.
				const fnClass = Controller.extend('de.tammenit.UHDApp.controller.BaseController', {})
				BaseController.prototype.getMetadata = fnClass.prototype.getMetadata

				super('de.tammenit.UHDApp.controller.BaseController')
			}

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			public onInit(): void {}

			public getOwnerAppComponent(): de.tammenit.UHDApp.Component {
				// this double cast is weired but is documented here: https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const comp = (this.getOwnerComponent() as any) as de.tammenit.UHDApp.Component
				return comp
			}

			/**
			 * get the Router for this view
			 *
			 * @returns {*}
			 * @memberof BaseController
			 */
			getRouter(): sap.ui.core.routing.Router {
				return Component.getRouterFor(this)
			}

			getModel(sName?: string): sap.ui.model.json.JSONModel {
				if (sName) {
					return this.getView().getModel(sName) as sap.ui.model.json.JSONModel
				} else {
					return this.getView().getModel() as sap.ui.model.json.JSONModel
				}
			}

			getResourceBundle(): { getText(value: string): string; setText(value: string): void } {
				return (this.getOwnerAppComponent().getModel('i18n') as sap.ui.model.resource.ResourceModel).getResourceBundle()
			}

			/**
			 * Displays a Message in a StripToaster. Convinience method that just calls the same named metho
			 * in the OwnerComponent
			 *
			 * @param {string} msg
			 * @param {sap.ui.core.MessageType} type
			 * @memberof Component
			 */
			public displayMessage(msg: string, type: sap.ui.core.MessageType): void {
				this.getOwnerAppComponent().displayMessage(msg, type)
			}

			onNavBack(): void {
				const oHistory = History.getInstance()
				const sPreviousHash = oHistory.getPreviousHash()

				if (sPreviousHash !== undefined) {
					window.history.go(-1)
				} else {
					this.getRouter().navTo('RouteMain', {}, true /*no history*/)
				}
			}

			/**
			 * Formatter für den Titel einer Tabelle. Der Formatter ermittelt die Anzahl Einträge in der Tabelle
			 * @param list Liste der Einträge in der Tabelle
			 */
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			private formatTableCount(list: Array<any>): number {
				if (list) {
					return list.length
				} else {
					return 0
				}
			}
		}

		return BaseController
	}
)
