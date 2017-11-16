<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:55
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_plugins\skeleton\views\components\floatbox.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60bb590e47_07916389',
  'file_dependency' => 
  array (
    '280f3da9089c746b1e0650cf15655782c7dd22a0' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_plugins\\skeleton\\views\\components\\floatbox.html',
      1 => 1510759911,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60bb590e47_07916389 ($_smarty_tpl) {
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
?>
<style>
    .floatbox_header{
        display: none;
    }
	.floatbox_body{
		overflow:hidden;
	}
    .floatbox_bottom{
        display: none;
    }
</style>

<div id="skeleton_floatbox_content" style="width:100%;height:100%">
    <div style="width:100%;height:100%">
		<iframe width="100%" height="100%" src="http://localhost"></iframe>
	</div>

    <!--<div class='ow_right'>
        <input type="button" name="close_button" id="close_button" value="<?php echo smarty_function_text(array('key'=>'skeleton+floatbox_close'),$_smarty_tpl);?>
" />
    </div>-->
</div>

<?php }
}
