Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.common.PositionFieldset', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.swag-three-sixty-inspector-position',
    title: 'Position',
    layout: 'hbox',
    defaults: {
        flex: 1
    },

    initComponent: function() {
        var me = this;

        me.positionXField = Ext.create('Ext.form.field.Number', {
            name: 'positionX',
            supportText: 'X',
            decimalPrecision: 4,
            allowBlank: false
        });

        me.positionYField = Ext.create('Ext.form.field.Number', {
            name: 'positionY',
            supportText: 'Y',
            decimalPrecision: 4,
            allowBlank: false
        });

        me.positionZField = Ext.create('Ext.form.field.Number', {
            name: 'positionZ',
            supportText: 'Z',
            decimalPrecision: 4,
            allowBlank: false
        });

        me.items = [
            me.positionXField,
            me.positionYField,
            me.positionZField
        ];

        me.callParent(arguments);
    }
});