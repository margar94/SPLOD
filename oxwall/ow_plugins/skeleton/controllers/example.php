<?php

class SKELETON_CTRL_Example extends SKELETON_CLASS_ActionController
{

    public function index()
    {
        $language = OW::getLanguage();
        $router = OW::getRouter();

        OW::getDocument()->setTitle($language->text("skeleton", "index_page_title"));
        OW::getDocument()->setHeading($language->text("skeleton", "index_page_heading"));
        
        $skeletonMenu = array();

        $skeletonMenu[] = array(
            "label" => $language->text("skeleton", "menu_item_floatbox"),
            "url" => $router->urlForRoute("skeleton-floatbox")
        );

        $this->assign("menu", $skeletonMenu);
		
		$script = "$('#skeleton_floatbox').click(function(){

            skeletonAjaxFloatBox = OW.ajaxFloatBox('SKELETON_CMP_Floatbox', {} , {top:'56px', width:'calc(100vw - 112px)', height:'calc(100vh - 112px)', iconClass: 'ow_ic_add', title: '".OW::getLanguage()->text('skeleton', 'floatbox_title')."'});
})";


        OW::getDocument()->addOnloadScript($script);
    }

}