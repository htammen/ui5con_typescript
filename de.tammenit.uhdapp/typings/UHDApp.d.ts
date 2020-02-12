/* eslint-disable @typescript-eslint/no-use-before-define */
declare namespace de {
	namespace tammenit {
		namespace UHDApp {
			export class Component extends sap.ui.core.UIComponent {
				/**
				 * returns the main Model of the application
				 *
				 * @returns {sap.ui.model.json.JSONModel} the main model of the application
				 * @memberof Component
				 */
				public getMainModel(): sap.ui.model.json.JSONModel

				/**
				 * Displays a Message in a StripToaster
				 *
				 * @param {string} msg
				 * @param {sap.ui.core.MessageType} type
				 * @memberof Component
				 */
				public displayMessage(msg: string, type?: sap.ui.core.MessageType): void

				/**
				 * Reads a list of userdata from the backend. This can be displayed e.g. as value help to help the UHD employee
				 * finding a concrete user
				 * The input can either be a userId, a part of a userId, an email or a part of an email. The backend is supposed
				 * to search with "contains"
				 */
				public getUserList(input: data.UserId | data.Email): Promise<Array<data.UserData>>
				/**
				 * Reads data for a single user with all the information a UHD employee should be able to see.
				 * This is some personal information, open application requests, assigned roles and registration/ldap information
				 * @param userId - userid which is used on the backend to find the user
				 * @returns a promise that resolves to a UHDUserData object
				 */
				public getUserData(userId: string): Promise<data.UHDData>
			}

			namespace controller {
				export class BaseController extends sap.ui.core.mvc.Controller {
					/**
					 * Convenience method for accessing the router in every controller of the application.
					 * @public
					 * @returns {sap.ui.core.routing.Router} the router for this component
					 */
					getRouter(): sap.ui.core.routing.Router
					/**
					 * Convenience method for getting the view model by name in every controller of the application.
					 * @public
					 * @param {string} sName the model name
					 * @returns {sap.ui.model.json.JSONModel} the model instance
					 */
					getModel(sName?: string): sap.ui.model.json.JSONModel
					/**
					 * Convenience method for setting the view model in every controller of the application.
					 * @public
					 * @param {sap.ui.model.json.JSONModel} oModel the model instance
					 * @param {string} sName the model name
					 * @returns {sap.ui.mvc.View} the view instance
					 */
					setModel(oModel: sap.ui.model.json.JSONModel, sName: string): void
					/**
					 * Convenience method for getting the resource bundle.
					 * @public
					 * @returns {sap.base.i18n.ResourceBundle} the resourceBundle of the component
					 */
					getResourceBundle(): {
						getText(key: string, aArgs?: Array<string>, bIgnoreKeyFallback?: boolean): string
						setText(value: string): void
					}
					/**
					 * Returns the Name of the current component as defined when creating it
					 * @returns {String} name of the component
					 */
					_getComponentName(): string
					/**
					 * Event handler  for navigating back.
					 * It checks if there is a history entry. If yes, history.go(-1) will happen.
					 * If not, it will replace the current entry of the browser history with the master route.
					 * @public
					 */
					onNavBack(): void
					/**
					 * gets the application main component. Technically its the return value of UIComponent.getOwnerComponent
					 * casted to the concrete class of ...UHDApp.Component
					 *
					 * @returns {de.tammenit.UHDApp.Component}
					 * @memberof BaseController
					 */
					getOwnerAppComponent(): Component
					/**
					 * Displays a Message in a StripToaster. Convinience method that just calls the same named metho
					 * in the OwnerComponent
					 *
					 * @param {string} msg
					 * @param {sap.ui.core.MessageType} type
					 * @memberof Component
					 */
					public displayMessage(msg: string, type: sap.ui.core.MessageType): void
				}
			}

			namespace formatter {
				export class Formatter {
					public formatCreateDate(date: Date): string
				}
			}

			namespace data {
				/** Type alias for userId */
				type UserId = string
				/** Type alias for email address */
				type Email = string

				/**
				 * enum for the status of a request
				 *
				 * @enum {number}
				 */
				enum RequestStatus {
					NOT_ASSIGNED = 0,
					REQUESTED = 1,
					ASSIGNED = 2,
					REJECTED = 3,
					REMOVED = 4,
				}

