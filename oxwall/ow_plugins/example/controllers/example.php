<?php


class EXAMPLE_CTRL_Example extends OW_ActionController
{
    public function init()
    {
        OW::getDocument()->addStyleSheet( OW::getPluginManager()->getPlugin('example')->getStaticCssUrl().'example.css' );

        OW::getNavigation()->activateMenuItem('main', 'example', 'main_menu_item');
    }
	
	public function index()
    {
		OW::getDocument()->setTitle('This is an example');
        OW::getDocument()->setDescription('We hope that it wil work');
		OW::getDocument()->setHeading('Does it work?');
	}
}

