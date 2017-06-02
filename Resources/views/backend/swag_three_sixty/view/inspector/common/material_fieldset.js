Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.common.MaterialFieldset', {
    extend: 'Ext.container.Container',
    alias: 'widget.swag-three-sixty-inspector-material',
    prefix: '',

    initComponent: function() {
        var me = this,
            specular = me.createMaterialFieldset({
                prefix: 'specular',
                title: 'Specular',
                helpText: 'The specular is the color produced by a light reflecting from a surface. '
            }),
            bump = me.createMaterialFieldset({
                prefix: 'bump',
                title: 'Bump Map',
                helpText: 'The bump texture simulates bumps and dents using a map called a normal map.'
            });

        bump.remove(1);

        specular.insert(1, {
            xtype: 'numberfield',
            fieldLabel: 'Power',
            name: 'specularPower',
            helpText: 'The specular power defines the size of the highlight',
            minValue: 0,
            maxValue: 100,
            labelWidth: 75
        });

        me.wireframeField = Ext.create('Ext.form.field.Checkbox', {
            fieldLabel: 'Show wireframe',
            name: 'wireframe',
            inputValue: 'true',
            uncheckedValue: 'false',
            boxLabel: 'The object will be displayed in wireframe mode'
        });

        me.items = [{
            xtype: 'fieldset',
            title: 'Material settings',
            collapsible: true,
            items: [
                me.wireframeField,
                me.createMaterialFieldset({
                    prefix: 'diffuse',
                    title: 'Diffuse texture',
                    helpText: 'The diffuse is the native color of the object material once it is lit with a light.'
                }),
                me.createMaterialFieldset({
                    prefix: 'emissive',
                    title: 'Emissive texture',
                    helpText: 'The emissive is the color produced by the object itself.'
                }),
                me.createMaterialFieldset({
                    prefix: 'ambient',
                    title: 'Ambient texture',
                    helpText: 'The ambient can be seen as a second level of diffuse. The produced color is multiplied to the diffuse color.'
                }),
                specular,
                bump
            ]
        }];

        me.callParent(arguments);
    },

    createMaterialFieldset: function(config) {
        var me = this;

        me.diffuseColorField = Ext.create('Shopware.form.field.ColorField', {
            fieldLabel: 'Color',
            labelWidth: 75,
            name: config.prefix + 'Color'
        });

        me.diffuseTexture = Ext.create('Shopware.form.field.MediaSelection', {
            fieldLabel: 'Texture',
            labelWidth: 75,
            readOnly: false,
            name: config.prefix + 'Texture'
        });

        me.diffuseTextureFieldset = Ext.create('Ext.form.FieldSet', {
            collapsible: true,
            collapsed: true,
            title: 'Texture offset & scale',
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Offset',
                layout: 'hbox',
                labelWidth: 50,
                defaults: {
                    flex: 1,
                },
                items: [{
                    xtype: 'numberfield',
                    name: config.prefix + 'TextureUOffset',
                    supportText: 'uOffset'
                }, {
                    xtype: 'numberfield',
                    name: config.prefix + 'TextureVOffset',
                    supportText: 'vOffset'
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'Scale',
                layout: 'hbox',
                labelWidth: 50,
                defaults: {
                    flex: 1
                },
                items: [{
                    xtype: 'numberfield',
                    name: config.prefix + 'TextureUScale',
                    supportText: 'uScale'
                }, {
                    xtype: 'numberfield',
                    name: config.prefix + 'TextureVScale',
                    supportText: 'vScale'
                }]
            }]
        });

        me.diffuseColorFieldset = Ext.create('Ext.form.FieldSet', {
            title: config.title,
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'swag-three-sixty-detail-help',
                    html: config.helpText,
                },
                me.diffuseColorField,
                me.diffuseTexture,
                me.diffuseTextureFieldset
            ]
        });

        return me.diffuseColorFieldset;
    }
});