Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.Scene', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-scene',
    type: 'Scene',
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
                html: 'Represents a scene to be rendered by the engine.'
            }]
        });
    },

    createFormItems: function() {
        var me = this;

        me.labelField = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Name',
            name: 'label'
        });

        me.backdropSelectionField = Ext.create('Shopware.form.field.MediaSelection', {
            fieldLabel: 'Backdrop',
            name: 'backdrop',
            readOnly: false
        });

        me.backgroundColor = Ext.create('Shopware.form.field.ColorField', {
            fieldLabel: 'Background color',
            name: 'backgroundColor'
        });

        me.ambientColor = Ext.create('Shopware.form.field.ColorField', {
            fieldLabel: 'Ambient color',
            name: 'ambientColor',
            helpText: "It's used in conjunction with a mesh's material ambient color to determine a final ambient color for the mesh material."
        });

        me.saveBtn = Ext.create('Ext.button.Button', {
            text: 'Save',
            cls: 'primary',
            type: 'save'
        });

        return [me.createInfoContainer(), {
            xtype: 'fieldset',
            title: 'Basic settings',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [
                me.labelField,
                me.backdropSelectionField,
                me.backgroundColor,
                me.ambientColor
            ]
        }, me.createFogFieldSet(), me.saveBtn];
    },

    createFogFieldSet: function() {
        var me = this;

        return Ext.create('Ext.form.FieldSet', {
            title: 'Fog settings',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: me.createFogFieldSetItems()
        });
    },

    createFogFieldSetItems: function() {
        var me = this;

        me.fogModeComboBox = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Fog Mode',
            name: 'fogMode',
            store: me.createFogComboBoxStore(),
            queryMode: 'local',
            displayField: 'label',
            valueField: 'value',
            listeners: {
                scope: me,
                change: Ext.bind(me.onChangeFogMode, me)
            }
        });

        me.fogDensityField = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Fog Density',
            name: 'fogDensity',
            value: 0.1,
            decimalPrecision: 4,
            minValue: 0,
            maxValue: 1,
            disabled: true
        });

        me.fogColor = Ext.create('Shopware.form.field.ColorField', {
            fieldLabel: 'Fog color',
            name: 'fogColor',
            disabled: true
        });

        me.fogFieldContainer = Ext.create('Ext.form.FieldContainer', {
            fieldLabel: 'Fog Distance',
            disabled: true,
            layout: 'hbox',
            defaults: {
                flex: 1
            },
            items: [{
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 100,
                name: 'fogStart',
                supportText: 'Start',
                decimalPrecision: 4,
            }, {
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 100,
                name: 'fogEnd',
                supportText: 'End',
                decimalPrecision: 4
            }]
        });

        return [
            me.fogModeComboBox,
            me.fogColor,
            me.fogDensityField,
            me.fogFieldContainer
        ];
    },

    createFogComboBoxStore: function() {
        return Ext.create('Ext.data.Store', {
            fields: [ 'label', 'value'],
            data: [
                { label: 'None', value: BABYLON.Scene.FOGMODE_NONE },
                { label: 'Exponential Fog #1', value: BABYLON.Scene.FOGMODE_EXP },
                { label: 'Exponential Fog #2', value: BABYLON.Scene.FOGMODE_EXP2 },
                { label: 'Linear', value: BABYLON.Scene.FOGMODE_LINEAR }
            ]
        });
    },

    onChangeFogMode: function(comboBox, value) {
        var me = this;

        if (value === BABYLON.Scene.FOGMODE_EXP || value === BABYLON.Scene.FOGMODE_EXP2) {
            me.fogDensityField.setDisabled(false);
            me.fogFieldContainer.setDisabled(true);
            me.fogColor.setDisabled(false);

            return;
        } else if (value === BABYLON.Scene.FOGMODE_LINEAR) {
            me.fogDensityField.setDisabled(true);
            me.fogFieldContainer.setDisabled(false);
            me.fogColor.setDisabled(false);

            return;
        }

        me.fogDensityField.setDisabled(true);
        me.fogFieldContainer.setDisabled(true);
        me.fogColor.setDisabled(true);

        return;
    }
});