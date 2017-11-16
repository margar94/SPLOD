<?php


class SPLOD_CLASS_ActionController extends OW_ActionController
{
    protected $service;

    public function init()
    {
        //$this->service = SKELETON_BOL_Service::getInstance();
        //OW::getDocument()->addStyleSheet( OW::getPluginManager()->getPlugin('splod')->getStaticCssUrl().'splod.css' );

        OW::getNavigation()->activateMenuItem('main', 'spLOD', 'main_menu_item');

        /*if (!OW::getUser()->isAuthenticated())
        {
            $this->redirect(OW::getRouter()->urlForRoute('static_sign_in'));
        }
		*/
    }
}

