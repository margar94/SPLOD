<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:44
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\console_dropdown_menu.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b0e93297_80376422',
  'file_dependency' => 
  array (
    '8eb7dc0bdb1da7bf588be550f02fb49f52a95138' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\console_dropdown_menu.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b0e93297_80376422 ($_smarty_tpl) {
?>
<ul class="ow_console_dropdown">
    <?php
$_from = $_smarty_tpl->tpl_vars['items']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_cddm_0_saved = isset($_smarty_tpl->tpl_vars['__smarty_foreach_cddm']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_cddm'] : false;
$__foreach_cddm_0_saved_item = isset($_smarty_tpl->tpl_vars['sitems']) ? $_smarty_tpl->tpl_vars['sitems'] : false;
$__foreach_cddm_0_saved_key = isset($_smarty_tpl->tpl_vars['section']) ? $_smarty_tpl->tpl_vars['section'] : false;
$__foreach_cddm_0_total = $_smarty_tpl->smarty->ext->_foreach->count($_from);
$_smarty_tpl->tpl_vars['sitems'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['__smarty_foreach_cddm'] = new Smarty_Variable(array());
$_smarty_tpl->tpl_vars['section'] = new Smarty_Variable();
$__foreach_cddm_0_iteration=0;
$_smarty_tpl->tpl_vars['sitems']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['section']->value => $_smarty_tpl->tpl_vars['sitems']->value) {
$_smarty_tpl->tpl_vars['sitems']->_loop = true;
$__foreach_cddm_0_iteration++;
$_smarty_tpl->tpl_vars['__smarty_foreach_cddm']->value['last'] = $__foreach_cddm_0_iteration == $__foreach_cddm_0_total;
$__foreach_cddm_0_saved_local_item = $_smarty_tpl->tpl_vars['sitems'];
?>
        <?php
$_from = $_smarty_tpl->tpl_vars['sitems']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_item_1_saved_item = isset($_smarty_tpl->tpl_vars['item']) ? $_smarty_tpl->tpl_vars['item'] : false;
$_smarty_tpl->tpl_vars['item'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['item']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['item']->value) {
$_smarty_tpl->tpl_vars['item']->_loop = true;
$__foreach_item_1_saved_local_item = $_smarty_tpl->tpl_vars['item'];
?>
            <li class="<?php if (!empty($_smarty_tpl->tpl_vars['item']->value['class'])) {
echo $_smarty_tpl->tpl_vars['item']->value['class'];
}?> ow_dropdown_menu_item ow_cursor_pointer" >
                <div class="ow_console_dropdown_cont">
                    <a href="<?php echo $_smarty_tpl->tpl_vars['item']->value['url'];?>
"><?php echo $_smarty_tpl->tpl_vars['item']->value['label'];?>
</a>
                </div>
            </li>
        <?php
$_smarty_tpl->tpl_vars['item'] = $__foreach_item_1_saved_local_item;
}
if ($__foreach_item_1_saved_item) {
$_smarty_tpl->tpl_vars['item'] = $__foreach_item_1_saved_item;
}
?>

        <?php if (!(isset($_smarty_tpl->tpl_vars['__smarty_foreach_cddm']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_cddm']->value['last'] : null)) {?>
            <li><div class="ow_console_divider"></div></li>
        <?php }?>
    <?php
$_smarty_tpl->tpl_vars['sitems'] = $__foreach_cddm_0_saved_local_item;
}
if ($__foreach_cddm_0_saved) {
$_smarty_tpl->tpl_vars['__smarty_foreach_cddm'] = $__foreach_cddm_0_saved;
}
if ($__foreach_cddm_0_saved_item) {
$_smarty_tpl->tpl_vars['sitems'] = $__foreach_cddm_0_saved_item;
}
if ($__foreach_cddm_0_saved_key) {
$_smarty_tpl->tpl_vars['section'] = $__foreach_cddm_0_saved_key;
}
?>
</ul><?php }
}
