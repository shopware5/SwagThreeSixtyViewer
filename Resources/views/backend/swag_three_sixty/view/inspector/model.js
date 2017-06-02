Ext.define('Shopware.apps.SwagThreeSixty.view.inspector.Model', {
    extend: 'Ext.form.Panel',
    alias: 'widget.swag-three-sixty-inspector-model',
    type: 'Model',
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

        me.model = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Model',
            name: 'model',
            required: true
        });

        /*
         me.model = Ext.create('Ext.form.field.Text', {
         fieldLabel: 'Model',
         name: 'model',
         required: true,
         supportText: 'Path to your model, must be a obj or babylon file'
         });
         */

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
                me.model
            ]},
            {
                xtype: 'swag-three-sixty-inspector-position'
            },
            {
                xtype: 'swag-three-sixty-inspector-scaling'
            },
            {
                xtype: 'swag-three-sixty-inspector-rotation'
            },
            me.saveBtn
        ];
    }
});