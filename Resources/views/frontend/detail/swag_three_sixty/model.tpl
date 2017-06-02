{block name='frontend_detail_swag_three_sixty_index_image_container'}
    <div class="babylon-renderer--container"
         data-swag-three-sixty-viewer="true">
        <template class="babylon-renderer--data">{$sThreeSixtyModel|json_encode}</template>
        <canvas class="babylon-renderer"></canvas>

        <div class="babylon-renderer--actions">
            <a href="#fullscreen" class="actions--item item--fullscreen"><i class="icon--resize-enlarge"></i></a>
        </div>
    </div>
{/block}