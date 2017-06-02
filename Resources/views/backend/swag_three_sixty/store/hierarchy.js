Ext.define('Shopware.apps.SwagThreeSixty.store.Hierarchy', {
    extend: 'Ext.data.TreeStore',
    model: 'Shopware.apps.SwagThreeSixty.model.SceneObject',

    proxy: {
        type:'ajax',
        url: '{url action="getTree"}',

        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});