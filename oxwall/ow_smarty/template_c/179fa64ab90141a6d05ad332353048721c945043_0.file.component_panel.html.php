<?php
/* Smarty version 3.1.29, created on 2017-11-16 01:11:19
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\controllers\component_panel.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0d5637b709d3_45821354',
  'file_dependency' => 
  array (
    '179fa64ab90141a6d05ad332353048721c945043' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\controllers\\component_panel.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0d5637b709d3_45821354 ($_smarty_tpl) {
if (!empty($_smarty_tpl->tpl_vars['permissionMessage']->value)) {?>
    <div class="ow_anno ow_center">
        <?php echo $_smarty_tpl->tpl_vars['permissionMessage']->value;?>

    </div>
<?php } else { ?>
	<?php if (isset($_smarty_tpl->tpl_vars['profileActionToolbar']->value)) {?>
		<?php echo $_smarty_tpl->tpl_vars['profileActionToolbar']->value;?>

	<?php }?>

	<?php echo $_smarty_tpl->tpl_vars['componentPanel']->value;?>

<?php }
}
}
