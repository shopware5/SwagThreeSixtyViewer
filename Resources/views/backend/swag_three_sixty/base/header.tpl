{extends file="parent:backend/base/header.tpl"}

{block name="backend/base/header/css"}
    {$smarty.block.parent}

    <link rel="stylesheet" href="{link file="backend/_public/css/swag_three_sixty.css"}?{Shopware::REVISION}">
{/block}

{block name="backend/base/header/javascript"}
    {$smarty.block.parent}
    <script type="text/javascript" src="{link file='backend/_public/js/babylon.custom.js'}?{Shopware::REVISION}"></script>
{/block}