Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.HemisphericLight', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-hemispheric-light',
    type: 'HemisphericLight',
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
                html: 'A hemispheric light is an easy way to simulate realistic ambient environment light.'
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

        me.groundColorField = Ext.create('Shopware.form.field.ColorField', {
            fieldName: 'Color',
            name: 'groundColor'
        });

        me.groundColorFieldset = Ext.create('Ext.form.FieldSet', {
            title: 'Ground Color',
            defaults: {
                anchor: '100%'
            },
            items: [
                me.groundColorField
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
                    me.intensityField
                ]},
            me.diffuseColorFieldset,
            me.specularColorFieldset,
            me.groundColorFieldset,
            me.saveBtn
        ];
    }
});