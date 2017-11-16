<?php

class SKELETON_CTRL_Floatbox extends SKELETON_CLASS_ActionController
{

    public function index()
    {
        $language = OW::getLanguage();

        OW::getDocument()->setTitle($language->text("skeleton", "floatbox_page_title"));
        OW::getDocument()->setHeading($language->text("skeleton", "floatbox_page_heading"));

/*
        $script = "$('#skeleton_floatbox').click(function(){

            window.skeletonFloatBox = new OW_FloatBox({\$title:'".OW::getLanguage()->text('skeleton', 'floatbox_title')."', \$contents: $('#floatbox_content'),height: '100%', width: '98%'});
});
";*/

$script = "$('#skeleton_floatbox').click(function(){

            skeletonAjaxFloatBox = OW.ajaxFloatBox('SKELETON_CMP_Floatbox', {} , {top:'56px', width:'calc(100vw - 112px)', height:'calc(100vh - 112px)', iconClass: 'ow_ic_add', title: '".OW::getLanguage()->text('skeleton', 'floatbox_title')."'});
})";


        OW::getDocument()->addOnloadScript($script);

    }
}