Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.PointLight', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-point-light',
    type: 'PointLight',
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
                html: 'A point light is a light defined by an unique point in world space. The light is emitted in every direction from this point. A good example of a point light is the sun.'
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
            supportText: 'Controls the global intensity of the light'
        });

        me.rangeField = Ext.create('Ext.form.field.Number', {
            name: 'range',
            fieldLabel: 'Range',
            helpText: 'Sets how far the light reaches',
            minValue: 0,
            maxValue: 1000
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

        me.generateShadowField = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: 'Shadows',
            boxLabel: 'Generate dynamic shadows',
            name: 'shadowGenerator',
            inputValue: 'true',
            uncheckedValue: 'false'
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
                    me.rangeField,
                    me.generateShadowField
                ]},
            {
                xtype: 'swag-three-sixty-inspector-position'
            },
            me.diffuseColorFieldset,
            me.specularColorFieldset,
            me.saveBtn
        ];
    }
});