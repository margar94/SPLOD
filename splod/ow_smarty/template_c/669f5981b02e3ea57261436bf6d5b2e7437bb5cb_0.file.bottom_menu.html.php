<?php
/* Smarty version 3.1.29, created on 2018-01-17 02:10:21
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_system_plugins\base\views\components\bottom_menu.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a5f210d486969_39532779',
  'file_dependency' => 
  array (
    '669f5981b02e3ea57261436bf6d5b2e7437bb5cb' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_system_plugins\\base\\views\\components\\bottom_menu.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a5f210d486969_39532779 ($_smarty_tpl) {
?>
<div class="ow_footer_menu">
<?php
$_from = $_smarty_tpl->tpl_vars['data']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_bottom_menu_0_saved = isset($_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu'] : false;
$__foreach_bottom_menu_0_saved_item = isset($_smarty_tpl->tpl_vars['item']) ? $_smarty_tpl->tpl_vars['item'] : false;
$__foreach_bottom_menu_0_total = $_smarty_tpl->smarty->ext->_foreach->count($_from);
$_smarty_tpl->tpl_vars['item'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu'] = new Smarty_Variable(array());
$__foreach_bottom_menu_0_iteration=0;
$_smarty_tpl->tpl_vars['item']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['item']->_loop = true;
$__foreach_bottom_menu_0_iteration++;
$_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu']->value['last'] = $__foreach_bottom_menu_0_iteration == $__foreach_bottom_menu_0_total;
$__foreach_bottom_menu_0_saved_local_item = $_smarty_tpl->tpl_vars['item'];
?>
	<a href="<?php echo $_smarty_tpl->tpl_vars['item']->value['url'];?>
"<?php if ($_smarty_tpl->tpl_vars['item']->value['active']) {?> class="active"<?php }
if ($_smarty_tpl->tpl_vars['item']->value['new_window']) {?> target="_blank"<?php }?>><?php echo $_smarty_tpl->tpl_vars['item']->value['label'];?>
</a><?php if (!(isset($_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu']->value['last'] : null)) {?> | <?php }
$_smarty_tpl->tpl_vars['item'] = $__foreach_bottom_menu_0_saved_local_item;
}
if ($__foreach_bottom_menu_0_saved) {
$_smarty_tpl->tpl_vars['__smarty_foreach_bottom_menu'] = $__foreach_bottom_menu_0_saved;
}
if ($__foreach_bottom_menu_0_saved_item) {
$_smarty_tpl->tpl_vars['item'] = $__foreach_bottom_menu_0_saved_item;
}
?>
</div><?php }
}
