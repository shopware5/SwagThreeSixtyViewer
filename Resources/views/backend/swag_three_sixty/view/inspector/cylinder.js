Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.Cylinder', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-cylinder',
    type: 'Cylinder',
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

        me.height = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Height',
            name: 'height'
        });

        me.diamTop = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Diameter Top',
            name: 'diamTop'
        });

        me.diamBottom = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Diameter Bottom',
            name: 'diamBottom'
        });

        me.tessellation = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Tesselation',
            name: 'tessellation'
        });

        me.heightSubdivs = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Height Subdivs',
            name: 'heightSubdivs'
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
                me.diamTop,
                me.diamBottom,
                me.tessellation,
                me.heightSubdivs
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