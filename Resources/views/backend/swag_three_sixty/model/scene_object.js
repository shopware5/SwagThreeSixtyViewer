Ext.define('Shopware.apps.SwagThreeSixty.model.SceneObject', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'scene_id', type: 'int', defaults: null },
        { name: 'label', type: 'string' },
        { name: 'text', dataIndex: 'label', type: 'string' },
        { name: 'config', type: 'object' },
        { name: 'createdAt', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'updatedAt', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'children', type: 'array' }
    ],
    proxy: {
        type:'ajax',
        api: {
            destroy: '{url action="destroyScene"}',
            update: '{url action="saveScene"}',
            create: '{url action="saveScene"}'
        }
    }
});