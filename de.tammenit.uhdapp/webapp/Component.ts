sap.ui.define(
	[
		'sap/ui/core/UIComponent',
		'sap/ui/Device',
		'sap/ui/model/json/JSONModel',
		'de/tammenit/UHDApp/model/models',
		'sap/base/Log',
		'sap/ui/core/Popup',
		'de/tammenit/UHDApp/controls/StripToaster',
	],
	function(
		UIComponent: typeof sap.ui.core.UIComponent,
		Device: typeof sap.ui.Device,
		JSONModel: typeof sap.ui.model.json.JSONModel,
		models,
		Log,
		Popup: typeof sap.ui.core.Popup,
		StripToaster
	) {
		'use strict'

		/**
		 * Component Controller
		 */
		class Component extends UIComponent {
			private _logger
			private _myTestTSCVar
			private mainModel: sap.ui.model.json.JSONModel

			constructor(mSettings: object) {
				// it's important to call the extend method here. It creates metadata that is used in UI5 apps via
				// the method getMetadata. Hence we also assign this method to the prototype of our class.
				const fnClass = UIComponent.extend('de.tammenit.UHDApp.Component', {
					metadata: {
						manifest: 'json',
					},
				})
				Component.prototype.getMetadata = fnClass.prototype.getMetadata

				super('de.tammenit.UHDApp.Component', mSettings)
			}

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * @public
			 * @override
			 */
			init(): void {
				// call the base component's init function
				// eslint-disable-next-line prefer-rest-params
				UIComponent.prototype.init.apply(this, arguments)

				this._logger = Log.getLogger('de.tammenit.UHDApp.Component')
				// enable routing
				this.getRouter().initialize()

				// set the device model
				this.setModel(models.createDeviceModel(), 'device')

				// initialize the main model
				this.mainModel = new JSONModel({}, false)

				// are there startup parameters?
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				this._analyseStartupParams().then(function(): void {}.bind(this))
			}

			/**
			 * checks if startup parameters were transmitted and sets them in model appParams
			 */
			private _analyseStartupParams(): Promise<void> {
				return new Promise<void>((resolve /*, reject */) => {
					const appParamsModel = new JSONModel({}, false)
					this.setModel(appParamsModel, 'appParams')

					const oComponentData = this.getComponentData() as {
						startupParameters: { webResourceURI: string; backendContextURI: string }
					}
					// if parameter direction was set on url we save this in a temporary model, otherwise we set PUSH as default
					if (oComponentData && oComponentData.startupParameters) {
						if (oComponentData.startupParameters.webResourceURI) {
							appParamsModel.setProperty('/webResourceURI', oComponentData.startupParameters.webResourceURI)
						}
						if (oComponentData.startupParameters.backendContextURI) {
							appParamsModel.setProperty('/backendContextURI', oComponentData.startupParameters.backendContextURI)
						}
						this._logger.info(
							'app was started with parameters ' + JSON.stringify(oComponentData.startupParameters || {})
						)
					}
					resolve()
				})
			}

			/**
			 * Displays a Message in a StripToaster
			 *
			 * @param {string} msg
			 * @param {sap.ui.core.MessageType} type
			 * @memberof Component
			 */
			public displayMessage(msg: string, type?: sap.ui.core.MessageType, timeout?: number): void {
				// get string from resourceBundle. If not available text = msg
				const resBundle = (this.getModel('i18n') as sap.ui.model.resource.ResourceModel).getResourceBundle()
				let text = resBundle.getText(msg)
				text = text || msg
				type = type || sap.ui.core.MessageType.Error
				// set timeout to given value. If no value is given set to 10 seconds or eternal in case of error message
				timeout = timeout || (type === sap.ui.core.MessageType.Error ? -1 : 10000)
				StripToaster.notify({
					//@ts-ignore
					text: text,
					timeOut: timeout,
					//@ts-ignore
					position: Popup.Dock.EndTop,
					type: type,
					offset: '-20 50',
				})
			}

			/**
			 * returns the main Model of the application
			 *
			 * @returns {sap.ui.model.json.JSONModel} the main model of the application
			 * @memberof Component
			 */
			public getMainModel(): sap.ui.model.json.JSONModel {
				return this.mainModel
			}

			/**
			 * gibt das Model mit den Startparametern der Anwendung zurück.
			 * Die Daten des Models entsprechen der Struktur de.tammenit.SuperAdminApp.data.AppParamsModelData
			 *
			 * @returns {sap.ui.model.json.JSONModel} das appParams Model der Anwendung
			 * @memberof Component
			 */
			public getAppParamsModel(): sap.ui.model.json.JSONModel {
				return this.getModel('appParams') as sap.ui.model.json.JSONModel
			}

			/**
			 * Convinience Methode, die den Backend-Context aus dem appParams Model zurückgibt
			 * @returns {string}
			 * @memberof Component
			 */
			public getBackendContext(): string {
				return this.getAppParamsModel().getProperty('/backendContextURI')
			}

			/**
			 * Liest eine Liste von UserDaten aus dem Backend, die als Wertehilfe zum Finden eines konkreten
			 * Users verwendet werden kann.
			 * Der input kann entweder ein Teil einer userId oder einer email-Adresse sein. Das Backend sollte in
			 * beiden Felder mit contains suchen
			 * @param {string} input
			 * @returns {Promise} ein Promise, das ein Array von Userdaten enthält.
			 */
			public getUserList(input: string): Promise<Array<de.tammenit.UHDApp.data.UserData>> {
				return new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.open('GET', `${this.getBackendContext()}GetUserList?filter=${input}`)
					xhr.onload = function(): void {
						if (xhr.status === 200) {
							const rawData: any = JSON.parse(xhr.responseText)
							if (rawData && rawData.result && rawData.result === 'error') {
								if (rawData.msg) {
									this._logger.error(rawData.msg)
									reject(rawData.msg)
								}
							} else {
								let data: Array<de.tammenit.UHDApp.data.UserData> = JSON.parse(xhr.responseText)
								if (!Array.isArray(data)) {
									data = []
								}

								resolve(data)
							}
						} else {
							this._logger.error(JSON.stringify(xhr.responseText))
							reject(xhr.responseText)
						}
					}.bind(this)
					xhr.onerror = function(oEvent): void {
						reject('Error')
					}
					xhr.send()
				})
			}

			/**
			 * Liest einen User für den UHD komplett mit allen persönlichen Daten, offenen Requests, Rollen sowie Registrierungsinformationen
			 * aus dem Backend aus.
			 * @param userId - Eine Benutzer-Id, mit der das Backend den Benutzer finden kann
			 * @returns Ein Promise, das zu einem UHDUserData ojbect resolved
			 */
			public getUserData(userId: string): Promise<de.tammenit.UHDApp.data.UHDData> {
				return new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.open('GET', `${this.getBackendContext()}GetUHDUserData?userId=${userId}`)
					xhr.onload = function() {
						if (xhr.status === 200) {
							const rawData: any = JSON.parse(xhr.responseText)
							if (rawData && rawData.result && rawData.result === 'error') {
								if (rawData.msg) {
									this._logger.error(rawData.msg)
									reject(rawData.msg)
								}
							} else {
								const data = rawData as de.tammenit.UHDApp.data.UHDData
								if (data.ldap.created && typeof data.ldap.created === 'string') {
									data.ldap.created = new Date(data.ldap.created)
								}
								if (data.registration.created && typeof data.registration.created === 'string') {
									data.registration.created = new Date(data.registration.created)
								}

								resolve(data)
							}
						} else {
							this._logger.error(JSON.stringify(xhr))
							reject(xhr.statusText)
						}
					}.bind(this)
					xhr.onerror = function(): void {
						reject('Error')
					}
					xhr.send()
				})
			}
		}

		return Component
	}
)
