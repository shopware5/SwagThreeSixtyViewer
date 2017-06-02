Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.common.RotationFieldset', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.swag-three-sixty-inspector-rotation',
    title: 'Rotation',
    layout: 'hbox',
    defaults: {
        flex: 1
    },

    initComponent: function() {
        var me = this;

        me.rotationXField = Ext.create('Ext.form.field.Number', {
            name: 'rotationX',
            decimalPrecision: 4,
            supportText: 'X',
            allowBlank: false
        });

        me.rotationYField = Ext.create('Ext.form.field.Number', {
            name: 'rotationY',
            decimalPrecision: 4,
            supportText: 'Y',
            allowBlank: false
        });

        me.rotationZField = Ext.create('Ext.form.field.Number', {
            name: 'rotationZ',
            decimalPrecision: 4,
            supportText: 'Z',
            allowBlank: false
        });

        me.items = [
            me.rotationXField,
            me.rotationYField,
            me.rotationZField
        ];

        me.callParent(arguments);
    }
});