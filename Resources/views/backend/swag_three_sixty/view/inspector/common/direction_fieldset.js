Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.common.DirectionFieldset', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.swag-three-sixty-inspector-direction',
    title: 'Direction',
    layout: 'hbox',
    defaults: {
        flex: 1
    },

    initComponent: function() {
        var me = this;

        me.directionXField = Ext.create('Ext.form.field.Number', {
            name: 'directionX',
            supportText: 'X',
            decimalPrecision: 4,
            allowBlank: false
        });

        me.directionYField = Ext.create('Ext.form.field.Number', {
            name: 'directionY',
            supportText: 'Y',
            decimalPrecision: 4,
            allowBlank: false
        });

        me.directionZField = Ext.create('Ext.form.field.Number', {
            name: 'directionZ',
            supportText: 'Z',
            decimalPrecision: 4,
            allowBlank: false
        });

        me.items = [
            me.directionXField,
            me.directionYField,
            me.directionZField
        ];

        me.callParent(arguments);
    }
});