				/**
				 * Simple JSON result from backend. In some cases we just receive the string
				 * "success", "error" or a message that describes the error in more Detail e.g.
				 * "Data could not be loaded".
				 * The latter case schould only be an exception cause the backend shouldn't deliver
				 * texts but just status codes
				 */
				export interface SimpleJSONResult {
					/** result as string e.g. success or error */
					result: string
					/** a more detailed message that describes the error or the result */
					msg?: string
				}

				/**
				 * Struktur, die eine Rollenbeantragung oder Rollenabmeldung beinhaltet
				 */
				export interface Request {
					/** eindeutige ID der Anwendung */
					appId: string
					/** Anwendungsname */
					appName: string
					/** Anwendungsbeschreibung */
					appDescription: string
					/** eindeutige Rollen-Id */
					roleId: string
					/** Rollenname */
					roleName: string
					/** Rollenbeschreibung */
					roleDescription: string
				}

				/**
				 * Personal data of a user
				 */
				export interface UserData {
					userId: UserId
					title: string
					firstName: string
					lastName: string
					email: Email
					company: string
					location: string
				}

				/**
				 * Date structure for applications that are available for user, admin, ...
				 */
				export interface ApplicationData {
					/** application id */
					appId: string
					/** application name */
					appName: string
					/** application description */
					appDescription: string
				}

				/**
				 * Eine Rolle in einer Anwendung
				 */
				export interface Role {
					/** eindeutige ID der Anwendung */
					appId: string
					/** Anwendungsname */
					appName: string
					/** Anwendungsbeschreibung */
					appDescription: string
					/** eindeutige Rollen-Id */
					roleId: string
					/** Rollenname */
					roleName: string
					/** Rollenbeschreibung */
					roleDescription: string
				}

				/**
				 * Informationen zur Registrierung
				 */
				export interface Registration {
					/** Registrierungsdatum. Dieses wird vom Backend nur gefüllt, wenn der User sich registriert hat, die Registrierung aber noch abgeschlossen wurde.
					 * Der User ist also noch nicht im LDAP angelegt. Ist der User schon im LDAP angelegt, wird hier 1970-01-01T00:00:00.000Z zurückgegeben
					 * Datum incl. Zeit
					 */
					created: Date
				}

				/**
				 * Informationen über den LDAP Status des Users
				 */
				export interface LDAP {
					/** Anlegedatum incl. Zeit der Anlage des Users im LDAP. Ist der User noch nicht im LDAP angelegt, wird 1970-01-01T00:00:00.000Z zurückgegeben. */
					created: Date
					/** ist der User z.Zt. aktiv im LDAP? */
					active: boolean
				}

				/**
				 * The data for a single user read from the backend
				 * Contains personal information, open requests, assigned roles and registration information
				 */
				export interface UHDData {
					/** Personal information about the user */
					userData?: UserData
					/** List of all application requests the user has opened */
					openRequests?: Array<Request>
					/** List of all roles the user is assigned to */
					roles?: Array<Role>
					/** Registration data */
					registration?: Registration
					/** LDAP Status Informationen */
					ldap?: LDAP
				}

				/**
				 * Daten, die im Main Model der Anwendung gehalten werden
				 */
				export interface MainModelData {
					uhdUserData?: UHDData
				}
			}
		}
	}
}

declare namespace sap.ui.base.input {
	namespace event {
		interface Lifechange extends sap.ui.base.Event {
			getSource(): sap.ui.base.EventProvider
			getParameter(param: 'value' | 'escPressed' | 'previousValue'): string | boolean
		}
	}
}
declare namespace sap.m.ListItemBase {
	namespace event {
		interface Press extends sap.ui.base.Event {
			getSource(): sap.ui.base.EventProvider
			// getParameter(param)
		}
	}
}

declare namespace sap.ui.core.routing.target.Event {
	interface Display extends sap.ui.base.Event {
		getSource(): sap.ui.base.EventProvider
		getParameter(param: 'view' | 'control' | 'config' | 'data'): object
	}
}
