<?php
/* Smarty version 3.1.29, created on 2017-11-16 01:11:19
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\custom_html_widget.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0d56379e2270_10139080',
  'file_dependency' => 
  array (
    '72676bbda9118ea33e4d56d8cc5a5197e95b1c2a' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\custom_html_widget.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0d56379e2270_10139080 ($_smarty_tpl) {
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
?>
<div class="ow_custom_html_widget">
	<?php if ($_smarty_tpl->tpl_vars['content']->value) {?>
		<?php echo $_smarty_tpl->tpl_vars['content']->value;?>

	<?php } else { ?>
            <div class="ow_nocontent">
                <?php echo smarty_function_text(array('key'=>"base+custom_html_widget_no_content"),$_smarty_tpl);?>

            </div>
	<?php }?>
</div><?php }
}
