Ext.define('Shopware.apps.SwagThreeSixty.view.detail.Window', {
    extend: 'Enlight.app.Window',
    alias: 'widget.swag-three-sixty-detail-window',
    layout: 'border',
    width: '90%',
    height: '90%',
    maximizable: true,

    initComponent: function() {
        var me = this;

        me.title = 'Edit 3D scene - ' + me.record.get('label');

        me.items = [{
            xtype: 'tabpanel',
            region: 'west',
            items: [{
                xtype: 'swag-three-sixty-detail-hierarchy',
                record: me.record,
                hierarchyStore: me.hierarchyStore
            }]
        }, {
            xtype: 'tabpanel',
            region: 'east',
            items: [{
                xtype: 'swag-three-sixty-detail-inspector'
            }]
        }, {
            xtype: 'tabpanel',
            region: 'center',
            items: [{
                xtype: 'swag-three-sixty-detail-viewer'
            }]
        }];

        me.callParent();
    }
});