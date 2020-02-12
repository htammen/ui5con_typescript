sap.ui.define(['sap/ui/core/util/MockServer', 'sap/base/Log'], function(
	MockServer: typeof sap.ui.core.util.MockServer,
	Log: any
) {
	'use strict'

	interface Request {
		method: string
		path: string | RegExp
		response: any
	}

	class UHDAppMockServer {
		_oLogger: any
		_prefix = 'de/tammenit/UHDApp'
		_userListModel: sap.ui.model.json.JSONModel
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init(): void {
			this._oLogger = Log.getLogger('de.tammenit.UHDApp.mockserver')
			const aRequests = []
			aRequests.push(this.createGetUserList())
			aRequests.push(this.createGetUserData())

			const oMockServer = new MockServer()
			oMockServer.setRequests(aRequests)

			// start
			oMockServer.start()

			Log.info('Running the app with mock data')
		}

		/**
		 * Lädt die userliste aus einer JSON-Datei
		 */
		private loadUserList(): void {
			//@ts-ignore
			const pfad = sap.ui.loader._.getResourcePath(`${this._prefix}/model/getUserList.json`)
			const jsonModel = new sap.ui.model.json.JSONModel({}, false)
			jsonModel.loadData(pfad, null, false)
			this._userListModel = jsonModel
		}

		private createGetUserList(): Request {
			const that = this
			return {
				method: 'GET',
				path: new RegExp('./GetUserList\\?.*'),
				response: (xhr): void => {
					const query: string = xhr.url.split('?')[1]
					const params: Array<string> = query.split('&')

					const input = params[0].split('=')[1]
					if (!that._userListModel) {
						// load the application data from local json file
						that.loadUserList()
					}
					//@ts-ignore
					let filteredUserList: Array<de.tammenit.UHDApp.data.UserData> = that._userListModel.getProperty('/users')
					if (filteredUserList) {
						filteredUserList = filteredUserList.filter(obj => {
							return obj.userId.indexOf(input) > -1 || obj.lastName.indexOf(input) > -1 || obj.email.indexOf(input) > -1
						})
						if (filteredUserList.length > 0) {
							xhr.respondJSON(200, null, filteredUserList)
						} else {
							xhr.respondJSON(200, null, { result: 'error', msg: 'A user could not be found' })
						}
					} else {
						xhr.respondJSON(200, null, {
							result: 'error',
							msg: 'Does the mockdata file exist? I couldn`t read any user data',
						})
					}
				},
			}
		}

		/*
		 */
		private createGetUserData(): Request {
			const that = this
			return {
				method: 'GET',
				path: new RegExp('./GetUHDUserData\\?.*'),
				response: xhr => {
					const query: string = xhr.url.split('?')[1]
					if (query) {
						const params: Array<string> = query.split('&')

						const userId = params[0].split('=')[1]
						if (!that._userListModel) {
							// load the application data from local json file
							that.loadUserList()
						}
						let filteredUserList: Array<de.tammenit.UHDApp.data.UserData> = that._userListModel.getProperty('/users')
						filteredUserList = filteredUserList.filter(obj => {
							return obj.userId === userId
						})
						if (filteredUserList.length === 1) {
							xhr.respondJSON(200, null, that.generateUHDUserData(filteredUserList[0]))
						} else {
							if (filteredUserList.length > 1) {
								xhr.respondJSON(200, null, {
									result: 'error',
									msg: 'There are more than one users with this ID. Is this possible?',
								})
							} else {
								xhr.respondJSON(200, null, { result: 'error', msg: 'Couldn`t find a user with this Id' })
							}
						}
					} else {
						xhr.respondJSON(200, null, { result: 'error', msg: 'No user ID provided' })
					}
				},
			}
		}

		/**
		 * Genereriert Beispiel Output für den Mock-Service getUserData.
		 * Rollen und Request werden mit einem Zufallszahlen-Generator erzeugt.
		 * @param userData
		 */
		private generateUHDUserData(userData: de.tammenit.UHDApp.data.UserData): de.tammenit.UHDApp.data.UHDData {
			const arrAppIds = ['fr2', 'bb4', 'fk5', 'hg3', 'ur9', 'zz0', 'zz2', 'zz3', 'op4', 'pu3']
			const arrRoleIds = ['role1', 'role2', 'role3', 'role4']
			const retValue: de.tammenit.UHDApp.data.UHDData = {}
			retValue.userData = userData

			retValue.openRequests = []
			const reqCount = Math.floor(Math.random() * 8)
			for (let i = 0; i < reqCount; i++) {
				const appId = arrAppIds[Math.floor(Math.random() * 10)]
				const roleId = arrRoleIds[Math.floor(4 * Math.random())]
				retValue.openRequests.push({
					appId: appId,
					appName: `Application ${appId}`,
					appDescription: `Description of application ${appId}`,
					roleId: roleId,
					roleName: `Role ${roleId} Application ${appId}`,
					roleDescription: `Description of role ${roleId} in application ${appId}`,
				})
			}
			retValue.roles = []
			const roleCount = Math.floor(Math.random() * 6)
			for (let i = 0; i < roleCount; i++) {
				const appId = arrAppIds[Math.floor(Math.random() * 10)]
				const roleId = arrRoleIds[Math.floor(4 * Math.random())]
				retValue.roles.push({
					appId: appId,
					appName: `Application  ${appId}`,
					appDescription: `Description of application ${appId}`,
					roleId: roleId,
					roleName: `Role ${roleId} Application ${appId}`,
					roleDescription: `Description of role ${roleId} in application ${appId}`,
				})
			}

			const arrLDAPActive = [true, false]
			const ldapCreated = Math.random() > 0.4999
			let ldapCreatedDate = new Date(0)
			let registrationDate = new Date(0)
			let ldapActive = false
			if (ldapCreated) {
				ldapCreatedDate = this.randomDate()
				ldapActive = arrLDAPActive[Math.floor(2 * Math.random())]
			} else {
				registrationDate = this.randomDate()
			}
			retValue.registration = {
				created: registrationDate,
			}
			retValue.ldap = {
				created: ldapCreatedDate,
				active: ldapActive,
			}
			return retValue
		}

		private randomDate() {
			const startDate = new Date()
			const endDate = new Date()
			startDate.setMonth(startDate.getMonth() - 4)
			return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
		}
	}
	return UHDAppMockServer
})
