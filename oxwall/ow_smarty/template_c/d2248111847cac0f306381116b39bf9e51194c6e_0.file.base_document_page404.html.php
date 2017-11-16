<?php
/* Smarty version 3.1.29, created on 2017-11-16 03:31:10
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\controllers\base_document_page404.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0d76fe5ee222_13895550',
  'file_dependency' => 
  array (
    'd2248111847cac0f306381116b39bf9e51194c6e' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\controllers\\base_document_page404.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0d76fe5ee222_13895550 ($_smarty_tpl) {
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
if (!empty($_smarty_tpl->tpl_vars['base404RedirectMessage']->value)) {
echo $_smarty_tpl->tpl_vars['base404RedirectMessage']->value;
} else {
echo smarty_function_text(array('key'=>'base+base_document_404'),$_smarty_tpl);
}
}
}
