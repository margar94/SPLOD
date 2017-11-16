<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:45
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_plugins\mailbox\views\components\console_list.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b10c4063_90191707',
  'file_dependency' => 
  array (
    '0c34d41c02a27d6acb686add3b22f783959cd6c5' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_plugins\\mailbox\\views\\components\\console_list.html',
      1 => 1510588877,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b10c4063_90191707 ($_smarty_tpl) {
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
?>
<div class="ow_console_list_wrapper OW_ConsoleListContainer">
    <div class="ow_nocontent OW_ConsoleListNoContent"><?php echo smarty_function_text(array('key'=>'base+empty_list'),$_smarty_tpl);?>
</div>
    <ul class="ow_console_list OW_ConsoleList"></ul>
    <div class="ow_preloader_content ow_console_list_preloader OW_ConsoleListPreloader" style="visibility: hidden"></div>
</div>

<div class="<?php if ($_smarty_tpl->tpl_vars['mailModeEnabled']->value && $_smarty_tpl->tpl_vars['isAuthorizedSendMessage']->value) {?>ow_console_messages_btns<?php } else { ?>ow_console_messages_btn<?php }?> clearfix">
    <div class="ow_console_messages_viewall"><a href="<?php echo $_smarty_tpl->tpl_vars['viewAllUrl']->value;?>
"><?php echo smarty_function_text(array('key'=>"mailbox+view_all"),$_smarty_tpl);?>
</a></div>
    <?php if ($_smarty_tpl->tpl_vars['mailModeEnabled']->value && $_smarty_tpl->tpl_vars['isAuthorizedSendMessage']->value) {?><div class="ow_console_messages_send"><a href="javascript://" id="mailboxConsoleListSendMessageBtn" ><?php echo smarty_function_text(array('key'=>"mailbox+send_message"),$_smarty_tpl);?>
</a></div><?php }?>
</div><?php }
}
