Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.Ground', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-ground',
    type: 'Ground',
    autoScroll: true,
    unstyled: true,
    bodyPadding: 15,

    initComponent: function() {
        var me = this;

        me.items = me.createFormItems();

        me.callParent(arguments);
    },

    createFormItems: function() {
        var me = this;

        me.name = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Name',
            name: 'label'
        });

        me.width = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Width',
            name: 'width'
        });

        me.height = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Height',
            name: 'height'
        });

        me.subdivs = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Subdivs',
            name: 'subdivs'
        });

        me.visibility = Ext.create('Ext.slider.Slider', {
            minValue: 0,
            maxValue: 100,
            increment: 1,
            fieldLabel: 'Visibility',
            name: 'visibility'
        });

        me.saveBtn = Ext.create('Ext.button.Button', {
            text: 'Save',
            cls: 'primary',
            type: 'save'
        });

        return [{
            xtype: 'fieldset',
            title: 'Basic settings',
            defaults: {
                anchor: '100%'
            },
            items: [
                me.name,
                me.height,
                me.width,
                me.subdivs,
                me.visibility
            ]},
            {
                xtype: 'swag-three-sixty-inspector-position'
            },
            {
                xtype: 'swag-three-sixty-inspector-rotation'
            },
            {
                xtype: 'swag-three-sixty-inspector-material'
            },
            me.saveBtn
        ];
    }
});