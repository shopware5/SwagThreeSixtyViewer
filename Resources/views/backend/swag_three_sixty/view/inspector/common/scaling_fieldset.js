Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.common.ScalingFieldset', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.swag-three-sixty-inspector-scaling',
    title: 'Scaling',
    layout: 'hbox',
    defaults: {
        flex: 1
    },

    initComponent: function() {
        var me = this;

        me.scalinngXField = Ext.create('Ext.form.field.Number', {
            name: 'scalingX',
            decimalPrecision: 4,
            allowBlank: false,
            supportText: 'X'
        });

        me.scalinngYField = Ext.create('Ext.form.field.Number', {
            name: 'scalingY',
            decimalPrecision: 4,
            allowBlank: false,
            supportText: 'Y'
        });

        me.scalinngZField = Ext.create('Ext.form.field.Number', {
            name: 'scalingZ',
            decimalPrecision: 4,
            allowBlank: false,
            supportText: 'Z'
        });

        me.items = [
            me.scalinngXField,
            me.scalinngYField,
            me.scalinngZField
        ];

        me.callParent(arguments);
    }
});