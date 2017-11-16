<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:52
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_plugins\skeleton\views\controllers\example_index.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b8d0a658_21233087',
  'file_dependency' => 
  array (
    'eb88d415ea72287aaa2eb26eb2bd19a770275f0d' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_plugins\\skeleton\\views\\controllers\\example_index.html',
      1 => 1510760444,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b8d0a658_21233087 ($_smarty_tpl) {
?>
<ul class="skeleton-menu">
    <?php
$_from = $_smarty_tpl->tpl_vars['menu']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_menuItem_0_saved_item = isset($_smarty_tpl->tpl_vars['menuItem']) ? $_smarty_tpl->tpl_vars['menuItem'] : false;
$_smarty_tpl->tpl_vars['menuItem'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['menuItem']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['menuItem']->value) {
$_smarty_tpl->tpl_vars['menuItem']->_loop = true;
$__foreach_menuItem_0_saved_local_item = $_smarty_tpl->tpl_vars['menuItem'];
?>
        <li>
			<a id="skeleton_floatbox" href="javascript://"><?php echo $_smarty_tpl->tpl_vars['menuItem']->value['label'];?>
</a>
            <!--<a href="<?php echo $_smarty_tpl->tpl_vars['menuItem']->value['url'];?>
"><?php echo $_smarty_tpl->tpl_vars['menuItem']->value['label'];?>
</a>-->
        </li>
    <?php
$_smarty_tpl->tpl_vars['menuItem'] = $__foreach_menuItem_0_saved_local_item;
}
if ($__foreach_menuItem_0_saved_item) {
$_smarty_tpl->tpl_vars['menuItem'] = $__foreach_menuItem_0_saved_item;
}
?>
</ul><?php }
}
