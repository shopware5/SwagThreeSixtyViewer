Ext.define('Shopware.apps.SwagThreeSixty.view.detail.Hierarchy', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.swag-three-sixty-detail-hierarchy',
    region: 'west',
    layout: 'fit',
    width: 300,
    title: 'Hierarchy',

    initComponent: function() {
        var me = this;

        me.tbar = me.createTopToolbar();

        me.items = [
            me.createHierarchyTreePanel()
        ];

        me.callParent();
    },

    createHierarchyTreePanel: function() {
        var me = this;

        return me.tree = Ext.create('Ext.tree.Panel', {
            rootVisible: false,
            style: {
                background: '#fff'
            },
            height: 200,
            store: me.hierarchyStore
        });
    },

    createTopToolbar: function() {
        var me = this;

        return Ext.create('Ext.toolbar.Toolbar', {
            items: me.createTopToolbarItems()
        });
    },
    
    createTopToolbarItems: function() {
        var me = this;

        me.addBtn = Ext.create('Ext.button.Split', {
            iconCls: 'sprite-layer--plus',
            text: 'Add new item',
            action: 'createitem',
            handler: function(btn) {
                btn.menu.showBy(btn);
            },
            menu: Ext.create('Ext.menu.Menu', {
                items: [
                    { text: 'Add 3D model', handler: function() { me.fireEvent('add-item', 'model'); } },
                    { text: 'Add arc rotate camera', handler: function() { me.fireEvent('add-item', 'camera'); } },
                    '-',
                    { text: 'Add directional light', handler: function() { me.fireEvent('add-item', 'directional-light'); } },
                    { text: 'Add point light', handler: function() { me.fireEvent('add-item', 'point-light'); } },
                    { text: 'Add spot light', handler: function() { me.fireEvent('add-item', 'spot-light'); } },
                    { text: 'Add hemispheric light', handler: function() { me.fireEvent('add-item', 'hemispheric-light'); } },
                    '-',
                    { text: 'Add cylinder', handler: function() { me.fireEvent('add-item', 'cylinder'); } },
                    { text: 'Add box', handler: function() { me.fireEvent('add-item', 'box'); } },
                    { text: 'Add ground', handler: function() { me.fireEvent('add-item', 'ground'); } },
                ]
            })
        });

        me.deleteBtn = Ext.create('Ext.button.Button', {
            iconCls: 'sprite-minus-circle-frame',
            disabled: true,
            text: 'Remove selected item',
            handler: function() {
                me.fireEvent('delete-item');
            }
        });

        return [
            me.addBtn,
            me.deleteBtn
        ];
    }
});