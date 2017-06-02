Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.Box', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-box',
    type: 'Box',
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

        me.size = Ext.create('Ext.form.field.Number', {
            fieldLabel: 'Size',
            name: 'size'
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
                me.size,
                me.autoRotateField
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