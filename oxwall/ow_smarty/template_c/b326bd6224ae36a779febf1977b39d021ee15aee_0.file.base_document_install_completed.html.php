<?php
/* Smarty version 3.1.29, created on 2017-11-14 01:58:38
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\controllers\base_document_install_completed.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abe4edf9e50_99716157',
  'file_dependency' => 
  array (
    'b326bd6224ae36a779febf1977b39d021ee15aee' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\controllers\\base_document_install_completed.html',
      1 => 1510588878,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abe4edf9e50_99716157 ($_smarty_tpl) {
if (!is_callable('smarty_function_url_for_route')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.url_for_route.php';
?>
<div class="ow_txtcenter" style="margin-top:200px;">
    <h1 class="ow_icon_control ow_ic_ok ow_smallmargin">
       Installation complete
    </h1>
    <p>
       Go to the
       <a href="<?php echo smarty_function_url_for_route(array('for'=>'base_index'),$_smarty_tpl);?>
">main page</a> or to the <a href="<?php echo smarty_function_url_for_route(array('for'=>'admin_default'),$_smarty_tpl);?>
">admin area</a>
    </p>
</div>
<?php }
}
