{extends file="parent:frontend/detail/index.tpl"}

{block name='frontend_detail_image_default_image_element'}
    {block name='frontend_detail_swag_three_sixty_index_image_element'}
        {include file="frontend/detail/swag_three_sixty/model.tpl"}
    {/block}
{/block}

{block name="frontend_index_header_javascript_jquery_lib"}
    {block name="frontend_index_swag_three_sixty_header_javascript_jquery_lib"}
        <script type="text/javascript" src="{link file="backend/_public/js/babylon.custom.js"}"></script>
    {/block}
    {$smarty.block.parent}
{/block}

{block name='frontend_detail_image_thumbnail_items'}
    <a href="#"
       title="{s name="DetailThumbnailText" namespace="frontend/detail/index"}{/s}: {$alt}"
       class="thumbnail--link is--active">
        {block name='frontend_detail_image_thumbs_main_img'}
            <img srcset="http://www.freeiconspng.com/uploads/3d-icon-0.png"
                 alt="{s name="DetailThumbnailText" namespace="frontend/detail/index"}{/s}: {$alt}"
                 title="{s name="DetailThumbnailText" namespace="frontend/detail/index"}{/s}: {$alt|truncate:160}"
                 class="thumbnail--image" />
        {/block}
    </a>

    {$smarty.block.parent}
{/block}