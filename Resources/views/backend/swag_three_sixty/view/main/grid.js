Ext.define('Shopware.apps.SwagThreeSixty.view.main.Grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.swag-three-sixty-list-grid',

    initComponent: function() {
        var me = this;

        me.store = Ext.create('Shopware.apps.SwagThreeSixty.store.List').load();
        me.tbar = me.createTopToolbar();
        me.bbar = me.createPagingBar();
        me.selModel = me.createSelectionModel();

        me.columns = me.createColumns();

        me.callParent(arguments);
    },

    createColumns: function() {
        var me = this;

        return [{
            text: '#',
            dataIndex: 'id'
        }, {
            text: 'Name',
            dataIndex: 'label',
            flex: 1,
            renderer: me.createHighlightRenderer
        }, {
            text: 'Created At',
            dataIndex: 'createdAt',
            renderer: me.createCreatedAtDateRenderer
        }, {
            text: 'Updated At',
            dataIndex: 'updatedAt',
            renderer: me.createUpdatedAtDateRenderer
        }, {
            xtype: 'actioncolumn',
            header: '{s name=grid/column/action}Actions{/s}',
            width: 80,
            border: 0,
            menuDisabled: true,
            draggable: false,
            sortable: false,
            groupable: false,
            items: [{
                iconCls: 'sprite-minus-circle',
                tooltip: 'Delete scene',
                handler: function(view, rowIndex, colIndex, item, opts, record) {
                    me.fireEvent('delete-scene', [ record ]);
                }
            }, {
                iconCls: 'sprite-pencil',
                tooltip: 'Edit scene',
                handler: function(view, rowIndex, colIndex, item, opts, record) {
                    me.fireEvent('edit-scene', record);
                }
            }]
        }];
    },

    createHighlightRenderer: function(value) {
        return Ext.String.format('<b>[0]</b>', value);
    },

    createCreatedAtDateRenderer: function(value, style, record) {
        return this.createDateRenderer('createdAt', record);
    },

    createUpdatedAtDateRenderer: function(value, style, record) {
        return this.createDateRenderer('updatedAt', record);
    },

    createDateRenderer: function(fieldName, record) {
        return Ext.Date.format(record.data[fieldName], Ext.Date.defaultFormat);
    },

    createTopToolbar: function() {
        var me = this;

        me.addBtn = Ext.create('Ext.button.Button', {
            text: 'Add new scene',
            action: 'create-scene',
            iconCls: 'sprite-plus-circle-frame',
            handler: function() {
                me.fireEvent('create-scene');
            }
        });

        me.deleteBtn = Ext.create('Ext.button.Button', {
            text: 'Remove selected scene(s)',
            disabled: true,
            action: 'delete-scene',
            iconCls: 'sprite-minus-circle-frame',
            handler: function() {
                me.fireEvent('delete-scene', me.getSelectionModel().getSelection());
            }
        });

        return Ext.create('Ext.toolbar.Toolbar', {
            ui: 'shopware-ui',
            items: [
                me.addBtn,
                me.deleteBtn
            ]
        });
    },

    createSelectionModel: function() {
        var me = this;

        return Ext.create('Ext.selection.CheckboxModel', {
            listeners:{
                selectionchange:function (sm, selections) {
                    me.fireEvent('selection-change', selections);
                }
            }
        });
    },

    createPagingBar:function () {
        var me = this;

        return Ext.create('Ext.toolbar.Paging', {
            store: me.store,
            displayInfo: true
        });
    },
});