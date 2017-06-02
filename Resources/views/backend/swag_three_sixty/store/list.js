Ext.define('Shopware.apps.SwagThreeSixty.store.List', {
    extend: 'Ext.data.Store',
    model: 'Shopware.apps.SwagThreeSixty.model.SceneObject',

    proxy: {
        type:'ajax',
        url: '{url action="getList"}',

        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});