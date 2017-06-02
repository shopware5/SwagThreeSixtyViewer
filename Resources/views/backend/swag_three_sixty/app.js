Ext.define('Shopware.apps.SwagThreeSixty', {
    extend: 'Enlight.app.SubApplication',
    name: 'Shopware.apps.SwagThreeSixty',

    bulkLoad: true,
    loadPath: '{url action=load}',

    models: [
        'SceneObject'
    ],

    stores: [
        'List',
        'Hierarchy'
    ],

    controllers: [
        'Main',
        'Detail'
    ],

    views: [
        'main.Grid',
        'main.Window',

        'detail.Hierarchy',
        'detail.Inspector',
        'detail.Viewer',
        'detail.Window',
        'detail.DescriptionText',

        'inspector.Scene',
        'inspector.DirectionalLight',
        'inspector.PointLight',
        'inspector.SpotLight',
        'inspector.HemisphericLight',
        'inspector.Camera',
        'inspector.Box',
        'inspector.Ground',
        'inspector.Model',
        'inspector.Cylinder',

        'inspector.common.PositionFieldset',
        'inspector.common.DirectionFieldset',
        'inspector.common.MaterialFieldset',
        'inspector.common.RotationFieldset',
        'inspector.common.ScalingFieldset'
    ],

    launch: function() {
        return this.getController('Main').mainWindow;
    }
});