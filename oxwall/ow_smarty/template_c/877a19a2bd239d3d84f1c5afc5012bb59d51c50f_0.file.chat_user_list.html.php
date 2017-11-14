<?php
/* Smarty version 3.1.29, created on 2017-11-14 01:58:39
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_plugins\mailbox\views\components\chat_user_list.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abe4f5cc407_10917275',
  'file_dependency' => 
  array (
    '877a19a2bd239d3d84f1c5afc5012bb59d51c50f' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_plugins\\mailbox\\views\\components\\chat_user_list.html',
      1 => 1510588877,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abe4f5cc407_10917275 ($_smarty_tpl) {
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.input.php';
if ($_smarty_tpl->tpl_vars['useChat']->value == 'promoted') {?>
<div class="ow_chat_cont ow_hidden" id="chatPromotionBlock">
    <div class="ow_chat_wrap">
        <div class="ow_chat">
            <div class="ow_puller"></div>
            <div class="ow_chat_block_wrap ow_border">
                <div class="ow_chat_block ow_active">
                    <div class="ow_chat_block_main">
                        <div class="ow_top_panel">
                            <div class="ow_count_block">
                                <a href="javascript://" class="btn2_panel">
                                    <span class="ow_count_txt"><?php echo smarty_function_text(array('key'=>"mailbox+chat"),$_smarty_tpl);?>
</span>
                                </a>
                            </div>
                        </div>
                        <div class="ow_chat_in_block">
                            <div class="ow_chat_list showOnlineOnly ow_scrollable" style="width: 245px;">
                                <div style="display: table; height: 100%; width: 100%;">
                                    <div style="padding: 0 8px; text-align: center; font-size: 12px; display: table-cell; vertical-align: middle;">
                                        <?php echo $_smarty_tpl->tpl_vars['msg']->value;?>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ow_bot_panel">
                        <div class="ow_count_block">
                            <a href="javascript://" class="btn2_panel"><span class="ow_count_txt"><?php echo smarty_function_text(array('key'=>"mailbox+chat"),$_smarty_tpl);?>
</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php }?>

<?php if ($_smarty_tpl->tpl_vars['useChat']->value == 'available') {?>
<div class="ow_chat_cont">
    <div class="ow_chat_wrap">
        <div class="ow_chat">
            <div class="ow_puller"></div>
            <div class="ow_chat_block_wrap ow_border">
                <div class="ow_chat_block">
                    <?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>'im_user_settings_form')); $_block_repeat=true; echo smarty_block_form(array('name'=>'im_user_settings_form'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

                    <div class="ow_chat_block_main">
                        <div class="ow_top_panel">
                            <div class="ow_count_block">
                                <a href="javascript://" class="btn2_panel">
                                    <span class="ow_btn_sort_users" id="mailboxSortUsersPreference"><span class="ow_btn_sort_online"></span></span>
                                    <span class="ow_count_txt"><?php echo smarty_function_text(array('key'=>"mailbox+chat"),$_smarty_tpl);?>
</span>
                                <span class="ow_count_wrap">
									<span class="ow_count_bg totalUserOnlineCountBackground">
										<span class="ow_count totalUserOnlineCount">0</span>
									</span>
								</span>
                                </a>
                            </div>
                        </div>
                        <div class="ow_chat_in_block">
                            <div class="ow_chat_search">
                                <span><?php echo smarty_function_input(array('name'=>'im_find_contact','id'=>"im_find_contact"),$_smarty_tpl);?>
</span>
                            </div>

                            <div class="ow_chat_list" style="width: 245px;">
                                <div class="ow_chat_preloader"></div>
                                <ul></ul>
                            </div>

                        </div>
                    </div>
                    <div class="ow_bot_panel">
                        <div class="ow_count_block">
                            <a href="javascript://" class="btn2_panel"><span class="ow_count_txt"><?php echo smarty_function_text(array('key'=>"mailbox+chat"),$_smarty_tpl);?>
</span>
                                <span class="ow_count_wrap">
                                    <span class="ow_count_bg totalUserOnlineCountBackground">
                                        <span class="ow_count totalUserOnlineCount">0</span>
                                    </span>
                                </span>
                            </a>
                        </div>
                        <a href="javascript://" class="ow_btn_sound" id="mailboxSoundPreference"><span></span></a>
                    </div>
                    <?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>'im_user_settings_form'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

                </div>
            </div>
        </div>
    </div>
</div>


<div id="ow_chat_prototypes" style="display: none;">

    <div id="ow_chat_list_proto">
        <ul>
            <li>
                <a href="javascript://" class="clearfix ow_chat_item">
                    <span class="ow_chat_item_photo_wrap">
                        <span class="ow_chat_item_photo">
                            <span class="ow_chat_in_item_photo"><img src="<?php echo $_smarty_tpl->tpl_vars['avatar_proto_data']->value['src'];?>
"  width="32px" height="32px" alt="" id="contactItemAvatarUrl" /></span>
                        </span>
                    </span>
                    <span class="ow_chat_item_author">
                        <span class="ow_chat_in_item_author" id="contactItemDisplayName"></span>
                    </span>
                    <span class="ow_count_wrap ow_count_active" style="display: none;"><span class="ow_count">0</span></span>
                    <div class="ow_chat_status" id="contactProfileStatus"></div>
                </a>
            </li>
        </ul>
    </div>
</div>
<?php }
}
}
