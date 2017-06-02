Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.Camera', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-camera',
    type: 'ArcRotateCamera',
    autoScroll: true,
    unstyled: true,
    bodyPadding: 15,

    initComponent: function() {
        var me = this;

        me.items = me.createFormItems();

        me.callParent(arguments);
    },

    createInfoContainer: function() {
        return Ext.create('Ext.form.FieldSet', {
            items: [{
                xtype: 'swag-three-sixty-detail-help',
                html: 'An Arc Rotate Camera is a type of camera that rotates around a given target pivot. It can be controlled with cursors and mouse or with touch events.'
            }]
        });
    },


    createFormItems: function() {
        var me = this;

        me.name = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Name',
            name: 'label'
        });

        me.antiAliasField = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Anti-Aliasing',
            name: 'antiAliasing',
            store: me.createAntiAliasingStore(),
            displayField: 'display',
            valueField: 'value'
        });

        me.autoRotateField = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: 'Auto Rotate',
            name: 'autoRotate',
            boxLabel: 'Camera automatically rotates around the target',
            inputValue: 'true',
            uncheckedValue: 'false'
        });

        me.autoRotateSpeedField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Auto Rotate Speed',
            name: 'rotateSpeed',
            min: 0,
            max: 5,
            decimalPrecision: 4
        });

        me.panningSensibilityField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Panning Sensibility',
            name: 'panningSensibility',
            min: -1000,
            max: 1000,
            decimalPrecision: 4
        });

        me.lowerRadiusLimitField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Lower Radius Limit',
            name: 'lowerRadiusLimit',
            min: -1000,
            max: 1000,
            decimalPrecision: 4
        });

        me.upperRadiusLimitField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Upper Radius Limit',
            name: 'upperRadiusLimit',
            min: -1000,
            max: 1000,
            decimalPrecision: 4
        });

        me.lowerBetaLimitField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Lower Beta Limit',
            name: 'lowerBetaLimit',
            min: -1000,
            max: 1000,
            decimalPrecision: 4
        });

        me.upperBetaLimitField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Upper Beta Limit',
            name: 'upperBetaLimit',
            min: -1000,
            max: 1000,
            decimalPrecision: 4
        });

        me.saveBtn = Ext.create('Ext.button.Button', {
            text: 'Save',
            cls: 'primary',
            type: 'save'
        });

        return [me.createInfoContainer(), {
            xtype: 'fieldset',
            title: 'Basic settings',
            defaults: {
                anchor: '100%'
            },
            items: [
                me.name,
                me.antiAliasField,
                me.autoRotateField,
                me.autoRotateSpeedField,
                me.panningSensibilityField,
                me.lowerRadiusLimitField,
                me.upperRadiusLimitField,
                me.lowerBetaLimitField,
                me.upperBetaLimitField,
                me.angleField
            ]},
            {
                xtype: 'swag-three-sixty-inspector-position'
            },
            me.saveBtn
        ];
    },

    createAntiAliasingStore: function() {
        return Ext.create('Ext.data.Store', {
            fields: [ 'value', 'display' ],
            data: [
                { value: 'none', display: 'None' },
                { value: 'fxaa', display: 'FXAA' },
                { value: 'fsaa', display: 'FSAA 4x' }
            ]
        });
    }
});