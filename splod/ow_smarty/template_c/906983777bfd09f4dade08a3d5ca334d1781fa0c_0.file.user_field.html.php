<?php
/* Smarty version 3.1.29, created on 2017-12-14 06:04:23
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_plugins\mailbox\views\components\user_field.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a3284e758de86_88567250',
  'file_dependency' => 
  array (
    '906983777bfd09f4dade08a3d5ca334d1781fa0c' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_plugins\\mailbox\\views\\components\\user_field.html',
      1 => 1470306118,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a3284e758de86_88567250 ($_smarty_tpl) {
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.text.php';
echo $_smarty_tpl->tpl_vars['input']->value;?>

<input name="mailbox_new_message_user" id="mailbox_new_message_user" type="text" class="invitation userFieldInputControl" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="<?php echo smarty_function_text(array('key'=>'mailbox+to'),$_smarty_tpl);?>
" />
<div style="display: block;" class="ow_mailchat_autocomplete" id="userFieldAutocompleteControl">
    <div class="ow_mailchat_autocomplete_inner">
        <ul style="display: block;" id="userFieldUserList">
            <li class="clearfix" style="display: none;" id="userFieldUserListItem-notfound">
                <span class="ow_chat_user_not_found"><?php echo smarty_function_text(array('key'=>"mailbox+user_not_found"),$_smarty_tpl);?>
</span>
            </li>
        </ul>
    </div>
</div>

<ul style="display: none;" id="userFieldUserListPrototype">
    <li style="display: none;" id="userFieldUserListItemPrototype" class="userFieldUserListItem">
        <a class="clearfix ow_chat_item" href="javascript://">
            <span class="ow_chat_item_photo_wrap">
                <span class="ow_chat_item_photo">
                    <span class="ow_chat_in_item_photo"><img width="32px" height="32px" alt="" src="<?php echo $_smarty_tpl->tpl_vars['defaultAvatarUrl']->value;?>
" id="userFieldUserListItemAvatarUrl"></span>
                </span>
            </span>
            <span class="ow_chat_item_author">
                <span class="ow_chat_in_item_author" id="userFieldUserListItemUsername"></span>
            </span>
        </a>
    </li>
</ul>
<?php }
}
