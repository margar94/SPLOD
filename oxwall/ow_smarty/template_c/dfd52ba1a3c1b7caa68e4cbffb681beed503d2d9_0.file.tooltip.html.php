<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:45
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\decorators\tooltip.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b10143c1_93153128',
  'file_dependency' => 
  array (
    'dfd52ba1a3c1b7caa68e4cbffb681beed503d2d9' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\decorators\\tooltip.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b10143c1_93153128 ($_smarty_tpl) {
?>

<div class="ow_tooltip <?php if (!empty($_smarty_tpl->tpl_vars['data']->value['addClass'])) {?> <?php echo $_smarty_tpl->tpl_vars['data']->value['addClass'];
}?>">
    <div class="ow_tooltip_tail">
        <span></span>
    </div>
    <div class="ow_tooltip_body">
        <?php echo $_smarty_tpl->tpl_vars['data']->value['content'];?>

    </div>
</div><?php }
}
