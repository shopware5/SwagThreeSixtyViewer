Ext.define('Shopware.apps.SwagThreeSixty.controller.Main', {
    extend: 'Enlight.app.Controller',

    refs: [
        { ref: 'mainGrid', selector: 'swag-three-sixty-list-grid' },
        { ref: 'viewer', selector: 'swag-three-sixty-detail-viewer' }
    ],

    init: function() {
        var me = this;

        me.control({
            'swag-three-sixty-list-grid': {
                'selection-change': me.selectionChange,
                'edit-scene': me.editScene,
                'delete-scene': me.deleteScene,
                'create-scene': me.createScene
            }
        });

        me.mainWindow = me.getView('main.Window').create({ });
        me.subApplication.setAppWindow(me.mainWindow);
        me.mainWindow.show();

        me.callParent(arguments);
    },

    editScene: function(record) {
        var me = this,
            store;

        store = Ext.create('Shopware.apps.SwagThreeSixty.store.Hierarchy').load({
            params: {
                sceneId: record.get('id')
            }
        });

        store.on('load', function(store, node) {
            if (!node.raw.hasOwnProperty('rootNode')) {
                return;
            }
            var data = {},
                config;

            Ext.each(node.childNodes, function(item) {
                config = item.raw.config;
                data[item.data.id] = item.raw;
            });
            config = node.raw.config;
            data[node.data.id] = node.raw;

            me.getViewer().fireEvent('data-changed', data);
        });

        me.getView('detail.Window').create({
            record: record,
            hierarchyStore: store
        }).show();
    },

    selectionChange: function(selection) {
        var me = this,
            grid = me.getMainGrid();

        grid.deleteBtn.setDisabled(selection.length < 1);
    },

    deleteScene: function(selection) {
        var me = this,
            grid = me.getMainGrid(),
            store = grid.getStore();

        selection = Ext.Array.map(selection, function(item) {
            return item.get('id');
        });

        grid.setLoading(true);
        Ext.Ajax.request({
            url: '{url controller="SwagThreeSixty" action="destroyScenes"}',
            params: {
                'ids[]': selection
            },
            success: function() {
                grid.setLoading(false);
                store.load();
            },
            failure: function() {
                grid.setLoading(false);
            }
        });
    },

    createScene: function() {
        var me = this,
            record;

        record = Ext.create('Shopware.apps.SwagThreeSixty.model.SceneObject', {
            label: 'Scene (root)',
            config: {
                type: 'Scene',
                label: 'Scene (root)',
                antiAliasing: 'none',
                backdrop: '',
                backgroundColor: '',
                ambientColor: '',
                fogMode: 0,
                fogDensity: 0.1,
                fogColor: '#000000',
                fogStart: 20.0,
                fogEnd: 60.0
            }
        });

        record.save({

            // Get the id of the created record to get an association for the child elements
            callback: function(records, operation) {
                var response = JSON.parse(operation.response.responseText);
                record.set('id', response.data.id);

                me.editScene(record);
                me.getMainGrid().getStore().load();
            }
        });
    }
});