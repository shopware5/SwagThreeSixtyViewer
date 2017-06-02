Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.SpotLight', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-spot-light',
    type: 'SpotLight',
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
                html: 'A spot light is defined by a position, a direction, an angle, and an exponent. These values define a cone of light starting from the position, emitting toward the direction.'
            }]
        });
    },

    createFormItems: function() {
        var me = this;

        me.name = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Name',
            name: 'label'
        });

        me.intensityField = Ext.create('Ext.slider.Slider', {
            minValue: 0,
            maxValue: 100,
            increment: 1,
            fieldLabel: 'Intensity',
            name: 'intensity',
            helpText: 'Controls the global intensity of the light'
        });

        me.angleField = Ext.create('Ext.form.field.Number', {
            minValue: 0,
            maxValue: 100,
            fieldLabel: 'Angle',
            name: 'angle',
            helpText: 'The size of the spotlight beam'
        });

        me.exponentField = Ext.create('Ext.form.field.Number', {
            minValue: 0,
            maxValue: 100,
            fieldLabel: 'Exponent',
            name: 'exponent',
            helpText: 'The speed of the decay of the light with distance'
        });

        me.generateShadowField = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: 'Shadows',
            boxLabel: 'Generate dynamic shadows',
            name: 'shadowGenerator',
            inputValue: 'true',
            uncheckedValue: 'false'
        });

        me.rangeField = Ext.create('Ext.form.field.Number', {
            name: 'range',
            fieldLabel: 'Range',
            helpText: 'Sets how far the light reaches',
            minValue: 0,
            maxValue: 1000,
        });

        me.diffuseColorField = Ext.create('Shopware.form.field.ColorField', {
            fieldName: 'Color',
            name: 'diffuseColor'
        });

        me.diffuseColorFieldset = Ext.create('Ext.form.FieldSet', {
            title: 'Diffuse Color',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'swag-three-sixty-detail-help',
                    html: 'The diffuse is the native color of the object material once it is lit with a light.',
                },
                me.diffuseColorField
            ]
        });

        me.specularColorField = Ext.create('Shopware.form.field.ColorField', {
            fieldName: 'Color',
            name: 'specularColor'
        });

        me.specularColorFieldset = Ext.create('Ext.form.FieldSet', {
            title: 'Specular Color',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'swag-three-sixty-detail-help',
                    html: 'The specular is the color produced by a light reflecting from a surface.',
                },
                me.specularColorField
            ]
        });

        me.saveBtn = Ext.create('Ext.button.Button', {
            text: 'Save',
            cls: 'primary',
            type: 'save'
        });

        return [
            me.createInfoContainer(), {
                xtype: 'fieldset',
                title: 'Basic settings',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    me.name,
                    me.intensityField,
                    me.angleField,
                    me.exponentField,
                    me.rangeField,
                    me.generateShadowField
                ]
            },
            {
                xtype: 'swag-three-sixty-inspector-direction'
            },
            {
                xtype: 'swag-three-sixty-inspector-position'
            },
            me.diffuseColorFieldset,
            me.specularColorFieldset,
            me.saveBtn
        ];
    }
});