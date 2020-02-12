sap.ui.define(
	['sap/uxap/BlockBase'],
	function(BlockBase) {
		'use strict'

		const BlockAssignedRoles = BlockBase.extend('de.tammenit.UHDApp.view.blocks.main.BlockAssignedRoles', {
			metadata: {},

			onToggleCollaborations: function(oEvent) {},
		})
		return BlockAssignedRoles
	},
	true
)
