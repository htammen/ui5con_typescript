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

		enum LinkTargets {
			HOMEPAGE = 'homepage',
		}

		class Main extends BaseController {
			formatter: de.tammenit.UHDApp.formatter.Formatter

			constructor() {
				// it's important to call the extend method here. It creates metadata that is used in UI5 apps via
				// the method getMetadata. Hence we also assign this method to the prototype of our class.
				const fnClass = BaseController.extend('de.tammenit.UHDApp.controller.Main', {})
				Main.prototype.getMetadata = fnClass.prototype.getMetadata

				super('de.tammenit.UHDApp.controller.Main')
			}

			public onInit(): void {
				this.formatter = new Formatter()

				this.getView().setModel(
					new JSONModel(
						{
							breadcrumbs: {
								currentText: this.getResourceBundle().getText('breadcrumb.page.main.title'),
								links: [
									{
										text: this.getResourceBundle().getText('page.homepage'),
										linkTarget: LinkTargets.HOMEPAGE,
									},
								],
							},
							showObjectPage: false,
							userList: [],
						},
						false
					),
					'viewModel'
				)
				// this.getView().setModel(this.getOwnerAppComponent().getMainModel())
				this.getView().setModel(this.getOwnerAppComponent().getMainModel())

				const oRouter = this.getRouter()
				const oTarget = oRouter.getTarget('TargetMain') as sap.ui.core.routing.Target
				oTarget.attachDisplay(this._handleDisplay.bind(this))
			}

			/**
			 * This eventhandler retrieves data that was sent from the calling view. This data is
			 * e.g. the target from which this view was caled, the email address and the current appId.
			 * @param oEvent
			 */
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			private _handleDisplay(oEvent: sap.ui.core.routing.target.Event.Display): void {
				this.getView().bindObject({ path: '/' })
				this.byId('idSearchField').focus({ preventScroll: false })
			}

			onAfterRendering(): void {
				this.byId('idSearchField').focus({ preventScroll: false })
			}

			/**
			 * Eventhandler für das Press Event der Breadcrumb links
			 * Jeder breadcrumb link hat eine custom property linkTarget, die hier ausgewertet wird, daraufhin
			 * navigieren zu können.
			 * @param oEvent
			 */
			public onBreadcrumbLinkPress(oEvent: sap.ui.base.Event): void {
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				const linkTarget: string = (oEvent.getSource() as sap.m.Link).data('linkTarget')
				switch (linkTarget) {
					case LinkTargets.HOMEPAGE:
						window.location.href = 'https://service.myapp.de'
						break
				}
			}

			public async onSuggest(oEvent: sap.ui.base.Event): Promise<void> {
				const value: string = oEvent.getParameter('suggestValue')
				try {
					// yyy
					const userList = await this.getOwnerAppComponent().getUserList(value)
					this.getModel('viewModel').setProperty('/userList', userList)
					;(this.byId('idSearchField') as sap.m.SearchField).suggest(true)
				} catch (err) {
					this.getOwnerAppComponent().displayMessage(err)
					this.getModel('viewModel').setProperty('/showObjectPage', false)
				}
			}

			public async onSearch(oEvent: sap.ui.base.Event): Promise<void> {
				const key: string = oEvent.getParameter('query')
				if (key && key !== '') {
					try {
						// zzz
						//const uhdUserData = await this.getOwnerAppComponent().getUserData(key)
						const uhdUserData = await this.getOwnerAppComponent().getUserData(key)
						this.getOwnerAppComponent()
							.getMainModel()
							.setProperty('/userData', uhdUserData.userData)
						this.getOwnerAppComponent()
							.getMainModel()
							.setProperty('/openRequests', uhdUserData.openRequests)
						this.getOwnerAppComponent()
							.getMainModel()
							.setProperty('/roles', uhdUserData.roles)
						this.getOwnerAppComponent()
							.getMainModel()
							.setProperty('/ldap', uhdUserData.ldap)
						this.getOwnerAppComponent()
							.getMainModel()
							.setProperty('/registration', uhdUserData.registration)
						this.getModel('viewModel').setProperty('/showObjectPage', true)
					} catch (err) {
						this.getOwnerAppComponent().displayMessage(err)
					}
				}
			}

			public formatCreateDate(date: Date): string {
				return this.formatter.formatCreateDate(date)
			}
		}

		return Main
	}
)
