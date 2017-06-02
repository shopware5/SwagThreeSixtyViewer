Ext.define('Shopware.apps.SwagThreeSixty.view.main.Window', {
    extend: 'Enlight.app.Window',
    alias: 'widget.three-sixty-main-window',
    width: '90%',
    height: '90%',
    layout: 'fit',

    title: 'Shopware 3D Viewer Beta',

    initComponent: function() {
        var me = this;

        me.items = [{
            xtype: 'swag-three-sixty-list-grid'
        }];

        me.callParent(arguments);
    }
});