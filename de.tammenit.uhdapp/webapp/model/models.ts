sap.ui.define(['sap/ui/model/json/JSONModel', 'sap/ui/Device'], function(
	JSONModel: typeof sap.ui.model.json.JSONModel,
	Device: typeof sap.ui.Device
) {
	'use strict'

	return {
		createDeviceModel: function() {
			const oModel = new JSONModel(Device, false)
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay)
			return oModel
		},
	}
})
