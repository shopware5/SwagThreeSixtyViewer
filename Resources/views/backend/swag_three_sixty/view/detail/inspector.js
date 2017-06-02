Ext.define('Shopware.apps.SwagThreeSixty.view.detail.Inspector', {
    extend: 'Ext.panel.Panel',
    region: 'east',
    layout: 'card',
    title: 'Inspector',
    alias: 'widget.swag-three-sixty-detail-inspector',
    autoScroll: true,
    bodyStyle: {
        background: '#ebedef'
    },
    width: 400,
    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'container',
            type: 'empty',
            padding: 15,
            items: [{
                xtype: 'fieldset',
                title: 'Description',
                style: {
                    color: '#8698A3',
                    fontStyle: 'italic'
                },
                html: 'Please select an item in the hierarchy to edit the settings'
            }]
        },{
            xtype: 'swag-three-sixty-inspector-scene'
        }, {
            xtype: 'swag-three-sixty-inspector-directional-light'
        }, {
            xtype: 'swag-three-sixty-inspector-point-light'
        }, {
            xtype: 'swag-three-sixty-inspector-spot-light'
        }, {
            xtype: 'swag-three-sixty-inspector-hemispheric-light'
        }, {
            xtype: 'swag-three-sixty-inspector-camera'
        }, {
            xtype: 'swag-three-sixty-inspector-box'
        }, {
            xtype: 'swag-three-sixty-inspector-ground'
        }, {
            xtype: 'swag-three-sixty-inspector-model'
        }, {
            xtype: 'swag-three-sixty-inspector-cylinder'
        }];

        me.callParent();
    }
});