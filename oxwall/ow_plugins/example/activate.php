<?php
OW::getNavigation()->deleteMenuItem('example', 'main_menu_item');
OW::getNavigation()->addMenuItem(OW_Navigation::MAIN, 'example-index', 'example', 'main_menu_item', OW_Navigation::VISIBLE_FOR_MEMBER);
